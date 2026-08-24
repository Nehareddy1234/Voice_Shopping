/* Throwaway verification harness for the pure logic exported from App.jsx.
 * Bundled with esbuild and executed with Node - not part of the shipped app. */
import {
  parseIntent,
  searchCatalog,
  findSubstitute,
  detectLanguage,
  detectRestockContext,
  splitMultiItems,
  detectMultiItem,
  splitMultiCommands,
  hasExplicitActionVerb,
  pickPhrase,
  sanitizeLLMResponse,
  LLM_SYSTEM_PROMPT,
  RETRY_LANGUAGE_CHAIN,
  singular,
  CATALOG,
  DEPARTMENTS,
} from '../src/App.jsx';

let failures = 0;
const check = (label, actual, expected) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (!pass) failures += 1;
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label} | got=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`);
};

// --- Dataset contract ---
check('catalog has 800+ items', CATALOG.length >= 800, true);
check('12 departments defined', DEPARTMENTS.length, 12);
const usedCategories = new Set(CATALOG.map((item) => item.category));
check('all 12 departments populated', usedCategories.size, 12);
check('all departments have at least 40 items', DEPARTMENTS.every((d) => CATALOG.filter((i) => i.category === d.id).length >= 40), true);
const schemaKeys = ['id', 'name', 'category', 'price', 'unit', 'brand', 'size', 'isOrganic', 'inStock', 'onSale', 'salePrice', 'season', 'substitutes'];
check('every item matches canonical schema', CATALOG.every((item) => JSON.stringify(Object.keys(item).sort()) === JSON.stringify([...schemaKeys].sort())), true);
check('every item has onSale boolean', CATALOG.every((item) => typeof item.onSale === 'boolean'), true);
check('at least 10 items on sale', CATALOG.filter((item) => item.onSale).length >= 10, true);
check('onSale items have valid salePrice', CATALOG.filter((item) => item.onSale).every((item) => typeof item.salePrice === 'number' && item.salePrice < item.price), true);
check('every item has a non-empty size', CATALOG.every((item) => typeof item.size === 'string' && item.size.length > 0), true);
check('size attribute search matches "500ml"', searchCatalog('500ml').length > 0, true);
check('size attribute search matches "large"', searchCatalog('large').some((item) => /large/i.test(item.size)), true);
check('ids are unique', new Set(CATALOG.map((item) => item.id)).size, CATALOG.length);
check('substitutes are arrays of names', CATALOG.every((item) => Array.isArray(item.substitutes) && item.substitutes.every((s) => typeof s === 'string')), true);

// --- Intent parsing: English ---
let r = parseIntent('add 2 bottles of almond milk', 'en');
check('EN add action', r.action, 'ADD');
check('EN add qty', r.quantity, 2);
check('EN add unit', r.unit, 'bottle');
check('EN add item', r.itemName, 'almond milk');

r = parseIntent('Yo, add 2 cartons of oat milk', 'en');
check('EN casual add qty', r.quantity, 2);
check('EN casual add unit', r.unit, 'carton');
check('EN casual add item', r.itemName, 'oat milk');

r = parseIntent('Add a dozen eggs', 'en');
check('EN dozen qty', r.quantity, 12);
check('EN dozen item', r.itemName, 'egg');

r = parseIntent('Find organic apples under $5', 'en');
check('EN search action', r.action, 'SEARCH');
check('EN search item', r.itemName, 'organic apple');
check('EN search price', r.maxPrice, 5);

r = parseIntent('find dark chocolate less than 4 dollars', 'en');
check('EN price words', r.maxPrice, 4);

r = parseIntent('remove the eggs', 'en');
check('EN remove action', r.action, 'REMOVE');
check('EN remove item', r.itemName, 'egg');

r = parseIntent('change milk to three', 'en');
check('EN update action', r.action, 'UPDATE');
check('EN update qty word', r.quantity, 3);
check('EN update item', r.itemName, 'milk');

r = parseIntent('set eggs to 6', 'en');
check('EN update digit qty', r.quantity, 6);
check('EN update digit item', r.itemName, 'egg');

r = parseIntent('cambia leche a dos', 'es');
check('ES update action', r.action, 'UPDATE');
check('ES update qty', r.quantity, 2);

r = parseIntent('clear the list', 'en');
check('EN clear action', r.action, 'CLEAR');

// --- Spanish ---
r = parseIntent('Añadir leche', 'es');
check('ES add action', r.action, 'ADD');
check('ES alias leche -> milk', r.itemName, 'milk');

r = parseIntent('agrega tres botellas de leche', 'es');
check('ES qty', r.quantity, 3);
check('ES unit botellas', r.unit, 'bottle');
check('ES alias item', r.itemName, 'milk');

// --- French ---
r = parseIntent('Ajouter du pain', 'fr');
check('FR add action', r.action, 'ADD');
check('FR alias pain -> bread', r.itemName, 'bread');

r = parseIntent('ajoute deux kilos de tomates', 'fr');
check('FR qty', r.quantity, 2);
check('FR unit kilo', r.unit, 'kilo');
check('FR alias tomates', r.itemName, 'tomatoes');

// --- Hindi / Hinglish ---
r = parseIntent('doodh add karo', 'hi');
check('HI hinglish add action', r.action, 'ADD');
check('HI alias doodh -> milk', r.itemName, 'milk');

r = parseIntent('Pyaz teen kilo add karo', 'hi');
check('HI qty word teen', r.quantity, 3);
check('HI unit kilo', r.unit, 'kilo');
check('HI alias pyaz -> onion', r.itemName, 'onion');

r = parseIntent('सेब जोड़ो', 'hi');
check('HI devanagari action', r.action, 'ADD');
check('HI devanagari alias seb -> apples', r.itemName, 'apples');

// --- German ---
r = parseIntent('Füge Kaffee hinzu', 'de');
check('DE add action', r.action, 'ADD');
check('DE alias kaffee -> coffee', r.itemName, 'coffee');

r = parseIntent('füge zwei kilo äpfel hinzu', 'de');
check('DE qty', r.quantity, 2);
check('DE unit kilo', r.unit, 'kilo');
check('DE alias apfel -> apples', r.itemName, 'apples');

// --- Language detection (Multi-locale regression suite) ---
check('detect EN add milk with ES fallback', detectLanguage('add milk', 'es').short, 'en');
check('detect EN bare milk with ES fallback', detectLanguage('milk', 'es').short, 'en');
check('detect EN two bottles of milk with ES fallback', detectLanguage('two bottles of milk', 'es').short, 'en');
check('detect EN add apples', detectLanguage('add apples', 'es').short, 'en');
check('detect EN find oranges', detectLanguage('find oranges', 'es').short, 'en');
check('detect EN orange juice', detectLanguage('orange juice', 'es').short, 'en');
check('detect EN clear list', detectLanguage('clear list', 'es').short, 'en');
check('detect EN remove eggs', detectLanguage('remove eggs', 'es').short, 'en');
check('detect EN change milk to 3', detectLanguage('change milk to 3', 'es').short, 'en');

check('detect ES añade leche por favor', detectLanguage('añade leche por favor', 'en').short, 'es');
check('detect ES agregar dos botellas de leche', detectLanguage('agregar dos botellas de leche', 'en').short, 'es');
check('detect ES bare leche with EN fallback', detectLanguage('leche', 'en').short, 'es');
check('detect ES buscar manzanas', detectLanguage('buscar manzanas', 'en').short, 'es');

check('detect FR ajouter du pain', detectLanguage('ajouter du pain', 'en').short, 'fr');
check('detect FR deux bouteilles de lait', detectLanguage('deux bouteilles de lait', 'en').short, 'fr');
check('detect FR bare fromage', detectLanguage('fromage', 'en').short, 'fr');

check('detect HI by devanagari script', detectLanguage('दूध जोड़ो', 'en').short, 'hi');
check('detect HI hinglish doodh add karo', detectLanguage('doodh add karo', 'en').short, 'hi');
check('detect HI hinglish pyaz teen kilo add karo', detectLanguage('pyaz teen kilo add karo', 'en').short, 'hi');
check('detect HI hinglish do kilo tamatar', detectLanguage('do kilo tamatar', 'en').short, 'hi');

check('detect DE füge milch hinzu', detectLanguage('füge milch hinzu', 'en').short, 'de');
check('detect DE zwei eier bitte', detectLanguage('zwei eier bitte', 'en').short, 'de');
check('detect DE bare brot with EN fallback', detectLanguage('brot', 'en').short, 'de');

check('detect unknown fallback preservation', detectLanguage('xyz123abc', 'fr').short, 'fr');

// --- Multi-item & multi-intent command splitting ---
check('multi split count', splitMultiItems('add milk, eggs and bread').length, 3);
check('multi split de', splitMultiItems('milch und brot').length, 2);
check('multi split hi', splitMultiItems('doodh aur seb').length, 2);
check('single item not multi', detectMultiItem('add oat milk'), false);
check('multi items detected', detectMultiItem('add milk and eggs'), true);
check('restock EN true', detectRestockContext('running low on milk', 'en'), true);
check('restock HI true', detectRestockContext('coffee khatam ho gaya, add karo', 'hi'), true);
check('restock plain add false', detectRestockContext('add milk', 'en'), false);

// Multi-intent command splitting tests
const split1 = splitMultiCommands('add milk and eggs', 'en');
check('multi-item single-action splits to 1 command with 2 clauses', split1.length, 1);
check('multi-item single-action command action is ADD', split1[0].action, 'ADD');
check('multi-item single-action clauses count', split1[0].clauses.length, 2);

const split2 = splitMultiCommands('add milk and remove eggs', 'en');
check('multi-intent splits to 2 distinct commands', split2.length, 2);
check('multi-intent cmd 1 is ADD', split2[0].action, 'ADD');
check('multi-intent cmd 2 is REMOVE', split2[1].action, 'REMOVE');

const split3 = splitMultiCommands('search for toothpaste under 5 and add bananas', 'en');
check('multi-intent search + add splits to 2 commands', split3.length, 2);
check('multi-intent search action', split3[0].action, 'SEARCH');
check('multi-intent add action', split3[1].action, 'ADD');

const splitES = splitMultiCommands('añadir leche y quitar huevos', 'es');
check('ES multi-intent splits to 2 commands', splitES.length, 2);
check('ES multi-intent cmd 1 is ADD', splitES[0].action, 'ADD');
check('ES multi-intent cmd 2 is REMOVE', splitES[1].action, 'REMOVE');

const splitHI = splitMultiCommands('doodh add karo aur tamatar hatao', 'hi');
check('HI multi-intent splits to 2 commands', splitHI.length, 2);
check('HI multi-intent cmd 1 is ADD', splitHI[0].action, 'ADD');
check('HI multi-intent cmd 2 is REMOVE', splitHI[1].action, 'REMOVE');

const splitDE = splitMultiCommands('milch hinzufügen und eier entfernen', 'de');
check('DE multi-intent splits to 2 commands', splitDE.length, 2);
check('DE multi-intent cmd 1 is ADD', splitDE[0].action, 'ADD');
check('DE multi-intent cmd 2 is REMOVE', splitDE[1].action, 'REMOVE');

// Command cap enforcement (capped at 5)
const longUtterance = 'add milk and add eggs and add bread and add butter and add cheese and add apples';
check('commands capped at 5', splitMultiCommands(longUtterance, 'en', 5).length, 5);

// --- Search & substitutes ---
const organicApples = searchCatalog('organic apples', { maxPrice: 5 });
check('search organic + price top hit', organicApples[0]?.name, 'Organic Apples');
check('search respects price cap', searchCatalog('salmon', { maxPrice: 5 }).length, 0);
check('search organic filter excludes conventional', searchCatalog('organic spinach').every((item) => item.isOrganic), true);
check('search brand match', searchCatalog('bella italia').some((item) => item.brand === 'Bella Italia'), true);
check('bare "milk" resolves to Whole Milk first', searchCatalog('milk')[0]?.name, 'Whole Milk');
check('query "pineapple" resolves to Pineapple (produce), not flavored strip snacks', searchCatalog('pineapple')[0]?.name, 'Pineapple');
check('query "mango" resolves to Fresh Mango (produce), not flavored snacks', searchCatalog('mango')[0]?.name, 'Fresh Mango');
check('query "banana" resolves to Bananas (produce)', searchCatalog('banana')[0]?.name, 'Bananas');
check('query "apple" resolves to Organic Apples (produce), not tea or snacks', searchCatalog('apple')[0]?.name, 'Organic Apples');
check('query "orange" resolves to Oranges (produce), not Orange Juice', searchCatalog('orange')[0]?.name, 'Oranges');
check('query "orange juice" resolves to Orange Juice (beverage)', searchCatalog('orange juice')[0]?.name, 'Orange Juice');
check('query "limes" resolves to Limes (produce)', searchCatalog('limes')[0]?.name, 'Limes');
check('query "cucumber" resolves to Cucumber (produce)', searchCatalog('cucumber')[0]?.name, 'Cucumber');
check('intent "add pineapple" resolves to pineapple', parseIntent('add pineapple', 'en').itemName, 'pineapple');
check('intent "add orange" resolves to oranges item', parseIntent('add orange', 'en').itemName, 'orange');
check('intent "add orange juice" resolves to orange juice item', parseIntent('add orange juice', 'en').itemName, 'orange juice');
check('ES intent "agregar piña" alias resolves to pineapple', parseIntent('agregar piña', 'es').itemName, 'pineapple');
check('ES intent "agregar naranjas" alias resolves to oranges', parseIntent('agregar naranjas', 'es').itemName, 'oranges');
check('DE intent "orangen hinzufügen" alias resolves to oranges', parseIntent('orangen hinzufügen', 'de').itemName, 'oranges');
check('HI intent "ananas add karo" alias resolves to pineapple', parseIntent('ananas add karo', 'hi').itemName, 'pineapple');
check('weak EN signal still detected as en', detectLanguage('add oat milk', 'es').short, 'en');

// --- Singular & plural normalization engine ---
check('plural mangoes -> mango', singular('mangoes'), 'mango');
check('plural tomatoes -> tomato', singular('tomatoes'), 'tomato');
check('plural potatoes -> potato', singular('potatoes'), 'potato');
check('plural apples -> apple', singular('apples'), 'apple');
check('plural berries -> berry', singular('berries'), 'berry');
check('plural strawberries -> strawberry', singular('strawberries'), 'strawberry');
check('plural eggs -> egg', singular('eggs'), 'egg');
check('plural cookies -> cookie', singular('cookies'), 'cookie');
check('plural peaches -> peach', singular('peaches'), 'peach');
check('plural loaves -> loaf', singular('loaves'), 'loaf');
check('non-plural ending in s hummus preserved', singular('hummus'), 'hummus');
check('non-plural ending in s asparagus preserved', singular('asparagus'), 'asparagus');
check('non-plural ending in s citrus preserved', singular('citrus'), 'citrus');
check('non-plural ending in s hass preserved', singular('hass'), 'hass');

// --- Search with plural and synonym variations ---
check('search "mangoes" returns Fresh Mango #1', searchCatalog('mangoes')[0]?.name, 'Fresh Mango');
check('search "tomatoes" returns Roma Tomatoes #1', searchCatalog('tomatoes')[0]?.name, 'Roma Tomatoes');
check('search "potatoes" returns Russet Potatoes #1', searchCatalog('potatoes')[0]?.name, 'Russet Potatoes');
check('search "strawberries" returns Strawberries #1', searchCatalog('strawberries')[0]?.name, 'Strawberries');
check('intent "add mangoes" normalizes item to mango', parseIntent('add two mangoes', 'en').itemName, 'mango');
check('intent "add tomatoes" normalizes item to tomato', parseIntent('add tomatoes', 'en').itemName, 'tomato');
check('intent "add spuds" alias resolves to potatoes', parseIntent('add spuds', 'en').itemName, 'potatoes');
check('intent "add veggies" alias resolves to vegetables', parseIntent('add veggies', 'en').itemName, 'vegetables');

const wholeMilk = CATALOG.find((item) => item.id === 'whole-milk');
const sub = findSubstitute(wholeMilk);
check('substitute resolved from dataset', sub?.name, 'Oat Milk');
check('substitute has reason', typeof sub?.reason, 'string');
check('no substitutes -> null', findSubstitute(CATALOG.find((item) => item.id === 'bananas')), null);

// --- TTS phrase engine ---
check('phrase returns string', typeof pickPhrase('en', 'add', 'Oat Milk', 2), 'string');
check('restock phrase mentions item', pickPhrase('en', 'addRestock', 'Oat Milk').includes('Oat Milk'), true);
check('remove phrase mentions item', pickPhrase('en', 'remove', 'Eggs').includes('Eggs'), true);
check('unknown lang falls back to EN', typeof pickPhrase('xx', 'add', 'Milk'), 'string');
let prev = null;
let rotated = true;
for (let i = 0; i < 10; i += 1) {
  const next = pickPhrase('en', 'addRestock', 'Milk');
  if (next === prev) { rotated = false; break; }
  prev = next;
}
check('phrases never repeat back-to-back', rotated, true);

// --- Recognition retry chain ---
check('retry chain is an array', Array.isArray(RETRY_LANGUAGE_CHAIN), true);
check('retry chain starts en-US', RETRY_LANGUAGE_CHAIN[0], 'en-US');
check('retry chain covers hi-IN', RETRY_LANGUAGE_CHAIN.includes('hi-IN'), true);
check('retry chain covers es-ES', RETRY_LANGUAGE_CHAIN.includes('es-ES'), true);
check('retry chain covers fr-FR', RETRY_LANGUAGE_CHAIN.includes('fr-FR'), true);

// --- LLM system prompt contract ---
check('prompt instructs auto language ID', LLM_SYSTEM_PROMPT.includes('Automatically identify the language spoken'), true);
check('prompt instructs canonical translation', LLM_SYSTEM_PROMPT.includes('canonical English'), true);
check('prompt instructs response language code', LLM_SYSTEM_PROMPT.includes('response language code'), true);
check('prompt demands detectedLanguageCode key', LLM_SYSTEM_PROMPT.includes('detectedLanguageCode'), true);
check('prompt demands canonicalItem key', LLM_SYSTEM_PROMPT.includes('canonicalItem'), true);
check('prompt demands originalItemSpoken key', LLM_SYSTEM_PROMPT.includes('originalItemSpoken'), true);
check('prompt demands replyMessage key', LLM_SYSTEM_PROMPT.includes('replyMessage'), true);
check('prompt grounds catalog names', LLM_SYSTEM_PROMPT.includes('Whole Milk') && LLM_SYSTEM_PROMPT.includes('Red Onions'), true);

// --- LLM response sanitization ---
let llm = sanitizeLLMResponse('{"detectedLanguageCode":"hi-IN","action":"ADD","canonicalItem":"Whole Milk","originalItemSpoken":"Doodh","quantity":2,"replyMessage":"Ho gaya!"}');
check('LLM sanitized code', llm?.detectedLanguageCode, 'hi-IN');
check('LLM sanitized action', llm?.action, 'ADD');
check('LLM sanitized quantity', llm?.quantity, 2);
check('LLM sanitized original item', llm?.originalItemSpoken, 'Doodh');

llm = sanitizeLLMResponse('```json\n{"detectedLanguageCode":"es","action":"bogus","canonicalItem":"Leche"}\n```');
check('LLM strips markdown fences', llm?.canonicalItem, 'Leche');
check('LLM unknown action coerced to ADD', llm?.action, 'ADD');
check('LLM short code mapped to locale', llm?.detectedLanguageCode, 'es-ES');
check('LLM missing quantity defaults 1', llm?.quantity, 1);

check('LLM rejects missing canonicalItem', sanitizeLLMResponse('{"action":"ADD"}'), null);
check('LLM rejects garbage string', sanitizeLLMResponse('not json at all'), null);
check('LLM rejects null', sanitizeLLMResponse(null), null);
check('LLM unknown locale falls back en-US', sanitizeLLMResponse({ detectedLanguageCode: 'xx-XX', canonicalItem: 'Milk' })?.detectedLanguageCode, 'en-US');

// --- Semantic embedding fallback engine assertions ---
import { searchCatalogSemantic, cosineSimilarity } from '../src/services/semanticSearch.js';
import catalogEmbeddingsData from '../src/assets/catalog-embeddings.json' with { type: 'json' };

check('catalog embeddings payload defined', Boolean(catalogEmbeddingsData?.items?.length >= 800), true);
check('embeddings dimension is 384', catalogEmbeddingsData.dimension, 384);
check('cosine similarity of self is 1.0', Number(cosineSimilarity(catalogEmbeddingsData.items[0].vector, catalogEmbeddingsData.items[0].vector).toFixed(4)), 1.0);

// Semantic search fallback tests (async IIFE inside runner)
async function verifySemanticSuite() {
  console.log('\n--- Running Semantic Embedding Fallback Verification ---');
  
  // 1. "that citrus fruit" -> Oranges / Limes / Lemons (Rule search fails)
  const citrusRes = await searchCatalogSemantic('that citrus fruit', CATALOG);
  const citrusTop = citrusRes.match?.name;
  const isCitrus = ['Oranges', 'Limes', 'Lemons', 'Ruby Red Grapefruit'].includes(citrusTop) || /orange|lemon|lime|citrus/i.test(citrusTop);
  check('semantic fallback "that citrus fruit" resolves citrus fruit', isCitrus, true);
  check('semantic fallback score above 0.50 threshold', citrusRes.score >= 0.50, true);

  // 2. "snack for my dog" -> Dog Kibble / Dog Treats (Rule search fails)
  const dogRes = await searchCatalogSemantic('snack for my dog', CATALOG);
  const dogTop = dogRes.match?.name;
  const isDogItem = ['Dog Kibble', 'Dog Treats'].includes(dogTop) || dogRes.match?.category === 'pet';
  check('semantic fallback "snack for my dog" resolves pet item', isDogItem, true);

  // 3. "organic salad greens" -> Spring Mix Greens / Baby Spinach (Rule search fails to match exact phrase)
  const greensRes = await searchCatalogSemantic('organic salad greens', CATALOG);
  const isGreens = ['Spring Mix Greens', 'Baby Spinach', 'Kale Bunches'].includes(greensRes.match?.name) || greensRes.match?.category === 'produce';
  check('semantic fallback "organic salad greens" resolves produce greens', isGreens, true);

  // 4. "tangy salad dressing" -> Salad Dressing & Marinade (Rule search fails)
  const dressingRes = await searchCatalogSemantic('tangy salad dressing', CATALOG);
  const isDressing = /dressing|salad/i.test(dressingRes.match?.name);
  check('semantic fallback "tangy salad dressing" resolves dressing', isDressing, true);

  // 5. "creamy peanut butter for toast" -> Creamy Peanut Butter
  const pbRes = await searchCatalogSemantic('creamy peanut butter for toast', CATALOG);
  const isPb = /peanut butter|butter/i.test(pbRes.match?.name);
  check('semantic fallback "creamy peanut butter for toast" resolves peanut butter', isPb, true);

  // 6. Multi-intent + Semantic Fallback in same utterance
  // "add milk and I need that cold breakfast drink"
  const multiEmbedCmds = splitMultiCommands('add milk and I need that cold breakfast drink', 'en');
  check('multi-intent phrase splits clauses correctly', multiEmbedCmds[0].clauses.length >= 2, true);
  const clause1Matches = searchCatalog(parseIntent(multiEmbedCmds[0].clauses[0], 'en').itemName);
  check('clause 1 resolves via rule-based search', clause1Matches[0]?.name, 'Whole Milk');
  const clause2Semantic = await searchCatalogSemantic(parseIntent(multiEmbedCmds[0].clauses[1], 'en').itemName || multiEmbedCmds[0].clauses[1], CATALOG);
  check('clause 2 resolves via semantic fallback', clause2Semantic.score >= 0.50, true);

  // 7. Partial failure handling: valid clause + nonsense clause
  const partialCmds = splitMultiCommands('add bananas and add completely unrelated gibberish 99999', 'en');
  check('partial failure utterance splits into 2 commands', partialCmds.length, 2);
  const validMatches = searchCatalog(parseIntent(partialCmds[0].raw, 'en').itemName);
  check('valid clause resolves to Bananas', validMatches[0]?.name, 'Bananas');
  const invalidMatches = searchCatalog(parseIntent(partialCmds[1].raw, 'en').itemName);
  check('invalid clause returns 0 rule matches', invalidMatches.length, 0);
  const invalidSemantic = await searchCatalogSemantic(parseIntent(partialCmds[1].raw, 'en').itemName, CATALOG);
  check('invalid clause returns null or 0 semantic match', invalidSemantic.match === null || invalidSemantic.score === 0, true);

  console.log(failures === 0 ? '\nALL CHECKS (RULE-BASED + SEMANTIC + MULTI-INTENT) PASSED' : `\n${failures} CHECK(S) FAILED`);
  if (failures > 0) process.exit(1);
}

verifySemanticSuite().catch((err) => {
  console.error('Semantic verification failed:', err);
  process.exit(1);
});


