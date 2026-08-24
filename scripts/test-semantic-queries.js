import { searchCatalogSemantic } from '../src/services/semanticSearch.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appContent = fs.readFileSync(path.resolve(__dirname, '../src/App.jsx'), 'utf-8');
const catalogMatch = appContent.match(/export const CATALOG = (\[[\s\S]*?\n\]);/);
const catalog = (new Function('return ' + catalogMatch[1]))();

const testQueries = [
  'that citrus fruit',
  'cold breakfast drink',
  'something to put on toast',
  'warm morning brew',
  'snack for my dog',
  'organic salad greens',
  'tangy salad dressing',
];

async function run() {
  for (const q of testQueries) {
    const res = await searchCatalogSemantic(q, catalog);
    console.log(`\nQuery: "${q}"`);
    console.log(` -> Top match: ${res.match?.name} (${res.match?.category}) | score=${res.score}`);
    console.log(` -> Top 3:`, res.matches.slice(0, 3).map(m => `${m.name} [${m.category}] (${m.similarityScore})`));
  }
}

run().catch(console.error);
