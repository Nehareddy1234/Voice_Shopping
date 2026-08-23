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
  pickPhrase,
  sanitizeLLMResponse,
  LLM_SYSTEM_PROMPT,
  RETRY_LANGUAGE_CHAIN,
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
check('catalog has 100+ items', CATALOG.length >= 100, true);
check('12 departments defined', DEPARTMENTS.length, 12);
const usedCategories = new Set(CATALOG.map((item) => item.category));
check('all 12 departments populated', usedCategories.size, 12);
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
check('EN dozen item', r.itemName, 'eggs');

r = parseIntent('Find organic apples under $5', 'en');
check('EN search action', r.action, 'SEARCH');
check('EN search item', r.itemName, 'organic apples');
check('EN search price', r.maxPrice, 5);

r = parseIntent('find dark chocolate less than 4 dollars', 'en');
check('EN price words', r.maxPrice, 4);

r = parseIntent('remove the eggs', 'en');
check('EN remove action', r.action, 'REMOVE');
check('EN remove item', r.itemName, 'eggs');

r = parseIntent('change milk to three', 'en');
check('EN update action', r.action, 'UPDATE');
check('EN update qty word', r.quantity, 3);
check('EN update item', r.itemName, 'milk');

r = parseIntent('set eggs to 6', 'en');
check('EN update digit qty', r.quantity, 6);
check('EN update digit item', r.itemName, 'eggs');

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

// --- Language detection ---
check('detect ES', detectLanguage('añade leche por favor', 'en').short, 'es');
check('detect HI by script', detectLanguage('दूध जोड़ो', 'en').short, 'hi');
check('detect HI hinglish', detectLanguage('pyaz teen kilo add karo', 'en').short, 'hi');
check('detect DE', detectLanguage('füge milch hinzu', 'en').short, 'de');
check('detect EN fallback', detectLanguage('add milk', 'en').short, 'en');

// --- Multi-item & restock context ---
check('multi split count', splitMultiItems('add milk, eggs and bread').length, 3);
check('multi split de', splitMultiItems('milch und brot').length, 2);
check('multi split hi', splitMultiItems('doodh aur seb').length, 2);
check('single item not multi', detectMultiItem('add oat milk'), false);
check('multi items detected', detectMultiItem('add milk and eggs'), true);
check('restock EN true', detectRestockContext('running low on milk', 'en'), true);
check('restock HI true', detectRestockContext('coffee khatam ho gaya, add karo', 'hi'), true);
check('restock plain add false', detectRestockContext('add milk', 'en'), false);

// --- Search & substitutes ---
const organicApples = searchCatalog('organic apples', { maxPrice: 5 });
check('search organic + price top hit', organicApples[0]?.name, 'Organic Apples');
check('search respects price cap', searchCatalog('salmon', { maxPrice: 5 }).length, 0);
check('search organic filter excludes conventional', searchCatalog('organic spinach').every((item) => item.isOrganic), true);
check('search brand match', searchCatalog('bella italia').some((item) => item.brand === 'Bella Italia'), true);
check('bare "milk" resolves to Whole Milk first', searchCatalog('milk')[0]?.name, 'Whole Milk');
check('weak EN signal still detected as en', detectLanguage('add oat milk', 'es').short, 'en');

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

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
if (failures > 0) process.exit(1);
