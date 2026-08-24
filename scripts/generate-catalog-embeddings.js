import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appPath = path.resolve(__dirname, '../src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf-8');

async function loadCatalogAndAliases() {
  // Extract CATALOG array JSON
  const catalogMatch = appContent.match(/export const CATALOG = (\[[\s\S]*?\n\]);/);
  if (!catalogMatch) throw new Error('Could not extract CATALOG from App.jsx');
  
  let catalog;
  try {
    const fn = new Function(`return ${catalogMatch[1]}`);
    catalog = fn();
  } catch (e) {
    throw new Error(`Failed to parse CATALOG: ${e.message}`);
  }

  // Extract ALIASES object
  const aliasesMatch = appContent.match(/const ALIASES = ({[\s\S]*?\n};);/);
  let aliases = {};
  if (aliasesMatch) {
    try {
      const fn = new Function(`return ${aliasesMatch[1]}`);
      aliases = fn();
    } catch (e) {
      console.warn('Could not parse ALIASES directly, continuing with empty aliases', e);
    }
  }

  return { catalog, aliases };
}

// Inverted alias lookup: map canonical English item names to their regional synonyms
function buildAliasLookup(aliases) {
  const reverseMap = {};
  for (const [lang, langAliases] of Object.entries(aliases)) {
    for (const [aliasTerm, canonicalTerm] of Object.entries(langAliases)) {
      const lowerCanonical = canonicalTerm.toLowerCase();
      if (!reverseMap[lowerCanonical]) reverseMap[lowerCanonical] = new Set();
      reverseMap[lowerCanonical].add(`${aliasTerm} (${lang})`);
    }
  }
  return reverseMap;
}

const DEPARTMENT_DESCRIPTIONS = {
  produce: 'fresh produce, fruits, vegetables, salad, raw greens, citrus',
  'dairy-eggs': 'dairy and eggs, milk, cheese, butter, yogurt, cream, breakfast spreads',
  'meat-seafood': 'meat and seafood, poultry, beef, pork, fish, steaks, turkey, bacon',
  bakery: 'bakery and bread, loaves, buns, pastries, bagels, muffins',
  pantry: 'pantry staples, pasta, rice, flour, grains, spices, oils, honey, spreads, peanut butter, condiments, cooking ingredients',
  frozen: 'frozen foods, ice cream, frozen meals, frozen vegetables, frozen berries, pizza, waffles',
  snacks: 'snacks and sweets, chips, chocolate, cookies, candies, crackers, nuts, popcorn',
  beverages: 'beverages and drinks, coffee, tea, juice, sparkling water, soda, morning brew',
  'personal-care': 'personal care, body wash, shampoo, soap, oral care, moisturizer, sunscreen',
  household: 'household essentials, cleaning, paper towels, detergent, trash bags, dish soap',
  baby: 'baby care, diapers, baby wipes, baby formula, baby food',
  pet: 'pet supplies, dog food, cat food, dog treats, pet snacks, cat litter, animal care',
};

async function main() {
  console.log('--- Generating Precomputed Catalog Embeddings ---');
  const { catalog, aliases } = await loadCatalogAndAliases();
  const aliasLookup = buildAliasLookup(aliases);

  console.log(`Loaded ${catalog.length} catalog items.`);

  const modelName = process.env.MODEL_NAME || 'Xenova/bge-small-en-v1.5';
  console.log(`Initializing feature-extraction pipeline with model: ${modelName}...`);

  const extractor = await pipeline('feature-extraction', modelName, {
    quantized: true,
  });

  console.log('Computing embeddings for all catalog items...');
  const startTime = Date.now();

  const embeddings = [];

  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const itemNameLower = item.name.toLowerCase();
    
    // Find aliases associated with this item
    const matchedAliases = Array.from(aliasLookup[itemNameLower] || []);
    
    // Build descriptive text representation for optimal semantic dense retrieval
    const aliasStr = matchedAliases.length > 0 ? ` Related names: ${matchedAliases.join(', ')}.` : '';
    const deptInfo = DEPARTMENT_DESCRIPTIONS[item.category] || item.category;
    const organicStr = item.isOrganic ? 'organic ' : '';
    const textToEmbed = `${organicStr}${item.name}. ${item.name} (${item.brand}). Aisle: ${deptInfo}.${aliasStr}`.trim();

    // Compute embedding with mean pooling and L2 normalization
    const output = await extractor(textToEmbed, { pooling: 'mean', normalize: true });
    const vector = Array.from(output.data);

    embeddings.push({
      id: item.id,
      name: item.name,
      category: item.category,
      vector: vector.map((v) => Number(v.toFixed(6))), // 6 decimal precision for compact JSON
    });

    if ((i + 1) % 100 === 0 || i === catalog.length - 1) {
      console.log(`Progress: ${i + 1}/${catalog.length} items embedded (${Math.round(((i + 1) / catalog.length) * 100)}%)`);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Completed embedding generation in ${durationSec}s.`);

  const outputPayload = {
    model: modelName,
    dimension: embeddings[0].vector.length,
    generatedAt: new Date().toISOString(),
    itemCount: embeddings.length,
    items: embeddings,
  };

  const outputDirSrc = path.resolve(__dirname, '../src/assets');
  const outputDirPublic = path.resolve(__dirname, '../public');

  if (!fs.existsSync(outputDirSrc)) fs.mkdirSync(outputDirSrc, { recursive: true });
  if (!fs.existsSync(outputDirPublic)) fs.mkdirSync(outputDirPublic, { recursive: true });

  const srcFilePath = path.join(outputDirSrc, 'catalog-embeddings.json');
  const publicFilePath = path.join(outputDirPublic, 'catalog-embeddings.json');

  const jsonString = JSON.stringify(outputPayload);
  fs.writeFileSync(srcFilePath, jsonString, 'utf-8');
  fs.writeFileSync(publicFilePath, jsonString, 'utf-8');

  const fileSizeKb = (Buffer.byteLength(jsonString, 'utf-8') / 1024).toFixed(1);
  console.log(`Saved catalog embeddings to:\n -> ${srcFilePath} (${fileSizeKb} KB)\n -> ${publicFilePath} (${fileSizeKb} KB)`);
  console.log('Done!');
}

main().catch((err) => {
  console.error('Failed to generate catalog embeddings:', err);
  process.exit(1);
});
