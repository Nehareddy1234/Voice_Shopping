/**
 * Client-Side Semantic Search Fallback Engine
 * Uses @xenova/transformers (WASM / ONNX runtime) for browser feature-extraction.
 * Lazy-loads model weights on first fallback trigger.
 * Cosine similarity matching against precomputed catalog embeddings.
 */

import catalogEmbeddingsData from '../assets/catalog-embeddings.json' with { type: 'json' };

// Singleton model pipeline reference & loading state
let extractorPromise = null;
let modelLoading = false;
let modelReady = false;
const progressListeners = new Set();

export function onModelProgress(callback) {
  progressListeners.add(callback);
  return () => progressListeners.delete(callback);
}

function notifyProgress(status) {
  for (const listener of progressListeners) {
    try {
      listener(status);
    } catch (e) {
      console.error('Progress listener error:', e);
    }
  }
}

export function isModelLoaded() {
  return modelReady;
}

export function isModelLoading() {
  return modelLoading;
}

/**
 * Lazy loads the Transformers.js feature extraction pipeline.
 * Only downloaded and initialized when a semantic fallback search is first needed.
 */
export async function getEmbeddingPipeline() {
  if (extractorPromise) return extractorPromise;

  modelLoading = true;
  notifyProgress({ stage: 'init', message: 'Initializing smart search model…', progress: 0 });

  extractorPromise = (async () => {
    try {
      // Dynamic import to keep initial bundle completely free of transformers WASM/runtime
      const { pipeline, env } = await import('@xenova/transformers');

      // Configure transformers.js browser environment
      if (typeof window !== 'undefined') {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
      }

      const modelName = catalogEmbeddingsData.model || 'Xenova/bge-small-en-v1.5';

      const extractor = await pipeline('feature-extraction', modelName, {
        quantized: true,
        progress_callback: (progressInfo) => {
          if (progressInfo.status === 'progress') {
            notifyProgress({
              stage: 'downloading',
              file: progressInfo.file,
              progress: progressInfo.progress || 0,
              message: `Downloading smart search model (${Math.round(progressInfo.progress || 0)}%)…`,
            });
          } else if (progressInfo.status === 'done') {
            notifyProgress({
              stage: 'file_done',
              file: progressInfo.file,
              message: `Loaded ${progressInfo.file}`,
            });
          }
        },
      });

      modelReady = true;
      modelLoading = false;
      notifyProgress({ stage: 'ready', message: 'Smart search ready', progress: 100 });
      return extractor;
    } catch (error) {
      modelLoading = false;
      extractorPromise = null;
      notifyProgress({ stage: 'error', message: 'Failed to load model', error });
      throw error;
    }
  })();

  return extractorPromise;
}

/**
 * Computes dot product (cosine similarity for L2-normalized unit vectors).
 */
export function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

/**
 * Embeds a given query text using the lazy-loaded pipeline.
 */
export async function embedQuery(queryText) {
  const extractor = await getEmbeddingPipeline();
  const output = await extractor(queryText.trim(), { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Performs semantic fallback search against precomputed catalog embeddings.
 *
 * @param {string} rawQuery - The user query or item name that failed rule-based matching.
 * @param {Array} catalog - The canonical catalog array.
 * @param {Object} options - Search options (threshold, limit, maxPrice, category).
 * @returns {Promise<{ match: Object|null, matches: Array, isSemantic: boolean, score: number }>}
 */
export async function searchCatalogSemantic(
  rawQuery,
  catalog,
  { similarityThreshold = 0.60, limit = 5, maxPrice = null, isOrganic = null } = {},
) {
  const query = String(rawQuery || '').trim();
  if (!query) {
    return { match: null, matches: [], isSemantic: true, score: 0 };
  }

  const queryVector = await embedQuery(query);
  const catalogLookup = new Map(catalog.map((item) => [item.id, item]));

  const scoredItems = [];

  for (const entry of catalogEmbeddingsData.items) {
    const product = catalogLookup.get(entry.id);
    if (!product) continue;
    if (maxPrice !== null && product.price > maxPrice) continue;
    if (isOrganic !== null && product.isOrganic !== isOrganic) continue;

    const similarity = cosineSimilarity(queryVector, entry.vector);
    if (similarity >= similarityThreshold) {
      scoredItems.push({
        ...product,
        similarityScore: Number(similarity.toFixed(4)),
        isSemanticMatch: true,
      });
    }
  }

  // Sort descending by cosine similarity score
  scoredItems.sort((a, b) => b.similarityScore - a.similarityScore);

  const topMatches = scoredItems.slice(0, limit);
  const topMatch = topMatches.length > 0 ? topMatches[0] : null;

  return {
    match: topMatch,
    matches: topMatches,
    isSemantic: true,
    score: topMatch ? topMatch.similarityScore : 0,
  };
}
