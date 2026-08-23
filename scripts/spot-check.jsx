import { searchCatalog, findSubstitute, parseIntent, CATALOG } from '../src/App.jsx';

console.log('=== SPOT CHECK 1: Search "find organic apples" ===');
const searchResults = searchCatalog('organic apples');
console.log('Hits count:', searchResults.length);
console.log('Top hit:', searchResults[0]?.name, `($${searchResults[0]?.price})`, 'isOrganic:', searchResults[0]?.isOrganic);

console.log('\n=== SPOT CHECK 2: Smart Substitute Check ===');
const wholeMilk = CATALOG.find((i) => i.id === 'whole-milk');
const sub = findSubstitute(wholeMilk);
console.log(`Original: "${wholeMilk?.name}" -> Substitute: "${sub?.name}" | Reason: "${sub?.reason}"`);

console.log('\n=== SPOT CHECK 3: Sale Suggestions Check ===');
const saleItems = CATALOG.filter((i) => i.onSale && typeof i.salePrice === 'number');
console.log(`Total on-sale items: ${saleItems.length} (~${Math.round((saleItems.length / CATALOG.length) * 100)}% of catalog)`);
console.log(`Sample on sale: "${saleItems[0]?.name}" (was $${saleItems[0]?.price} -> now $${saleItems[0]?.salePrice})`);

console.log('\n=== SPOT CHECK 4: Non-English Multilingual Lookups ===');
const esParsed = parseIntent('agregar dos bolsas de papas', 'es');
console.log('ES parse ("agregar dos bolsas de papas"):', esParsed);
console.log('ES Catalog Search Top Hit:', searchCatalog(esParsed.itemName)[0]?.name);

const hiParsed = parseIntent('do kilo aaloo add karo', 'hi');
console.log('HI parse ("do kilo aaloo add karo"):', hiParsed);
console.log('HI Catalog Search Top Hit:', searchCatalog(hiParsed.itemName)[0]?.name);

const deParsed = parseIntent('zwei kilo kartoffeln bitte', 'de');
console.log('DE parse ("zwei kilo kartoffeln bitte"):', deParsed);
console.log('DE Catalog Search Top Hit:', searchCatalog(deParsed.itemName)[0]?.name);

const frParsed = parseIntent('ajouter deux paquets de chips', 'fr');
console.log('FR parse ("ajouter deux paquets de chips"):', frParsed);
console.log('FR Catalog Search Top Hit:', searchCatalog(frParsed.itemName)[0]?.name);
