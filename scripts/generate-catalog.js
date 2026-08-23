import fs from 'fs';
import path from 'path';
import https from 'https';
import zlib from 'zlib';
import readline from 'readline';

/**
 * Open Food Facts Data Extraction & Catalog Generator
 * Endpoint: https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz
 * (Redirects to: https://openfoodfacts-ds.s3.eu-west-3.amazonaws.com/openfoodfacts-products.jsonl.gz)
 *
 * Expands catalog from baseline (105 items) to ~350-400 items across 12 departments.
 */

const BASE_URL = 'https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz';

const DEPARTMENTS = [
  'produce',
  'dairy-eggs',
  'meat-seafood',
  'bakery',
  'pantry',
  'frozen',
  'snacks',
  'beverages',
  'personal-care',
  'household',
  'baby',
  'pet',
];

const PRICE_RANGES = {
  produce: { min: 1.49, max: 5.99 },
  'dairy-eggs': { min: 2.29, max: 6.49 },
  'meat-seafood': { min: 4.99, max: 15.99 },
  bakery: { min: 2.49, max: 5.99 },
  pantry: { min: 1.29, max: 9.99 },
  frozen: { min: 2.49, max: 7.99 },
  snacks: { min: 1.99, max: 6.49 },
  beverages: { min: 1.49, max: 6.99 },
  'personal-care': { min: 2.99, max: 12.99 },
  household: { min: 2.99, max: 14.99 },
  baby: { min: 1.99, max: 19.99 },
  pet: { min: 3.49, max: 18.99 },
};

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function cleanName(raw) {
  if (!raw) return '';
  return titleCase(
    raw
      .replace(/[\u2122\u00AE\u00A9]/g, '') // remove tm, r, c
      .replace(/^(organic|usda|natural|pure|fresh)\s+/i, '')
      .replace(/[^\w\s\-&',]/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function determineCategory(name, cats, tags) {
  const combined = `${name} ${(cats || []).join(' ')} ${(tags || []).join(' ')}`.toLowerCase();

  if (/dog|cat|kitten|puppy|litter|kibble|pet food|bird seed|fish flakes|canine|feline/i.test(combined)) return 'pet';
  if (/baby|diaper|infant|toddler|wipe|puree|formula|nappy|pacifier/i.test(combined)) return 'baby';
  if (/detergent|paper towel|trash bag|cleaner|sponge|dish soap|foil|light bulb|bleach|softener|disinfectant/i.test(combined)) return 'household';
  if (/shampoo|conditioner|soap|toothpaste|moisturizer|sunscreen|deodorant|lotion|razor|body wash|cream|body scrub|floss/i.test(combined)) return 'personal-care';
  if (/water|tea|coffee|juice|soda|cola|drink|beverage|kombucha|lemonade|cider|smoothie|seltzer/i.test(combined)) return 'beverages';
  if (/chip|cookie|cracker|chocolate|candy|snack|popcorn|pretzel|granola bar|gummy|trail mix|nuts|cashew|almond snack|wafer/i.test(combined)) return 'snacks';
  if (/frozen|ice cream|pizza|waffle|burrito|dumpling|fish stick|frozen veggie|frozen fruit|sorbet|gelato/i.test(combined)) return 'frozen';
  if (/bread|bagel|croissant|muffin|bun|tortilla|baguette|toast|pastry|roll|brioche|pita/i.test(combined)) return 'bakery';
  if (/chicken|beef|pork|turkey|salmon|shrimp|fish|meat|steak|bacon|sausage|seafood|tuna|lamb|prosciutto|cod/i.test(combined)) return 'meat-seafood';
  if (/milk|cheese|yogurt|butter|cream|egg|dairy|cheddar|mozzarella|cottage cheese|brie|gouda|sour cream/i.test(combined)) return 'dairy-eggs';
  if (/apple|banana|orange|lemon|lime|spinach|kale|carrot|onion|tomato|avocado|strawberry|berry|fruit|vegetable|produce|salad|potato|pepper|mango|grape|cucumber|broccoli|garlic|zucchini/i.test(combined)) return 'produce';
  if (/pasta|rice|oil|flour|sauce|bean|cereal|grain|spice|honey|peanut butter|sugar|soup|vinegar|salt|oatmeal|lentil|marinara|syrup/i.test(combined)) return 'pantry';

  return null;
}

function determineSeason(name, cat) {
  const n = name.toLowerCase();
  if (cat === 'produce') {
    if (/apple|squash|pumpkin|kale|sweet potato|pear/i.test(n)) return ['fall', 'winter'];
    if (/berry|strawberry|blueberry|peach|watermelon|corn|tomato|cherry|mango/i.test(n)) return ['summer'];
    if (/asparagus|peas|artichoke|radish|spinach|lettuce/i.test(n)) return ['spring'];
    if (/citrus|orange|lemon|lime|grapefruit/i.test(n)) return ['winter', 'spring'];
  }
  if (/ice cream|sunscreen|lemonade|iced tea|sorbet|popsicle/i.test(n)) return ['summer'];
  if (/hot chocolate|soup|cider|chili/i.test(n)) return ['fall', 'winter'];
  return ['all'];
}

function determineUnit(name, quantity) {
  const combined = `${name} ${quantity || ''}`.toLowerCase();
  if (/lb|pound|kg|gram/i.test(combined)) return 'lb';
  if (/bottle|jar|fl oz|liter|litre|ml/i.test(combined)) return 'bottle';
  if (/carton|gallon|quart|pint/i.test(combined)) return 'carton';
  if (/can|tins/i.test(combined)) return 'can';
  if (/box|pack|count|ct/i.test(combined)) return 'box';
  if (/loaf/i.test(combined)) return 'loaf';
  if (/dozen/i.test(combined)) return 'dozen';
  if (/bag/i.test(combined)) return 'bag';
  if (/roll/i.test(combined)) return 'roll';
  if (/tub/i.test(combined)) return 'tub';
  return 'pack';
}

function cleanSize(name, quantity, unit) {
  if (quantity && quantity.trim().length > 0 && quantity.length < 25) {
    return quantity.trim();
  }
  if (unit === 'lb') return '1 lb';
  if (unit === 'bottle') return '16 oz bottle';
  if (unit === 'carton') return '32 oz carton';
  if (unit === 'can') return '12 oz can';
  if (unit === 'box') return '12 oz box';
  if (unit === 'dozen') return '12 ct';
  if (unit === 'loaf') return '20 oz loaf';
  if (unit === 'bag') return '16 oz bag';
  return 'standard size';
}

function generatePrice(category, isOrganic) {
  const range = PRICE_RANGES[category] || { min: 2.99, max: 7.99 };
  const base = range.min + Math.random() * (range.max - range.min);
  const adjusted = isOrganic ? base * 1.15 : base;
  return Number(adjusted.toFixed(2));
}

// Fetch and stream OFF jsonl export
function run() {
  console.log('Fetching Open Food Facts export stream...');
  const existingAppPath = path.resolve('src/App.jsx');
  const appSource = fs.readFileSync(existingAppPath, 'utf8');

  // Extract existing baseline 105 catalog items
  const catalogMatch = appSource.match(/export const CATALOG = \[([\s\S]*?)\];\s*\n\s*\/\* -/);
  if (!catalogMatch) {
    console.error('Could not find existing CATALOG in src/App.jsx');
    process.exit(1);
  }

  // Parse baseline items
  const baselineCode = `[${catalogMatch[1]}]`;
  const baselineCatalog = eval(baselineCode);
  console.log(`Found ${baselineCatalog.length} existing baseline items in CATALOG.`);

  const existingIds = new Set(baselineCatalog.map((i) => i.id));
  const existingNames = new Set(baselineCatalog.map((i) => i.name.toLowerCase()));

  // Setup streaming
  function streamOFF(url) {
    https.get(url, { headers: { 'User-Agent': 'VoiceShoppingDemoCatalogGenerator/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return streamOFF(res.headers.location);
      }
      if (res.statusCode !== 200) {
        console.error('HTTP Error:', res.statusCode);
        process.exit(1);
      }

      const gunzip = zlib.createGunzip();
      const rl = readline.createInterface({ input: res.pipe(gunzip), crlfDelay: Infinity });

      const newItems = [];
      const deptCounts = Object.fromEntries(DEPARTMENTS.map((d) => [d, baselineCatalog.filter((i) => i.category === d).length]));
      const TARGET_PER_DEPT = 30; // 12 depts * 30 = 360 total items
      let rawScanned = 0;

      rl.on('line', (line) => {
        rawScanned++;
        try {
          const p = JSON.parse(line);
          const rawName = p.product_name || p.product_name_en;
          if (!rawName || rawName.length < 3 || rawName.length > 45) return;

          const name = cleanName(rawName);
          const lower = name.toLowerCase();
          if (name.length < 3 || existingNames.has(lower)) return;

          const cat = determineCategory(name, p.categories_tags, p._keywords);
          if (!cat) return;

          if (deptCounts[cat] >= TARGET_PER_DEPT) {
            const allComplete = DEPARTMENTS.every((d) => deptCounts[d] >= TARGET_PER_DEPT);
            if (allComplete) {
              rl.close();
            }
            return;
          }

          let brand = (p.brands && cleanName(p.brands).split(',')[0]) || 'Market Select';
          if (!brand || brand.length > 25) brand = 'Market Select';

          const isOrganic = /organic|bio/i.test(`${name} ${(p.labels_tags || []).join(' ')}`);
          const unit = determineUnit(name, p.quantity);
          const size = cleanSize(name, p.quantity, unit);
          const price = generatePrice(cat, isOrganic);
          const onSale = Math.random() < 0.15; // ~15% on sale
          const salePrice = onSale ? Number((price * (0.68 + Math.random() * 0.18)).toFixed(2)) : null;
          const season = determineSeason(name, cat);
          let id = lower.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

          if (!id || existingIds.has(id)) {
            id = `${id}-${Math.floor(Math.random() * 1000)}`;
          }

          const newItem = {
            id,
            name: isOrganic && !name.toLowerCase().includes('organic') ? `Organic ${name}` : name,
            category: cat,
            price,
            unit,
            brand,
            size,
            isOrganic,
            inStock: Math.random() > 0.05, // 95% in stock
            onSale,
            salePrice,
            season,
            substitutes: [],
          };

          existingIds.add(newItem.id);
          existingNames.add(newItem.name.toLowerCase());
          newItems.push(newItem);
          deptCounts[cat]++;
        } catch (e) {}
      });

      rl.on('close', () => {
        console.log(`Scan completed. Raw records scanned: ${rawScanned}, New OFF items curated: ${newItems.length}`);
        const fullCatalog = [...baselineCatalog, ...newItems];

        // Intelligent substitutes cross-wiring for plant milks / dairy / produce / snacks / etc.
        for (const item of fullCatalog) {
          if (item.substitutes.length > 0) continue;
          const nameLower = item.name.toLowerCase();

          // Milk / Plant milk substitutes
          if (/oat milk/i.test(nameLower)) {
            const match = fullCatalog.find((o) => /almond milk/i.test(o.name) && o.id !== item.id);
            if (match) item.substitutes.push(match.name);
          } else if (/almond milk|soy milk|coconut milk/i.test(nameLower)) {
            const match = fullCatalog.find((o) => /oat milk/i.test(o.name) && o.id !== item.id);
            if (match) item.substitutes.push(match.name);
          } else if (/whole milk|skim milk|2% milk/i.test(nameLower)) {
            const match = fullCatalog.find((o) => /oat milk/i.test(o.name) && o.id !== item.id);
            if (match) item.substitutes.push(match.name);
          }
          // Pasta / Rice
          else if (/pasta|spaghetti|penne/i.test(nameLower)) {
            const match = fullCatalog.find((o) => /quinoa|rice/i.test(o.name) && o.id !== item.id);
            if (match) item.substitutes.push(match.name);
          }
          // Greens
          else if (/spinach/i.test(nameLower)) {
            const match = fullCatalog.find((o) => /kale/i.test(o.name) && o.id !== item.id);
            if (match) item.substitutes.push(match.name);
          } else if (/kale/i.test(nameLower)) {
            const match = fullCatalog.find((o) => /spinach/i.test(o.name) && o.id !== item.id);
            if (match) item.substitutes.push(match.name);
          }
          // Snacks
          else if (/chips/i.test(nameLower)) {
            const match = fullCatalog.find((o) => /pretzels|popcorn/i.test(o.name) && o.id !== item.id);
            if (match) item.substitutes.push(match.name);
          }
        }

        console.log(`Total expanded catalog size: ${fullCatalog.length}`);
        console.log('Department breakdown:');
        DEPARTMENTS.forEach((d) => {
          console.log(`  - ${d}: ${fullCatalog.filter((i) => i.category === d).length} items`);
        });

        // Format code string
        const formattedCatalog = fullCatalog
          .map((item) => `  ${JSON.stringify(item)},`)
          .join('\n');

        const newCatalogBlock = `export const CATALOG = [\n${formattedCatalog}\n];`;
        const updatedApp = appSource.replace(/export const CATALOG = \[[\s\S]*?\];/, newCatalogBlock);

        fs.writeFileSync(existingAppPath, updatedApp, 'utf8');
        console.log('Updated src/App.jsx with expanded catalog!');
        process.exit(0);
      });
    });
  }

  streamOFF(BASE_URL);
}

run();
