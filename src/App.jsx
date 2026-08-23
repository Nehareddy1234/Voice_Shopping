import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  AlertTriangle,
  Apple,
  Baby,
  Beef,
  Check,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Cookie,
  Globe,
  Heart,
  History,
  Home,
  Info,
  Leaf,
  Lightbulb,
  ListChecks,
  Loader2,
  Mic,
  MicOff,
  Milk,
  Minus,
  Package,
  PawPrint,
  Plus,
  RefreshCw,
  Search,
  Send,
  Snowflake,
  Sparkles,
  ShoppingCart,
  Sun,
  Tag,
  Trash2,
  Wheat,
  X,
} from 'lucide-react';

/* ============================================================================
 * Voice Cart — Voice Command Shopping Assistant
 * Single-file production SPA:
 *   - 105-item canonical English catalog across 12 departments
 *   - Multilingual casual NLP (en/es/fr/hi/de) with cross-language aliases
 *   - Web Speech recognition + warm conversational TTS confirmations
 *   - Persistent list, voice search with filters, substitute alerts
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 * LANGUAGES & DEPARTMENTS
 * -------------------------------------------------------------------------*/

export const LANGUAGES = [
  { code: 'en-US', short: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es-ES', short: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', short: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'hi-IN', short: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de-DE', short: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const LANGUAGE_INDEX = Object.fromEntries(LANGUAGES.map((entry) => [entry.short, entry]));

export const DEPARTMENTS = [
  { id: 'produce', label: 'Fresh Produce', icon: Apple, tint: 'bg-green-100 text-green-800' },
  { id: 'dairy-eggs', label: 'Dairy & Eggs', icon: Milk, tint: 'bg-blue-100 text-blue-800' },
  { id: 'meat-seafood', label: 'Meat & Seafood', icon: Beef, tint: 'bg-red-100 text-red-800' },
  { id: 'bakery', label: 'Bakery & Bread', icon: Wheat, tint: 'bg-amber-100 text-amber-800' },
  { id: 'pantry', label: 'Pantry Staples', icon: Package, tint: 'bg-orange-100 text-orange-800' },
  { id: 'frozen', label: 'Frozen Foods', icon: Snowflake, tint: 'bg-cyan-100 text-cyan-800' },
  { id: 'snacks', label: 'Snacks & Sweets', icon: Cookie, tint: 'bg-yellow-100 text-yellow-800' },
  { id: 'beverages', label: 'Beverages', icon: Coffee, tint: 'bg-teal-100 text-teal-800' },
  { id: 'personal-care', label: 'Personal Care', icon: Sparkles, tint: 'bg-pink-100 text-pink-800' },
  { id: 'household', label: 'Household Essentials', icon: Home, tint: 'bg-violet-100 text-violet-800' },
  { id: 'baby', label: 'Baby Care', icon: Baby, tint: 'bg-rose-100 text-rose-800' },
  { id: 'pet', label: 'Pet Supplies', icon: PawPrint, tint: 'bg-lime-100 text-lime-800' },
];

export const DEPARTMENT_INDEX = Object.fromEntries(DEPARTMENTS.map((entry) => [entry.id, entry]));

/* ---------------------------------------------------------------------------
 * CANONICAL CATALOG — 105 items across 12 departments
 * -------------------------------------------------------------------------*/

export const CATALOG = [
  {"id":"pineapple","name":"Pineapple","category":"produce","price":3.99,"unit":"pcs","brand":"Tropicana Farms","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","summer"],"substitutes":[]},
  {"id":"mango","name":"Fresh Mango","category":"produce","price":1.99,"unit":"pcs","brand":"Tropicana Farms","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"limes","name":"Limes","category":"produce","price":2.49,"unit":"bag","brand":"Citrus Grove","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer","all"],"substitutes":["Lemons"]},
  {"id":"peaches","name":"Fresh Peaches","category":"produce","price":3.79,"unit":"lb","brand":"Orchard Crate","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"watermelon","name":"Watermelon","category":"produce","price":5.99,"unit":"pcs","brand":"Sunny Acres","size":"1 whole melon","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.49,"season":["summer"],"substitutes":[]},
  {"id":"garlic","name":"Fresh Garlic","category":"produce","price":1.49,"unit":"pack","brand":"Root Cellar","size":"3 ct sleeve","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cucumber","name":"Cucumber","category":"produce","price":1.29,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","summer"],"substitutes":[]},
  {"id":"potatoes","name":"Russet Potatoes","category":"produce","price":3.99,"unit":"bag","brand":"Root Cellar","size":"5 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"oranges","name":"Oranges","category":"produce","price":3.49,"unit":"lb","brand":"Citrus Grove","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":[]},
  {"id":"organic-apples","name":"Organic Apples","category":"produce","price":4.29,"unit":"lb","brand":"Orchard Crate","size":"3 lb bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":3.49,"season":["summer","fall"],"substitutes":["Strawberries"]},
  {"id":"bananas","name":"Bananas","category":"produce","price":1.89,"unit":"lb","brand":"Tropicana Farms","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"red-onions","name":"Red Onions","category":"produce","price":2.49,"unit":"lb","brand":"Field & Vine","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"roma-tomatoes","name":"Roma Tomatoes","category":"produce","price":3.29,"unit":"lb","brand":"Sunny Acres","size":"1 lb","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.49,"season":["summer"],"substitutes":[]},
  {"id":"baby-spinach","name":"Baby Spinach","category":"produce","price":3.49,"unit":"bag","brand":"GreenLeaf Co.","size":"5 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","fall"],"substitutes":["Kale Bunches"]},
  {"id":"kale-bunches","name":"Kale Bunches","category":"produce","price":2.99,"unit":"bunch","brand":"GreenLeaf Co.","size":"1 bunch","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":["Baby Spinach"]},
  {"id":"hass-avocados","name":"Hass Avocados","category":"produce","price":5.49,"unit":"bag","brand":"Verde Grove","size":"4 ct bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.99,"season":["spring","summer"],"substitutes":[]},
  {"id":"strawberries","name":"Strawberries","category":"produce","price":4.99,"unit":"pack","brand":"Berry Patch","size":"16 oz pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","summer"],"substitutes":["Organic Apples"]},
  {"id":"lemons","name":"Lemons","category":"produce","price":3.79,"unit":"bag","brand":"Citrus Grove","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":["Limes"]},
  {"id":"carrots","name":"Carrots","category":"produce","price":2.29,"unit":"bag","brand":"Root Cellar","size":"1 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"whole-milk","name":"Whole Milk","category":"dairy-eggs","price":3.29,"unit":"carton","brand":"Meadow Fresh","size":"1 gallon","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Oat Milk","Almond Milk"]},
  {"id":"oat-milk","name":"Oat Milk","category":"dairy-eggs","price":4.49,"unit":"carton","brand":"PureHarvest","size":"32 oz carton","isOrganic":true,"inStock":true,"onSale":true,"salePrice":3.49,"season":["all"],"substitutes":["Almond Milk"]},
  {"id":"almond-milk","name":"Almond Milk","category":"dairy-eggs","price":4.19,"unit":"carton","brand":"NutBloom","size":"32 oz carton","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"greek-yogurt","name":"Greek Yogurt","category":"dairy-eggs","price":4.79,"unit":"tub","brand":"Olympus Dairy","size":"32 oz tub","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.79,"season":["all"],"substitutes":["Cottage Cheese"]},
  {"id":"cheddar-cheese","name":"Cheddar Cheese","category":"dairy-eggs","price":5.29,"unit":"block","brand":"Golden Rind","size":"8 oz block","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Mozzarella"]},
  {"id":"mozzarella","name":"Mozzarella","category":"dairy-eggs","price":4.99,"unit":"pack","brand":"Bella Italia","size":"8 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Cheddar Cheese"]},
  {"id":"free-range-eggs","name":"Free-Range Eggs","category":"dairy-eggs","price":4.49,"unit":"dozen","brand":"Happy Hen","size":"12 ct","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"butter","name":"Butter","category":"dairy-eggs","price":3.99,"unit":"pack","brand":"Meadow Fresh","size":"16 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"heavy-cream","name":"Heavy Cream","category":"dairy-eggs","price":3.49,"unit":"carton","brand":"Meadow Fresh","size":"16 oz carton","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cottage-cheese","name":"Cottage Cheese","category":"dairy-eggs","price":3.89,"unit":"tub","brand":"Olympus Dairy","size":"16 oz tub","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Greek Yogurt"]},
  {"id":"chicken-breast","name":"Chicken Breast","category":"meat-seafood","price":7.99,"unit":"lb","brand":"Prairie Poultry","size":"1 lb","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.99,"season":["all"],"substitutes":["Turkey Slices"]},
  {"id":"ground-beef","name":"Ground Beef","category":"meat-seafood","price":6.49,"unit":"lb","brand":"Ranch Reserve","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Ground Turkey"]},
  {"id":"ground-turkey","name":"Ground Turkey","category":"meat-seafood","price":5.99,"unit":"lb","brand":"Prairie Poultry","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Ground Beef"]},
  {"id":"salmon-fillet","name":"Salmon Fillet","category":"meat-seafood","price":11.99,"unit":"lb","brand":"North Catch","size":"1 lb","isOrganic":false,"inStock":true,"onSale":true,"salePrice":8.99,"season":["spring","summer"],"substitutes":["Tuna Steaks"]},
  {"id":"shrimp","name":"Shrimp","category":"meat-seafood","price":9.99,"unit":"lb","brand":"North Catch","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"turkey-slices","name":"Turkey Slices","category":"meat-seafood","price":5.49,"unit":"pack","brand":"Deli Prime","size":"8 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Chicken Breast"]},
  {"id":"pork-chops","name":"Pork Chops","category":"meat-seafood","price":6.99,"unit":"lb","brand":"Ranch Reserve","size":"1 lb","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":["Chicken Breast"]},
  {"id":"bacon","name":"Bacon","category":"meat-seafood","price":6.29,"unit":"pack","brand":"Smokehouse Co.","size":"12 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"tuna-steaks","name":"Tuna Steaks","category":"meat-seafood","price":10.49,"unit":"lb","brand":"North Catch","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":["Salmon Fillet"]},
  {"id":"whole-wheat-bread","name":"Whole Wheat Bread","category":"bakery","price":3.49,"unit":"loaf","brand":"Hearth & Grain","size":"20 oz loaf","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Sourdough Loaf"]},
  {"id":"sourdough-loaf","name":"Sourdough Loaf","category":"bakery","price":4.99,"unit":"loaf","brand":"Hearth & Grain","size":"24 oz loaf","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.49,"season":["all"],"substitutes":["Whole Wheat Bread"]},
  {"id":"bagels","name":"Bagels","category":"bakery","price":3.99,"unit":"pack","brand":"City Bakehouse","size":"6 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Hamburger Buns"]},
  {"id":"butter-croissants","name":"Butter Croissants","category":"bakery","price":5.49,"unit":"pack","brand":"Petit Four","size":"4 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"flour-tortillas","name":"Flour Tortillas","category":"bakery","price":2.99,"unit":"pack","brand":"Casa Blanca","size":"10 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hamburger-buns","name":"Hamburger Buns","category":"bakery","price":3.29,"unit":"pack","brand":"City Bakehouse","size":"8 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":["Bagels"]},
  {"id":"french-baguette","name":"French Baguette","category":"bakery","price":2.79,"unit":"loaf","brand":"Petit Four","size":"10 oz loaf","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Sourdough Loaf"]},
  {"id":"blueberry-muffins","name":"Blueberry Muffins","category":"bakery","price":4.79,"unit":"pack","brand":"City Bakehouse","size":"4 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"rye-bread","name":"Rye Bread","category":"bakery","price":3.79,"unit":"loaf","brand":"Hearth & Grain","size":"16 oz loaf","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Whole Wheat Bread"]},
  {"id":"spaghetti-pasta","name":"Spaghetti Pasta","category":"pantry","price":1.99,"unit":"box","brand":"Bella Italia","size":"500g box","isOrganic":false,"inStock":true,"onSale":true,"salePrice":1.29,"season":["all"],"substitutes":["Quinoa"]},
  {"id":"basmati-rice","name":"Basmati Rice","category":"pantry","price":6.99,"unit":"bag","brand":"Golden Harvest","size":"5 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Quinoa"]},
  {"id":"extra-virgin-olive-oil","name":"Extra Virgin Olive Oil","category":"pantry","price":9.49,"unit":"bottle","brand":"Oliveto","size":"500ml bottle","isOrganic":true,"inStock":true,"onSale":true,"salePrice":6.99,"season":["all"],"substitutes":[]},
  {"id":"peanut-butter","name":"Peanut Butter","category":"pantry","price":3.99,"unit":"jar","brand":"NutHouse","size":"16 oz jar","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"all-purpose-flour","name":"All-Purpose Flour","category":"pantry","price":3.49,"unit":"bag","brand":"Mill & Main","size":"5 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"canned-black-beans","name":"Canned Black Beans","category":"pantry","price":1.29,"unit":"can","brand":"Casa Blanca","size":"15 oz can","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wildflower-honey","name":"Wildflower Honey","category":"pantry","price":6.49,"unit":"jar","brand":"Meadow Bee","size":"12 oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"soy-sauce","name":"Soy Sauce","category":"pantry","price":2.99,"unit":"bottle","brand":"Umami Works","size":"500ml bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"quinoa","name":"Quinoa","category":"pantry","price":5.99,"unit":"box","brand":"Golden Harvest","size":"12 oz box","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Basmati Rice"]},
  {"id":"tomato-sauce","name":"Tomato Sauce","category":"pantry","price":1.79,"unit":"jar","brand":"Bella Italia","size":"24 oz jar","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"frozen-pizza","name":"Frozen Pizza","category":"frozen","price":5.99,"unit":"box","brand":"FireStone","size":"large 12-inch","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.99,"season":["all"],"substitutes":[]},
  {"id":"vanilla-ice-cream","name":"Vanilla Ice Cream","category":"frozen","price":4.99,"unit":"tub","brand":"Churn & Co.","size":"1 pint tub","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":["Frozen Mixed Berries"]},
  {"id":"frozen-peas","name":"Frozen Peas","category":"frozen","price":2.49,"unit":"bag","brand":"Arctic Garden","size":"16 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Frozen Broccoli"]},
  {"id":"fish-sticks","name":"Fish Sticks","category":"frozen","price":4.49,"unit":"box","brand":"North Catch","size":"24 oz box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"frozen-mixed-berries","name":"Frozen Mixed Berries","category":"frozen","price":5.49,"unit":"bag","brand":"Arctic Garden","size":"16 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Strawberries"]},
  {"id":"dumplings","name":"Dumplings","category":"frozen","price":5.29,"unit":"pack","brand":"Umami Works","size":"20 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"waffles","name":"Waffles","category":"frozen","price":3.29,"unit":"box","brand":"Morning Crate","size":"10 ct box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"frozen-broccoli","name":"Frozen Broccoli","category":"frozen","price":2.29,"unit":"bag","brand":"Arctic Garden","size":"16 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Frozen Peas"]},
  {"id":"burritos","name":"Burritos","category":"frozen","price":5.79,"unit":"box","brand":"Casa Blanca","size":"4 ct box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"potato-chips","name":"Potato Chips","category":"snacks","price":3.49,"unit":"bag","brand":"Crunch Lab","size":"large 10 oz bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.49,"season":["all"],"substitutes":["Pretzels","Popcorn"]},
  {"id":"dark-chocolate","name":"Dark Chocolate","category":"snacks","price":3.99,"unit":"bar","brand":"Cacao Noir","size":"3.5 oz bar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"granola-bars","name":"Granola Bars","category":"snacks","price":4.29,"unit":"box","brand":"Trail Crate","size":"6 ct box","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Trail Mix"]},
  {"id":"pretzels","name":"Pretzels","category":"snacks","price":2.99,"unit":"bag","brand":"Crunch Lab","size":"12 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Potato Chips"]},
  {"id":"cookies","name":"Cookies","category":"snacks","price":3.79,"unit":"pack","brand":"Sweet Oven","size":"12 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"trail-mix","name":"Trail Mix","category":"snacks","price":5.49,"unit":"bag","brand":"Trail Crate","size":"16 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Granola Bars"]},
  {"id":"gummy-bears","name":"Gummy Bears","category":"snacks","price":2.49,"unit":"bag","brand":"Sweet Oven","size":"8 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"popcorn","name":"Popcorn","category":"snacks","price":3.29,"unit":"box","brand":"Crunch Lab","size":"6 ct box","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Potato Chips"]},
  {"id":"salsa","name":"Salsa","category":"snacks","price":3.19,"unit":"jar","brand":"Casa Blanca","size":"16 oz jar","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"orange-juice","name":"Orange Juice","category":"beverages","price":4.29,"unit":"bottle","brand":"Citrus Grove","size":"52 oz bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Lemonade"]},
  {"id":"coffee-beans","name":"Coffee Beans","category":"beverages","price":11.99,"unit":"bag","brand":"Roast House","size":"12 oz bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":8.99,"season":["all"],"substitutes":["Green Tea"]},
  {"id":"green-tea","name":"Green Tea","category":"beverages","price":4.49,"unit":"box","brand":"Leaf & Steep","size":"20 ct box","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Coffee Beans"]},
  {"id":"sparkling-water","name":"Sparkling Water","category":"beverages","price":3.99,"unit":"pack","brand":"Fizz Peak","size":"8 x 330ml pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.99,"season":["all"],"substitutes":[]},
  {"id":"cola","name":"Cola","category":"beverages","price":4.99,"unit":"pack","brand":"Fizz Peak","size":"6 x 500ml pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Sparkling Water"]},
  {"id":"coconut-water","name":"Coconut Water","category":"beverages","price":3.49,"unit":"bottle","brand":"Island Press","size":"330ml bottle","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"lemonade","name":"Lemonade","category":"beverages","price":3.79,"unit":"bottle","brand":"Citrus Grove","size":"500ml bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":["Orange Juice"]},
  {"id":"energy-drink","name":"Energy Drink","category":"beverages","price":2.99,"unit":"can","brand":"Volt Labs","size":"250ml can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Coffee Beans"]},
  {"id":"kombucha","name":"Kombucha","category":"beverages","price":4.29,"unit":"bottle","brand":"Fermentary","size":"350ml bottle","isOrganic":true,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Sparkling Water"]},
  {"id":"shampoo","name":"Shampoo","category":"personal-care","price":6.99,"unit":"bottle","brand":"Botanica","size":"500ml bottle","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.99,"season":["all"],"substitutes":["Body Wash"]},
  {"id":"toothpaste","name":"Toothpaste","category":"personal-care","price":3.49,"unit":"tube","brand":"BrightSmile","size":"4 oz tube","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"body-wash","name":"Body Wash","category":"personal-care","price":5.99,"unit":"bottle","brand":"Botanica","size":"500ml bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Hand Soap"]},
  {"id":"hand-soap","name":"Hand Soap","category":"personal-care","price":2.99,"unit":"bottle","brand":"Botanica","size":"250ml bottle","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Body Wash"]},
  {"id":"deodorant","name":"Deodorant","category":"personal-care","price":4.99,"unit":"stick","brand":"Fresh Peak","size":"2.5 oz stick","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"face-moisturizer","name":"Face Moisturizer","category":"personal-care","price":12.99,"unit":"jar","brand":"Botanica","size":"1.7 oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sunscreen","name":"Sunscreen","category":"personal-care","price":8.99,"unit":"tube","brand":"SunGuard","size":"3 oz tube","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.99,"season":["summer"],"substitutes":[]},
  {"id":"razors","name":"Razors","category":"personal-care","price":9.49,"unit":"pack","brand":"SharpCo","size":"4 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"paper-towels","name":"Paper Towels","category":"household","price":7.99,"unit":"roll","brand":"HomeSoft","size":"6 roll pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.99,"season":["all"],"substitutes":[]},
  {"id":"dish-soap","name":"Dish Soap","category":"household","price":3.49,"unit":"bottle","brand":"SudsCo","size":"500ml bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["All-Purpose Cleaner"]},
  {"id":"laundry-detergent","name":"Laundry Detergent","category":"household","price":11.49,"unit":"bottle","brand":"HomeSoft","size":"100 oz bottle","isOrganic":false,"inStock":true,"onSale":true,"salePrice":8.49,"season":["all"],"substitutes":[]},
  {"id":"trash-bags","name":"Trash Bags","category":"household","price":8.49,"unit":"box","brand":"ToughSack","size":"45 ct box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"all-purpose-cleaner","name":"All-Purpose Cleaner","category":"household","price":4.29,"unit":"bottle","brand":"SudsCo","size":"500ml bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Dish Soap"]},
  {"id":"sponges","name":"Sponges","category":"household","price":2.99,"unit":"pack","brand":"SudsCo","size":"3 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"aluminum-foil","name":"Aluminum Foil","category":"household","price":4.49,"unit":"roll","brand":"WrapRight","size":"75 ft roll","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"light-bulbs","name":"Light Bulbs","category":"household","price":6.99,"unit":"pack","brand":"LumenWorks","size":"4 ct pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-diapers","name":"Baby Diapers","category":"baby","price":12.99,"unit":"pack","brand":"Little Cloud","size":"size 3, 28 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-wipes","name":"Baby Wipes","category":"baby","price":4.99,"unit":"pack","brand":"Little Cloud","size":"64 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-formula","name":"Baby Formula","category":"baby","price":18.99,"unit":"can","brand":"NurtureLab","size":"12.5 oz can","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-shampoo","name":"Baby Shampoo","category":"baby","price":5.49,"unit":"bottle","brand":"Little Cloud","size":"250ml bottle","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-food-puree","name":"Baby Food Puree","category":"baby","price":2.49,"unit":"jar","brand":"NurtureLab","size":"4 oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"diaper-rash-cream","name":"Diaper Rash Cream","category":"baby","price":6.99,"unit":"tube","brand":"Little Cloud","size":"3 oz tube","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-lotion","name":"Baby Lotion","category":"baby","price":5.99,"unit":"bottle","brand":"Little Cloud","size":"250ml bottle","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dog-kibble","name":"Dog Kibble","category":"pet","price":16.99,"unit":"bag","brand":"WildBite","size":"15 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":12.99,"season":["all"],"substitutes":[]},
  {"id":"cat-food","name":"Cat Food","category":"pet","price":12.49,"unit":"bag","brand":"WildBite","size":"7 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cat-litter","name":"Cat Litter","category":"pet","price":10.99,"unit":"box","brand":"TidyPaws","size":"25 lb box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dog-treats","name":"Dog Treats","category":"pet","price":5.99,"unit":"bag","brand":"WildBite","size":"12 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pet-shampoo","name":"Pet Shampoo","category":"pet","price":7.49,"unit":"bottle","brand":"TidyPaws","size":"500ml bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fish-flakes","name":"Fish Flakes","category":"pet","price":3.99,"unit":"jar","brand":"AquaLife","size":"2 oz jar","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bird-seed","name":"Bird Seed","category":"pet","price":6.49,"unit":"bag","brand":"AquaLife","size":"5 lb bag","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chamomile-herbal-tea","name":"Chamomile Herbal Tea","category":"beverages","price":6.51,"unit":"pack","brand":"Lagg's","size":"1 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lagg-s-herbal-tea-peppermint","name":"Lagg's, Herbal Tea, Peppermint","category":"beverages","price":4.11,"unit":"pack","brand":"Lagg's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"linden-flowers-tea","name":"Linden Flowers Tea","category":"beverages","price":1.74,"unit":"pack","brand":"Lagg's","size":"1.5 g","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"herbal-tea-hibiscus","name":"Herbal Tea, Hibiscus","category":"beverages","price":5.17,"unit":"pack","brand":"Lagg's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"apple-cinnamon-tea","name":"Apple & Cinnamon Tea","category":"beverages","price":5.77,"unit":"pack","brand":"Lagg's","size":"1.5 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"shave-grass-herbal-tea","name":"Shave Grass Herbal Tea","category":"beverages","price":3.45,"unit":"pack","brand":"Lagg's","size":"30 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lagg-s-herbal-tea-chamomile-mint","name":"Lagg's, Herbal Tea, Chamomile Mint","category":"beverages","price":6.78,"unit":"pack","brand":"Lagg's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"artichoke-herbal-tea","name":"Artichoke Herbal Tea","category":"beverages","price":4.85,"unit":"pack","brand":"Lagg's","size":"30 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lagg-s-dieter-s-herbal-tea","name":"Lagg's, Dieter's Herbal Tea","category":"beverages","price":3.77,"unit":"pack","brand":"Lagg's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lagg-s-kidneytea-herbal-tea","name":"Lagg's, Kidneytea, Herbal Tea","category":"beverages","price":4.44,"unit":"pack","brand":"Lagg's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bronchtea","name":"Bronchtea","category":"beverages","price":3.35,"unit":"pack","brand":"Lagg's","size":"1 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"100-pure-canola-oil","name":"100 Pure Canola Oil","category":"beverages","price":2.36,"unit":"can","brand":"Canola Harvest","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":true,"salePrice":1.81,"season":["all"],"substitutes":[]},
  {"id":"lithuanian-rye-bread","name":"Lithuanian Rye Bread","category":"bakery","price":4.81,"unit":"pack","brand":"Today's Temptations","size":"57 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"escalope-de-dinde","name":"Escalope De Dinde","category":"meat-seafood","price":14.59,"unit":"pack","brand":"Market Select","size":"300 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":12.47,"season":["all"],"substitutes":[]},
  {"id":"madeleine-framboise","name":"Madeleine Framboise","category":"beverages","price":3.39,"unit":"pack","brand":"Market Select","size":"110 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"croissants-margarine","name":"Croissants Margarine","category":"snacks","price":4.29,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"magic-stars-chocolates","name":"Magic Stars Chocolates","category":"beverages","price":4.94,"unit":"pack","brand":"Milkyway","size":"100 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mcvitie-s-digestives-cheesecake-lemon","name":"Mcvitie's, Digestives Cheesecake, Lemon","category":"snacks","price":2.38,"unit":"pack","brand":"Mcvitie's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Limes"]},
  {"id":"black-tea","name":"Black Tea","category":"beverages","price":4.92,"unit":"bottle","brand":"Tetley","size":"100 ml","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.43,"season":["all"],"substitutes":[]},
  {"id":"the-simpsons-donuts","name":"The Simpsons Donuts","category":"beverages","price":3.47,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.96,"season":["all"],"substitutes":[]},
  {"id":"terrine-de-campagne","name":"Terrine De Campagne","category":"meat-seafood","price":5.23,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"croissants-pur-beurre","name":"Croissants Pur Beurre","category":"snacks","price":3.61,"unit":"pack","brand":"La Fourne Campanire","size":"standard size","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.96,"season":["all"],"substitutes":[]},
  {"id":"bakers-best-white-bread","name":"Bakers Best, White Bread","category":"beverages","price":1.77,"unit":"pack","brand":"Wise Woodworks","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bakers-best-rye-bread","name":"Bakers Best, Rye Bread","category":"beverages","price":6.6,"unit":"pack","brand":"Wise Woodworks","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"eclairs","name":"Eclairs","category":"beverages","price":6.52,"unit":"pack","brand":"Intermarch","size":"180 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"beignets-gourmands-parfum-choco-noisettes","name":"Beignets Gourmands Parfum Choco-noisettes","category":"beverages","price":6.66,"unit":"pack","brand":"Market Select","size":"420 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"confit-d-oignons-ou-de-figues","name":"Confit D'oignons Ou De Figues","category":"beverages","price":2.37,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mt-olive-sweet-n-hot-salad-peppers","name":"Mt Olive, Sweet 'n' Hot Salad Peppers","category":"snacks","price":5.84,"unit":"pack","brand":"Mt Olive","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"big-papa-s-southern-sauce","name":"Big Papa's, Southern Sauce","category":"pantry","price":2.59,"unit":"pack","brand":"Walton's Flies","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cool-mint-flavor-dental-gum-cool-mint","name":"Cool Mint Flavor Dental Gum, Cool Mint","category":"snacks","price":3.13,"unit":"pack","brand":"Eco-dent","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dental-gum","name":"Dental Gum","category":"snacks","price":4.03,"unit":"pack","brand":"Lotus Brands Inc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"funsch-high-quality-marzipan","name":"Funsch, High Quality Marzipan","category":"snacks","price":3.01,"unit":"pack","brand":"Petpro Products Inc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"oatmeal-raisin-cookies","name":"Oatmeal Raisin Cookies","category":"snacks","price":2.52,"unit":"pack","brand":"Bart & Judy's","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"the-best-peanut-butter-cookies","name":"The Best Peanut Butter Cookies","category":"snacks","price":6.22,"unit":"pack","brand":"Bart & Judy's","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"best-sweet-potato-cookies","name":"Best Sweet-potato Cookies","category":"snacks","price":4.32,"unit":"pack","brand":"Petpro Products Inc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"best-ginger-snap-cookies","name":"Best Ginger Snap Cookies","category":"snacks","price":4.31,"unit":"pack","brand":"Petpro Products Inc","size":"34 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lactaid-ice-cream-vanilla","name":"Lactaid, Ice Cream, Vanilla","category":"personal-care","price":6.51,"unit":"box","brand":"Lactaid","size":"12 oz box","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.85,"season":["summer"],"substitutes":[]},
  {"id":"lactaid-ice-cream-butter-pecan","name":"Lactaid, Ice Cream, Butter Pecan","category":"personal-care","price":3.81,"unit":"can","brand":"Lactaid","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"salted-sticks-salted-pretzels","name":"Salted Sticks & Salted Pretzels","category":"snacks","price":6.04,"unit":"pack","brand":"Chio","size":"30 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pain-constance-aux-crales","name":"Pain Constance Aux Crales","category":"pantry","price":4.66,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"beignets-framboises","name":"Beignets Framboises","category":"snacks","price":3.05,"unit":"pack","brand":"Intermarch","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"spray-candy-all-kidz-blend-bonus","name":"Spray Candy All Kidz Blend Bonus","category":"snacks","price":2.06,"unit":"can","brand":"Innovative Candy Concepts","size":"12 oz can","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sour-fruity-candy","name":"Sour & Fruity Candy","category":"snacks","price":2.34,"unit":"bottle","brand":"Innovative Candy Concepts","size":"9 ml","isOrganic":false,"inStock":true,"onSale":true,"salePrice":1.65,"season":["all"],"substitutes":[]},
  {"id":"spinach","name":"Spinach","category":"produce","price":4.15,"unit":"pack","brand":"Cean Mist Farms","size":"85 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring"],"substitutes":["Kale Bunches"]},
  {"id":"cooking-spinach","name":"Cooking Spinach","category":"produce","price":3.15,"unit":"pack","brand":"Ocean Mist","size":"85 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring"],"substitutes":["Kale Bunches"]},
  {"id":"beignet-moelleux-a-la-pomme","name":"Beignet Moelleux A La Pomme","category":"snacks","price":4.41,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sobe-fruit-strip-snacks-mango-pineapple","name":"Sobe, Fruit Strip Snacks, Mango, Pineapple","category":"snacks","price":4.61,"unit":"pack","brand":"Sobe","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"emojeez-gummies-assorted-fruits","name":"Emojeez, Gummies, Assorted Fruits","category":"snacks","price":3.15,"unit":"pack","brand":"Healthy Food Brands Llc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"emojeez-gummies-candy-fruit","name":"Emojeez, Gummies Candy, Fruit","category":"snacks","price":4.63,"unit":"can","brand":"Healthy Food Brands Llc","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"emojeez-fruit-gummies-assorted","name":"Emojeez, Fruit Gummies, Assorted","category":"snacks","price":2.15,"unit":"pack","brand":"Healthy Food Brands Llc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sour-fruit-gummies","name":"Sour Fruit Gummies","category":"snacks","price":6.23,"unit":"pack","brand":"Candy Crush","size":"3.5 oz","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"freeze-dried-grapes","name":"Freeze-dried Grapes","category":"produce","price":5.35,"unit":"pack","brand":"Welch's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dried-honey-crisp-apples","name":"Dried Honey Crisp Apples","category":"produce","price":4.61,"unit":"pack","brand":"Welch's","size":"40 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"wholesome-delicious-dried-mangos","name":"Wholesome & Delicious Dried Mangos","category":"produce","price":2.05,"unit":"pack","brand":"Welch's","size":"40 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"fruit-gummies","name":"Fruit Gummies","category":"produce","price":5.17,"unit":"pack","brand":"Angry Birds","size":"40 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baguette-constance-cereales","name":"Baguette Constance Cereales","category":"bakery","price":3.22,"unit":"bag","brand":"Market Select","size":"16 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bee-creamed-honey-with-raspberry-raspberry","name":"Bee, Creamed Honey With Raspberry, Raspberry","category":"personal-care","price":3.32,"unit":"pack","brand":"Vintage","size":"standard size","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.39,"season":["all"],"substitutes":[]},
  {"id":"creamed-honey-146","name":"Creamed Honey","category":"personal-care","price":8.87,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"creamed-honey-with-cinnamon","name":"Creamed Honey With Cinnamon","category":"personal-care","price":10.55,"unit":"pack","brand":"Vintage","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"creamed-honey-with-lemon","name":"Creamed Honey With Lemon","category":"personal-care","price":5.27,"unit":"pack","brand":"Vintage","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Limes"]},
  {"id":"creamed-honey-with-hibiscus","name":"Creamed Honey With Hibiscus","category":"personal-care","price":9.46,"unit":"pack","brand":"Vintage Bee Inc","size":"21 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"minis-creamed-honey-with-cinnamon","name":"Minis Creamed Honey With Cinnamon","category":"personal-care","price":9.04,"unit":"pack","brand":"Vintage","size":"10 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":6.54,"season":["all"],"substitutes":[]},
  {"id":"creamed-honey-with-raspberry","name":"Creamed Honey With Raspberry","category":"personal-care","price":12.2,"unit":"pack","brand":"Vintage Bee Inc","size":"10 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"vintage-minis","name":"Vintage Minis","category":"pantry","price":1.32,"unit":"pack","brand":"Vintage","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"raw-shrimp","name":"Raw Shrimp","category":"meat-seafood","price":13.98,"unit":"pack","brand":"Maxfield","size":"85 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":11.02,"season":["all"],"substitutes":[]},
  {"id":"blueberry-pomegranate-crunch","name":"Blueberry Pomegranate Crunch","category":"produce","price":4.68,"unit":"pack","brand":"Guiltless Gourmet","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"confiture-de-bleuet-sauvages-l-orange","name":"Confiture De Bleuet Sauvages L'orange","category":"produce","price":1.95,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":[]},
  {"id":"caperberries-in-vinegar","name":"Caperberries In Vinegar","category":"pantry","price":5.11,"unit":"pack","brand":"La Pedriza","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"la-eur-3-milk-soft-ripened-cheese","name":"La Eur, 3 Milk Soft Ripened Cheese","category":"dairy-eggs","price":4.19,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"salat-der-saison-dressing-fr-feldsalat","name":"Salat Der Saison Dressing Fr Feldsalat","category":"produce","price":2.37,"unit":"pack","brand":"Market Select","size":"10 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"comte","name":"Comte","category":"dairy-eggs","price":2.35,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"anneaux-d-encornet","name":"Anneaux D'encornet","category":"meat-seafood","price":5.48,"unit":"lb","brand":"Market Select","size":"0,164 kg","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"camenbert-de-normandie","name":"Camenbert De Normandie","category":"dairy-eggs","price":5.94,"unit":"pack","brand":"Monoprix Gourmet","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"yaourt-nature-brebis","name":"Organic Yaourt Nature Brebis","category":"dairy-eggs","price":6.09,"unit":"pack","brand":"La Bergerie","size":"standard size","isOrganic":true,"inStock":true,"onSale":true,"salePrice":5.14,"season":["all"],"substitutes":[]},
  {"id":"pizza-margherita","name":"Organic Pizza Margherita","category":"frozen","price":4.01,"unit":"pack","brand":"Alice Et Bio","size":"standard size","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"yaourt-de-brebis-vanille","name":"Organic Yaourt De Brebis Vanille","category":"dairy-eggs","price":4.52,"unit":"pack","brand":"Naturalia","size":"2 x 125 g","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"vritable-andouille-de-gumen","name":"Vritable Andouille De Gumen","category":"meat-seafood","price":9.75,"unit":"pack","brand":"Amand Terroir","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"black-white-crispbread-sticks","name":"Organic Black & White Crispbread Sticks","category":"bakery","price":6.59,"unit":"pack","brand":"Swedish By Nature","size":"standard size","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"filet-de-merlu-blanc-meunire","name":"Filet De Merlu Blanc Meunire","category":"meat-seafood","price":10.82,"unit":"pack","brand":"Cit Marine","size":"220 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"escalope-soja-et-bl","name":"Escalope Soja Et Bl","category":"meat-seafood","price":13.67,"unit":"pack","brand":"Herta","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"truite-fume","name":"Truite Fume","category":"meat-seafood","price":12.28,"unit":"pack","brand":"Market Select","size":"120 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":10.26,"season":["all"],"substitutes":[]},
  {"id":"salade-poulet-caesar","name":"Salade Poulet Caesar","category":"meat-seafood","price":11.58,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gerlina-douceur-de-crales-cacao-soja-bl","name":"Gerlina Douceur De Crales Cacao Soja Bl","category":"pantry","price":6.82,"unit":"pack","brand":"Gerlina","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"muesli-superfruit","name":"Muesli Superfruit","category":"produce","price":5.92,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"international-inc-frozen-shrimp-tempura","name":"International Inc, Frozen Shrimp Tempura","category":"frozen","price":4.37,"unit":"pack","brand":"Jfc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mediterranean-sea-salt","name":"Mediterranean Sea Salt","category":"pantry","price":9.43,"unit":"pack","brand":"Olde Thompson","size":"1.2 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fajitas-seasoning-mix","name":"Fajitas Seasoning Mix","category":"pantry","price":6.23,"unit":"pack","brand":"Hol-grain","size":"4 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fancy-truffles","name":"Fancy Truffles","category":"pantry","price":5.22,"unit":"pack","brand":"Maitre Truffout","size":"40 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pure-dshydrat-mousline","name":"Pure Dshydrat Mousline","category":"baby","price":18.22,"unit":"pack","brand":"Maggi","size":"130 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pho-pho-soup-seasoning-spice-cube","name":"Pho', Pho Soup Seasoning Spice Cube","category":"pantry","price":8.14,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"coconut-tree-brand-pho-ga-spice-cube","name":"Coconut Tree Brand, Pho Ga Spice Cube","category":"pantry","price":6.99,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"coconut-tree-brand-spice-cube-soup-sessoning","name":"Coconut Tree Brand, Spice Cube Soup Sessoning","category":"pantry","price":7.94,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"bun-mam-soup-seasoning","name":"Bun Mam Soup Seasoning","category":"bakery","price":5.45,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"9 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"bo-kho-stewed-beef-seasoning","name":"Bo Kho Stewed Beef Seasoning","category":"meat-seafood","price":6.11,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"9 g","isOrganic":false,"inStock":false,"onSale":true,"salePrice":4.59,"season":["all"],"substitutes":[]},
  {"id":"coconut-tree-brand-bun-bo-hue-spice-cube","name":"Coconut Tree Brand, Bun Bo Hue Spice Cube","category":"bakery","price":2.77,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pho-chay-spice-cube","name":"Pho Chay Spice Cube","category":"pantry","price":1.32,"unit":"pack","brand":"Coconut Tree Brand","size":"9 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"coconut-tree-brand-spice-cube-seasoning","name":"Coconut Tree Brand, Spice Cube Seasoning","category":"pantry","price":3.34,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"coconut-tree-brand-spice-cube-soup-seasoning","name":"Coconut Tree Brand, Spice Cube Soup Seasoning","category":"pantry","price":9.46,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"coconut-tree-brand-vegetarian-soup-cubes","name":"Coconut Tree Brand, Vegetarian Soup Cubes","category":"pantry","price":9.9,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"crab-soup-seasoning-spice-cube","name":"Crab Soup Seasoning, Spice Cube","category":"pantry","price":6.01,"unit":"pack","brand":"Lucky Shing Co Ltd","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"macarroni-and-cheese-dinner","name":"Macarroni And Cheese Dinner","category":"dairy-eggs","price":2.38,"unit":"pack","brand":"Best Value","size":"6.25 oz","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kartoffelsalat","name":"Kartoffelsalat","category":"produce","price":3.87,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"white-tiger-garnelen-provence","name":"White Tiger Garnelen Provence","category":"meat-seafood","price":11.39,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jambonneau-los","name":"Jambonneau Los","category":"meat-seafood","price":9.41,"unit":"pack","brand":"Salaisons De Pradelles","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"milk-chocolate-balls-with-cream-and-chocolate","name":"Milk Chocolate Balls With Cream And Chocolate","category":"personal-care","price":11.02,"unit":"pack","brand":"Confiserie Heidel","size":"42 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fischfilet-mllerin","name":"Fischfilet Mllerin","category":"meat-seafood","price":10.25,"unit":"bottle","brand":"Bofrost","size":"750 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sauce-bolognaise","name":"Sauce Bolognaise","category":"meat-seafood","price":11.95,"unit":"pack","brand":"Market Select","size":"420 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"venice-maid-foods-condensed-soup-tomato","name":"Venice Maid Foods, Condensed Soup, Tomato","category":"produce","price":5.27,"unit":"pack","brand":"Venice Maid Foods","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"creamy-and-delicious-evaporated-filled-milk","name":"Creamy And Delicious Evaporated Filled Milk","category":"personal-care","price":8.15,"unit":"bottle","brand":"Alaska","size":"30 ml","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"whole-wheat-flour-tortillas","name":"Whole Wheat Flour Tortillas","category":"bakery","price":4.49,"unit":"pack","brand":"United Supermarkets Llc","size":"45 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cool-beans-catalina-bean-hummus","name":"Cool Beans, Catalina Bean Hummus","category":"pet","price":4.57,"unit":"pack","brand":"Bobbi's Best Inc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cool-beans-red-pepper-hummus","name":"Cool Beans, Red Pepper Hummus","category":"produce","price":3.86,"unit":"pack","brand":"Bobbi's Best Inc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cool-beans-buffalo-hummus","name":"Cool Beans, Buffalo Hummus","category":"pantry","price":9.08,"unit":"pack","brand":"Bobbi's Best Inc","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"tortellini-pasta","name":"Organic Tortellini Pasta","category":"pantry","price":4.95,"unit":"pack","brand":"Nuovo Pasta","size":"100 g","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Basmati Rice"]},
  {"id":"ravioli","name":"Organic Ravioli","category":"pantry","price":4.99,"unit":"pack","brand":"Nuovo Pasta","size":"100 g","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ravioli-five-cheese","name":"Ravioli Five Cheese","category":"dairy-eggs","price":3.58,"unit":"pack","brand":"Nuovo","size":"127 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.5,"season":["all"],"substitutes":[]},
  {"id":"pierogi","name":"Pierogi","category":"pantry","price":6.12,"unit":"pack","brand":"Nuovo Pasta","size":"100 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"shrimp-scampi-ravioli","name":"Shrimp Scampi Ravioli","category":"meat-seafood","price":5.88,"unit":"pack","brand":"Nuovo Pasta","size":"100 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"classic-cheese-ravioli","name":"Classic Cheese Ravioli","category":"dairy-eggs","price":3.45,"unit":"pack","brand":"Nuovo Pasta","size":"100 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chocolate-cream-dip-wiht-crispy-craker-sticks","name":"Chocolate Cream Dip Wiht Crispy Craker Sticks","category":"personal-care","price":7.73,"unit":"pack","brand":"Meiji","size":"57 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"yam-yam-double-cream-chocolate-strawberry","name":"Yam Yam Double Cream, Chocolate, Strawberry","category":"personal-care","price":7.03,"unit":"pack","brand":"Meiji","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"biscuits-with-choco-cream","name":"Biscuits With Choco Cream","category":"personal-care","price":11.33,"unit":"pack","brand":"Meiji","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"biscuits-with-strawberry-cream","name":"Biscuits With Strawberry Cream","category":"personal-care","price":9.35,"unit":"pack","brand":"Meiji","size":"15 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":8,"season":["all"],"substitutes":[]},
  {"id":"hello-panda","name":"Hello Panda","category":"personal-care","price":10.04,"unit":"pack","brand":"Meiji","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"meiji-hello-panda-biscuits-with-choco-cream","name":"Meiji, Hello Panda, Biscuits With Choco Cream","category":"personal-care","price":8.22,"unit":"pack","brand":"Meiji","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hello-panda-biscuits-with-strawberry-cream","name":"Hello Panda Biscuits With Strawberry Cream","category":"personal-care","price":8.69,"unit":"pack","brand":"Meiji","size":"26 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":7.4,"season":["all"],"substitutes":[]},
  {"id":"yan-yan-cream-dip","name":"Yan Yan Cream Dip","category":"personal-care","price":11.57,"unit":"pack","brand":"Meiji Seika S Pte Ltd","size":"57 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"greek-salad-dressing-marinade","name":"Greek Salad Dressing & Marinade","category":"produce","price":4.73,"unit":"pack","brand":"Gazebo Room","size":"14 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"salad-dressing-marinade","name":"Salad Dressing & Marinade","category":"produce","price":5.87,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"soy-milk","name":"Soy Milk","category":"dairy-eggs","price":3.35,"unit":"bottle","brand":"Market Select","size":"190 ml","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"de-nigris-balsamic-glaze-raspberry","name":"De Nigris, Balsamic Glaze, Raspberry","category":"produce","price":5.37,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"creamy-milk-chocolate","name":"Creamy Milk Chocolate","category":"personal-care","price":5.01,"unit":"bottle","brand":"Slim-fast","size":"295 ml","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sour-cream-onion-baked-chips-snack","name":"Sour Cream & Onion Baked Chips Snack","category":"personal-care","price":8.04,"unit":"pack","brand":"Market Select","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Pretzels"]},
  {"id":"reduced-fat-milk","name":"Reduced Fat Milk","category":"dairy-eggs","price":5.01,"unit":"bottle","brand":"Quality Dairy","size":"240 ml","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"whole-grain-bread","name":"Whole Grain Bread","category":"bakery","price":5.29,"unit":"pack","brand":"Today's Temptations","size":"28 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.83,"season":["all"],"substitutes":[]},
  {"id":"belgian-mini-cream-puffs","name":"Belgian Mini Cream Puffs","category":"personal-care","price":6.98,"unit":"pack","brand":"Poppies International Inc","size":"75 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"vermont-maple-syrup","name":"Vermont Maple Syrup","category":"dairy-eggs","price":4.92,"unit":"bottle","brand":"Butternut Mountain Farm","size":"60 ml","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"maple-syrup","name":"Maple Syrup","category":"dairy-eggs","price":4.86,"unit":"bottle","brand":"Butternut Mountain Farm","size":"60 ml","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"vermon-maple-syrup","name":"Vermon Maple Syrup","category":"dairy-eggs","price":6.27,"unit":"bottle","brand":"Butternut Mountain Farm","size":"60 ml","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"vermont-organic-maple-syrup","name":"Vermont Organic Maple Syrup","category":"dairy-eggs","price":3.52,"unit":"bottle","brand":"Butternut Mountain Farm","size":"60 ml","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ultimate-brown-bag-apple-pie","name":"Ultimate Brown Bag Apple Pie","category":"produce","price":5.18,"unit":"bag","brand":"Market Select","size":"170 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"sorbet-gourmet","name":"Sorbet Gourmet","category":"frozen","price":3.19,"unit":"pack","brand":"Sharon's","size":"96 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"sharon-s-sorbet-mixed-berry","name":"Sharon's Sorbet Mixed Berry","category":"frozen","price":3.03,"unit":"pack","brand":"Sharon's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"sorbet","name":"Sorbet","category":"frozen","price":5.49,"unit":"pack","brand":"Sharon's","size":"96 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.59,"season":["summer"],"substitutes":[]},
  {"id":"sharon-s-sorbet-coconut","name":"Sharon's Sorbet Coconut","category":"frozen","price":4.45,"unit":"pack","brand":"Sharon's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"sweet-relish","name":"Sweet Relish","category":"produce","price":4.06,"unit":"bottle","brand":"Mt Olive","size":"8 FL OZ (237 ml)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"diced-jalapeno-peppers","name":"Diced Jalapeno Peppers","category":"produce","price":3.24,"unit":"pack","brand":"Mt Olive","size":"15 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.43,"season":["all"],"substitutes":[]},
  {"id":"sweet-baby-gherkins","name":"Sweet Baby Gherkins","category":"baby","price":16.22,"unit":"pack","brand":"Market Select","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hot-dog-relish","name":"Hot Dog Relish","category":"pet","price":5.79,"unit":"pack","brand":"Mt Olive","size":"15 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-dills","name":"Baby Dills","category":"baby","price":9.02,"unit":"pack","brand":"Mt Olive","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kosher-baby-dills","name":"Kosher Baby Dills","category":"baby","price":6,"unit":"pack","brand":"Mt Olive","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pepperoncini","name":"Pepperoncini","category":"produce","price":3.83,"unit":"pack","brand":"Market Select","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sandwich-snuffers-bread-butter","name":"Sandwich Snuffers Bread & Butter","category":"bakery","price":5.73,"unit":"pack","brand":"Market Select","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bread-butter-spears","name":"Bread & Butter Spears","category":"bakery","price":3.44,"unit":"pack","brand":"Mt Olive","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"buffalo-kosher-baby-dills-hot-sauce","name":"Buffalo Kosher Baby Dills, Hot Sauce","category":"baby","price":18.46,"unit":"pack","brand":"Mt Olive","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kosher-baby-dills-made-with-sea-salt","name":"Kosher Baby Dills Made With Sea Salt","category":"baby","price":4.46,"unit":"pack","brand":"Mt Olive","size":"28 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mt-olive-simply-pickles-kosher-baby-dills","name":"Mt Olive Simply Pickles Kosher Baby Dills","category":"baby","price":14.14,"unit":"pack","brand":"Mt Olive","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"butter-beans","name":"Butter Beans","category":"dairy-eggs","price":3.67,"unit":"pack","brand":"Blue Mountain Country","size":"130 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.77,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"blue-mountain-country-chicken-seasoning","name":"Blue Mountain Country, Chicken Seasoning","category":"meat-seafood","price":5.06,"unit":"box","brand":"Eve Sales Company","size":"12 oz box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"london-porter","name":"London Porter","category":"pet","price":16.32,"unit":"bottle","brand":"Fuller's","size":"330 ml","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cheesecake","name":"Cheesecake","category":"dairy-eggs","price":5.32,"unit":"pack","brand":"Lindt & Sprungli Gmbh","size":"40 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gold-bunny","name":"Gold Bunny","category":"bakery","price":5.76,"unit":"pack","brand":"Lindt","size":"40 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hazelnut-spread-breadsticks","name":"Hazelnut Spread Breadsticks","category":"bakery","price":3.57,"unit":"pack","brand":"Nutella","size":"52 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"nutella-go-with-breadsticks","name":"Nutella & Go With Breadsticks","category":"baby","price":4.87,"unit":"pack","brand":"Nutella","size":"52 g (1.8 OZ)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"12-pack-hazelnut-spread-breadsticks","name":"12 Pack Hazelnut Spread Breadsticks","category":"bakery","price":2.54,"unit":"box","brand":"Nutella Ferrero","size":"52 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"flourless-sprouted-7-grain-bread","name":"Organic Flourless Sprouted 7-grain Bread","category":"bakery","price":3,"unit":"pack","brand":"Trader Joe's","size":"standard size","isOrganic":true,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hard-boiled-eggs","name":"Hard Boiled Eggs","category":"meat-seafood","price":12.37,"unit":"pack","brand":"Cheffresh","size":"2","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"arpis-beef-shawerma-seasoning","name":"Arpis Beef Shawerma Seasoning","category":"meat-seafood","price":10.77,"unit":"pack","brand":"Market Select","size":"7 oz","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"passion-fruit","name":"Passion Fruit","category":"baby","price":2.07,"unit":"pack","brand":"M & S","size":"90 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cheddar","name":"Cheddar","category":"dairy-eggs","price":3.47,"unit":"lb","brand":"Mcdonald's","size":"7.788 kg (6 * 1,298 kg)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"m-s-chicken-penang","name":"M&s Chicken Penang","category":"meat-seafood","price":13.42,"unit":"pack","brand":"M&s","size":"400 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chicken-pad-tha","name":"Chicken Pad Tha","category":"meat-seafood","price":6.42,"unit":"pack","brand":"Marks & Spencer","size":"400 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"beef-ragu","name":"Beef Ragu","category":"meat-seafood","price":6.86,"unit":"pack","brand":"Marks & Spencer","size":"360g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.94,"season":["all"],"substitutes":[]},
  {"id":"crunchy-peanut-butter","name":"Crunchy Peanut Butter","category":"baby","price":12.03,"unit":"pack","brand":"Trader Joe's","size":"16 oz","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bakery-pitta-bread-white","name":"Bakery Pitta Bread White","category":"bakery","price":3.83,"unit":"pack","brand":"Sainsbury's","size":"standard size","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.61,"season":["all"],"substitutes":[]},
  {"id":"baby-leaf-rocket-salad","name":"Organic Baby Leaf Rocket Salad","category":"baby","price":9.2,"unit":"pack","brand":"M&s","size":"standard size","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"choco-suprme","name":"Choco Suprme","category":"dairy-eggs","price":4.18,"unit":"pack","brand":"Milka","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mozzarella-sticks","name":"Mozzarella Sticks","category":"bakery","price":3.08,"unit":"pack","brand":"M&s Food","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"salted-caramel-belgian-milk","name":"Salted Caramel & Belgian Milk","category":"dairy-eggs","price":5.5,"unit":"pack","brand":"Marks & Spencers","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"yorkshire-gold","name":"Yorkshire Gold","category":"pet","price":11.79,"unit":"bottle","brand":"M&s","size":"500 ml","isOrganic":false,"inStock":true,"onSale":true,"salePrice":9.45,"season":["all"],"substitutes":[]},
  {"id":"m-s-smoked-tomato-sauce","name":"M&s Smoked Tomato Sauce","category":"baby","price":12.94,"unit":"pack","brand":"Marks & Spencer","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pizza-parlanno","name":"Pizza Parlanno","category":"frozen","price":4.09,"unit":"lb","brand":"Trader Giotto's","size":"1 LB (517 g)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"croque-jambon-crme-de-parmesan","name":"Croque Jambon Crme De Parmesan","category":"dairy-eggs","price":3.23,"unit":"pack","brand":"Marks & Spencer","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"date-walnut-toasts","name":"Date & Walnut Toasts","category":"bakery","price":5.05,"unit":"pack","brand":"Marks & Spencers","size":"125 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"liquorice-catherine-wheels","name":"Liquorice Catherine Wheels","category":"pet","price":8.17,"unit":"pack","brand":"Marks & Spencer","size":"113 g e","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.71,"season":["all"],"substitutes":[]},
  {"id":"mighty-mesty-pizza","name":"Mighty Mesty Pizza","category":"frozen","price":5.2,"unit":"pack","brand":"M&s","size":"standard size","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.3,"season":["all"],"substitutes":[]},
  {"id":"rollmop-herrings","name":"Rollmop Herrings","category":"bakery","price":4.34,"unit":"roll","brand":"Marks & Spencer","size":"280 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sandwich-poulet-rti-avocat","name":"Sandwich Poulet Rti & Avocat","category":"pet","price":4.79,"unit":"pack","brand":"Marks & Spencer","size":"200 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dolly-mixtures","name":"Dolly Mixtures","category":"pet","price":11.78,"unit":"pack","brand":"Marks & Spencer","size":"120 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"blackcurrant-sponge-roll","name":"Blackcurrant Sponge Roll","category":"household","price":4,"unit":"roll","brand":"Marks & Spencers","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"vegetables-spring-rolls","name":"Vegetables Spring Rolls","category":"bakery","price":5.46,"unit":"roll","brand":"Marks & Spencer","size":"215 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"moutarde-posh-dog","name":"Moutarde Posh Dog","category":"pet","price":13.25,"unit":"pack","brand":"Marks & Spencer","size":"300 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":9.13,"season":["all"],"substitutes":[]},
  {"id":"wrap-poulet-la-jamacaine","name":"Wrap Poulet La Jamacaine","category":"bakery","price":5.62,"unit":"pack","brand":"Marks & Spencer","size":"231 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"peanut-cashew-pecan-buttee","name":"Peanut, Cashew & Pecan Buttee","category":"baby","price":19.25,"unit":"can","brand":"Marks & Spencer","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gourmet-pizza-sauce","name":"Gourmet Pizza Sauce","category":"frozen","price":7.8,"unit":"pack","brand":"Caputo","size":"60 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chicken-breading-mix","name":"Chicken Breading Mix","category":"bakery","price":4.72,"unit":"pack","brand":"Washington","size":"14 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"enriched-bleached-self-rising-flour","name":"Enriched-bleached Self-rising Flour","category":"household","price":5.76,"unit":"pack","brand":"Wilkins Rogers Mills","size":"standard size","isOrganic":false,"inStock":false,"onSale":true,"salePrice":4.67,"season":["all"],"substitutes":[]},
  {"id":"red-velvet-roll","name":"Red Velvet Roll","category":"bakery","price":5.81,"unit":"roll","brand":"The Father's Table Llc","size":"73 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hot-dog-buns","name":"Hot Dog Buns","category":"pet","price":12.08,"unit":"pack","brand":"Psst","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"deluxe-frozen-yogurt","name":"Deluxe Frozen Yogurt","category":"frozen","price":3.21,"unit":"pack","brand":"Kroger","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"frozen-yogurt","name":"Frozen Yogurt","category":"frozen","price":3.9,"unit":"pack","brand":"Kroger","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"creamy-peanut-butter","name":"Creamy Peanut Butter","category":"baby","price":19.95,"unit":"pack","brand":"Kroger","size":"32 g","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ice-pops","name":"Ice Pops","category":"frozen","price":3.3,"unit":"pack","brand":"The Kroger Co","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"psst-fudge-swirl","name":"Psst, Fudge Swirl","category":"frozen","price":3.98,"unit":"pack","brand":"The Kroger Co","size":"standard size","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.91,"season":["all"],"substitutes":[]},
  {"id":"frozen-dairy-dessert","name":"Frozen Dairy Dessert","category":"frozen","price":7.3,"unit":"pack","brand":"Pt","size":"58 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"apple-strudel","name":"Apple Strudel","category":"household","price":7.26,"unit":"pack","brand":"King Soopers","size":"136 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-swiss-sliced-cheese","name":"Baby Swiss Sliced Cheese","category":"baby","price":3.18,"unit":"pack","brand":"Private Selection","size":"22 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"waffle-cones","name":"Waffle Cones","category":"frozen","price":2.51,"unit":"pack","brand":"Kroger","size":"22 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"waffle-bowls","name":"Waffle Bowls","category":"frozen","price":5.15,"unit":"pack","brand":"Kroger","size":"21 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"crunch-cake","name":"Crunch Cake","category":"household","price":5.02,"unit":"pack","brand":"King Soopers","size":"78 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"homestyle-chicken-dumpling-soup","name":"Homestyle Chicken & Dumpling Soup","category":"frozen","price":6.39,"unit":"pack","brand":"Foods Market","size":"245 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"boneless-chicken-wyngz","name":"Boneless Chicken Wyngz","category":"frozen","price":6.84,"unit":"pack","brand":"Kroger","size":"907 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.8,"season":["all"],"substitutes":[]},
  {"id":"wheat-pizza-dough","name":"Wheat Pizza Dough","category":"frozen","price":5.24,"unit":"pack","brand":"Foods Market","size":"57 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"king-soopers-spice-cake","name":"King Soopers, Spice Cake","category":"baby","price":13.62,"unit":"pack","brand":"The Kroger Co","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"freshly-frozen-blueberries","name":"Organic Freshly Frozen Blueberries","category":"frozen","price":2.94,"unit":"pack","brand":"Simple Truth Organic","size":"140 g","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.16,"season":["all"],"substitutes":[]},
  {"id":"deluxe-lactose-free-peanut-butter-fudge-swirl","name":"Deluxe Lactose Free Peanut Butter Fudge Swirl","category":"frozen","price":5.24,"unit":"box","brand":"Kroger","size":"12 oz box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kroger-peanut-butter-creamy","name":"Kroger Peanut Butter Creamy","category":"baby","price":16.31,"unit":"pack","brand":"Kroger","size":"453g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kroger-creamy-peanut-butter-peanut","name":"Kroger, Creamy Peanut Butter, Peanut","category":"baby","price":7.76,"unit":"pack","brand":"Kroger","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"creamy-almond-butter","name":"Creamy Almond Butter","category":"baby","price":8.45,"unit":"pack","brand":"Kroger","size":"12 oz","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"creamy-peanut-butter-spread","name":"Organic Creamy Peanut Butter Spread","category":"baby","price":21.84,"unit":"pack","brand":"Simple Truth","size":"32 g","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"crunchy-peanut-butter-spread","name":"Organic Crunchy Peanut Butter Spread","category":"baby","price":18.76,"unit":"pack","brand":"Simple Truth","size":"32 g","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"whole-baby-carrots","name":"Whole Baby Carrots","category":"baby","price":12.3,"unit":"pack","brand":"Restaurant Item","size":"125 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"butter-herb-instant-mashed-potatoes","name":"Butter & Herb Instant Mashed Potatoes","category":"baby","price":14.15,"unit":"pack","brand":"Kroger","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"white-hot-dog-buns","name":"White Hot Dog Buns","category":"pet","price":8.69,"unit":"pack","brand":"Smith's","size":"39 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"corn-dogs","name":"Corn Dogs","category":"pet","price":17.85,"unit":"pack","brand":"Kroger","size":"76 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"private-selection-delicate-cream-sauce-rose","name":"Private Selection, Delicate Cream Sauce, Rose","category":"pet","price":16.04,"unit":"box","brand":"Private Selection","size":"12 oz box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mini-corn-dogs","name":"Mini Corn Dogs","category":"pet","price":16.54,"unit":"pack","brand":"Kroger","size":"76 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bleached-all-purpose-enriched-flour","name":"Bleached All Purpose Enriched Flour","category":"household","price":10.7,"unit":"pack","brand":"Kroger","size":"30 g","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"unbleached-all-purpose-enriched-flour","name":"Unbleached All Purpose Enriched Flour","category":"household","price":6.86,"unit":"pack","brand":"Kroger","size":"30 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.73,"season":["all"],"substitutes":[]},
  {"id":"catalan-saffron-orzo-fusion","name":"Catalan Saffron Orzo Fusion","category":"pet","price":10.28,"unit":"pack","brand":"Private Selection","size":"49 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"beef-hot-dogs","name":"Beef Hot Dogs","category":"pet","price":9.81,"unit":"pack","brand":"Heritage Farm","size":"42 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hot-dogs","name":"Hot Dogs","category":"pet","price":12.94,"unit":"pack","brand":"Heritage Farm","size":"57 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"roundy-s-original-corn-dogs-honey","name":"Roundy's, Original Corn Dogs, Honey","category":"pet","price":6.36,"unit":"pack","brand":"Roundy's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"beef-corn-dogs-honey","name":"Beef Corn Dogs, Honey","category":"pet","price":13.89,"unit":"pack","brand":"Roundy's","size":"standard size","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wheat-hot-dog-buns","name":"Wheat Hot Dog Buns","category":"pet","price":6.9,"unit":"pack","brand":"Roundy's","size":"43 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sliced-hot-dog-buns","name":"Sliced Hot Dog Buns","category":"pet","price":4.2,"unit":"pack","brand":"Roundy's","size":"43 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sliced-hot-dog-enriched-buns","name":"Sliced Hot Dog Enriched Buns","category":"pet","price":9.1,"unit":"pack","brand":"Roundy's Supermarkets Inc","size":"43 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bleached-enriched-all-purpose-flour","name":"Bleached & Enriched All Purpose Flour","category":"household","price":12.05,"unit":"pack","brand":"Shurfine","size":"31 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hotdogs-made-with-chicken-pork","name":"Hotdogs Made With Chicken & Pork","category":"pet","price":9.32,"unit":"pack","brand":"Shurfine","size":"43 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jumbo-hotdogs-made-with-chicken-pork","name":"Jumbo Hotdogs Made With Chicken & Pork","category":"pet","price":17.01,"unit":"pack","brand":"Shurfine","size":"57 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"unbleached-enriched-flour","name":"Unbleached & Enriched Flour","category":"household","price":9.56,"unit":"pack","brand":"Spartan","size":"30 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"enriched-unbleached-flour","name":"Enriched Unbleached Flour","category":"household","price":11.85,"unit":"pack","brand":"Spartan","size":"30 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":8.95,"season":["all"],"substitutes":[]},
  {"id":"all-purpose-flour-bleached-enriched","name":"All Purpose Flour Bleached & Enriched","category":"household","price":12.53,"unit":"pack","brand":"Valu Time","size":"30 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"spongebob-squarepants-fruity-splash","name":"Spongebob Squarepants Fruity Splash","category":"household","price":10.82,"unit":"pack","brand":"General Mills","size":"10.7 OZ (303g)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"all-purpose-unbleached-enriched-flour","name":"All-purpose Unbleached Enriched Flour","category":"household","price":14.84,"unit":"pack","brand":"Big Y Foods Inc","size":"standard size","isOrganic":false,"inStock":true,"onSale":true,"salePrice":10.58,"season":["all"],"substitutes":[]},
  {"id":"homestyle-meatloaf","name":"Homestyle Meatloaf","category":"household","price":6.4,"unit":"loaf","brand":"Signature","size":"85 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"tastykake-jelly-krimpets-sponge-cakes-961","name":"Tastykake, Jelly Krimpets Sponge Cakes","category":"household","price":5.32,"unit":"pack","brand":"Tastykake","size":"standard size","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dessert-shells-yellow-sponge-cakes","name":"Dessert Shells Yellow Sponge Cakes","category":"household","price":7.64,"unit":"pack","brand":"Tastykake","size":"31 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"butterscotch-krimpets-sponge-cake","name":"Butterscotch Krimpets Sponge Cake","category":"household","price":4.71,"unit":"pack","brand":"Tastykake","size":"78 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dreamies-creme-filled-sponge-cakes","name":"Dreamies Creme Filled Sponge Cakes","category":"household","price":4.92,"unit":"pack","brand":"Tastykake","size":"79 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"creme-filled-krimpets-sponge-cakes","name":"Creme Filled Krimpets Sponge Cakes","category":"household","price":8.21,"unit":"pack","brand":"Tastykake","size":"103 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"classic-italian-sandwich","name":"Classic Italian Sandwich","category":"household","price":6.27,"unit":"pack","brand":"Ahold","size":"220 g","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.61,"season":["all"],"substitutes":[]},
  {"id":"turkey-panini","name":"Turkey Panini","category":"household","price":11.25,"unit":"pack","brand":"Boar's Head","size":"255 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bh-large-american-hoagie-sandwiches","name":"Bh Large American Hoagie Sandwiches","category":"household","price":9.71,"unit":"can","brand":"Boar's Head","size":"215 g","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"honeycrisp-apples-908","name":"Honeycrisp Apples","category":"produce","price":1.98,"unit":"lb","brand":"Orchard Crate","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":["Organic Apples"]},
  {"id":"gala-apples-142","name":"Gala Apples","category":"produce","price":4.34,"unit":"lb","brand":"Orchard Crate","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":["Organic Apples"]},
  {"id":"fuji-apples-30","name":"Fuji Apples","category":"produce","price":3.99,"unit":"lb","brand":"Orchard Crate","size":"3 lb bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.05,"season":["fall","winter"],"substitutes":["Organic Apples"]},
  {"id":"granny-smith-apples-491","name":"Granny Smith Apples","category":"produce","price":3.23,"unit":"lb","brand":"Orchard Crate","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"bartlett-pears-748","name":"Bartlett Pears","category":"produce","price":5.4,"unit":"lb","brand":"Valley Orchards","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"bosc-pears-577","name":"Bosc Pears","category":"produce","price":2.09,"unit":"lb","brand":"Valley Orchards","size":"2 lb bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":1.63,"season":["fall","winter"],"substitutes":[]},
  {"id":"cara-cara-oranges-919","name":"Cara Cara Oranges","category":"produce","price":4.45,"unit":"bag","brand":"Citrus Grove","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":[]},
  {"id":"blood-oranges-749","name":"Blood Oranges","category":"produce","price":1.91,"unit":"bag","brand":"Citrus Grove","size":"2 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":[]},
  {"id":"ruby-red-grapefruit-160","name":"Ruby Red Grapefruit","category":"produce","price":5.44,"unit":"pcs","brand":"Citrus Grove","size":"1 ct","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.58,"season":["winter","spring"],"substitutes":[]},
  {"id":"meyer-lemons-728","name":"Meyer Lemons","category":"produce","price":5.01,"unit":"bag","brand":"Citrus Grove","size":"1 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":["Limes"]},
  {"id":"key-limes-188","name":"Key Limes","category":"produce","price":2.63,"unit":"bag","brand":"Citrus Grove","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer","all"],"substitutes":["Lemons"]},
  {"id":"blackberries-958","name":"Blackberries","category":"produce","price":5.88,"unit":"pack","brand":"Berry Patch","size":"6 oz clamshell","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"blueberries-220","name":"Blueberries","category":"produce","price":4.45,"unit":"pack","brand":"Berry Patch","size":"1 pint clamshell","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"raspberries-743","name":"Raspberries","category":"produce","price":3.85,"unit":"pack","brand":"Berry Patch","size":"6 oz clamshell","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"sweet-cherries-667","name":"Sweet Cherries","category":"produce","price":2.65,"unit":"bag","brand":"Orchard Crate","size":"1 lb pouch","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"black-plums-760","name":"Black Plums","category":"produce","price":5.28,"unit":"lb","brand":"Valley Orchards","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"red-plums-392","name":"Red Plums","category":"produce","price":2.34,"unit":"lb","brand":"Valley Orchards","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"yellow-peaches-909","name":"Yellow Peaches","category":"produce","price":1.49,"unit":"lb","brand":"Sunny Acres","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"white-peaches-782","name":"White Peaches","category":"produce","price":2.86,"unit":"lb","brand":"Sunny Acres","size":"2 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"nectarines-7","name":"Nectarines","category":"produce","price":4.41,"unit":"lb","brand":"Sunny Acres","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.7,"season":["summer"],"substitutes":[]},
  {"id":"cantaloupe-425","name":"Cantaloupe","category":"produce","price":5.83,"unit":"pcs","brand":"Sunny Acres","size":"1 whole melon","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.64,"season":["summer"],"substitutes":[]},
  {"id":"honeydew-melon-22","name":"Honeydew Melon","category":"produce","price":2.17,"unit":"pcs","brand":"Sunny Acres","size":"1 whole melon","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"seedless-red-grapes-255","name":"Seedless Red Grapes","category":"produce","price":4.61,"unit":"bag","brand":"SunHarvest","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.32,"season":["all"],"substitutes":[]},
  {"id":"seedless-green-grapes-44","name":"Seedless Green Grapes","category":"produce","price":1.85,"unit":"bag","brand":"SunHarvest","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"papaya-527","name":"Papaya","category":"produce","price":2.72,"unit":"pcs","brand":"Tropicana Farms","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-kiwi-425","name":"Fresh Kiwi","category":"produce","price":2.08,"unit":"pack","brand":"Tropicana Farms","size":"1 lb clamshell","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":[]},
  {"id":"pomegranate-711","name":"Pomegranate","category":"produce","price":4.64,"unit":"pcs","brand":"Orchard Crate","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"fresh-figs-153","name":"Fresh Figs","category":"produce","price":5.8,"unit":"pack","brand":"Sunny Acres","size":"8 oz clamshell","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer","fall"],"substitutes":[]},
  {"id":"fresh-cranberries-191","name":"Fresh Cranberries","category":"produce","price":4.9,"unit":"bag","brand":"Cape Harvest","size":"12 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"yukon-gold-potatoes-374","name":"Yukon Gold Potatoes","category":"produce","price":5.17,"unit":"bag","brand":"Root Cellar","size":"5 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.28,"season":["all"],"substitutes":[]},
  {"id":"red-potatoes-75","name":"Red Potatoes","category":"produce","price":3.05,"unit":"bag","brand":"Root Cellar","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.37,"season":["all"],"substitutes":[]},
  {"id":"sweet-potatoes-176","name":"Sweet Potatoes","category":"produce","price":3.63,"unit":"bag","brand":"Root Cellar","size":"3 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"yellow-onions-783","name":"Yellow Onions","category":"produce","price":2.17,"unit":"bag","brand":"Field & Vine","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.09,"season":["all"],"substitutes":[]},
  {"id":"sweet-vidalia-onions-110","name":"Sweet Vidalia Onions","category":"produce","price":4.8,"unit":"bag","brand":"Field & Vine","size":"3 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","summer"],"substitutes":[]},
  {"id":"white-onions-501","name":"White Onions","category":"produce","price":4.01,"unit":"bag","brand":"Field & Vine","size":"2 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.13,"season":["all"],"substitutes":[]},
  {"id":"green-onions-scallions-868","name":"Green Onions Scallions","category":"produce","price":2.08,"unit":"bunch","brand":"GreenLeaf Co.","size":"1 bunch","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"shallots-833","name":"Shallots","category":"produce","price":4.47,"unit":"bag","brand":"Root Cellar","size":"8 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"broccoli-crowns-435","name":"Broccoli Crowns","category":"produce","price":2.57,"unit":"lb","brand":"GreenLeaf Co.","size":"1 lb","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"broccoli-rabe-539","name":"Broccoli Rabe","category":"produce","price":2.92,"unit":"bunch","brand":"GreenLeaf Co.","size":"1 bunch","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.28,"season":["fall","spring"],"substitutes":[]},
  {"id":"cauliflower-head-582","name":"Cauliflower Head","category":"produce","price":5.92,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 head","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"brussels-sprouts-970","name":"Brussels Sprouts","category":"produce","price":4.66,"unit":"bag","brand":"GreenLeaf Co.","size":"1 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"green-bell-peppers-375","name":"Green Bell Peppers","category":"produce","price":2.25,"unit":"pack","brand":"Sunny Acres","size":"3 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer","all"],"substitutes":[]},
  {"id":"red-bell-peppers-323","name":"Red Bell Peppers","category":"produce","price":5.14,"unit":"pack","brand":"Sunny Acres","size":"2 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer","all"],"substitutes":[]},
  {"id":"yellow-bell-peppers-434","name":"Yellow Bell Peppers","category":"produce","price":4.4,"unit":"pack","brand":"Sunny Acres","size":"2 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer","all"],"substitutes":[]},
  {"id":"jalapeno-peppers-379","name":"Jalapeno Peppers","category":"produce","price":2.31,"unit":"pack","brand":"Sunny Acres","size":"8 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"serrano-peppers-610","name":"Serrano Peppers","category":"produce","price":2.99,"unit":"pack","brand":"Sunny Acres","size":"8 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"poblano-peppers-547","name":"Poblano Peppers","category":"produce","price":2,"unit":"pack","brand":"Sunny Acres","size":"2 ct pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"zucchini-squash-177","name":"Zucchini Squash","category":"produce","price":3.63,"unit":"lb","brand":"Sunny Acres","size":"1 lb","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.84,"season":["summer"],"substitutes":[]},
  {"id":"yellow-squash-285","name":"Yellow Squash","category":"produce","price":3.48,"unit":"lb","brand":"Sunny Acres","size":"1 lb","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.71,"season":["summer"],"substitutes":[]},
  {"id":"butternut-squash-261","name":"Butternut Squash","category":"produce","price":2.81,"unit":"pcs","brand":"Root Cellar","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"acorn-squash-490","name":"Acorn Squash","category":"produce","price":2.9,"unit":"pcs","brand":"Root Cellar","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"spaghetti-squash-903","name":"Spaghetti Squash","category":"produce","price":3.74,"unit":"pcs","brand":"Root Cellar","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":["Quinoa"]},
  {"id":"english-cucumber-930","name":"English Cucumber","category":"produce","price":3.98,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 ct wrapped","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mini-seedless-cucumbers-294","name":"Mini Seedless Cucumbers","category":"produce","price":2.02,"unit":"pack","brand":"GreenLeaf Co.","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":1.58,"season":["all"],"substitutes":[]},
  {"id":"grape-tomatoes-989","name":"Grape Tomatoes","category":"produce","price":2.18,"unit":"pack","brand":"Sunny Acres","size":"10 oz pint","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cherry-tomatoes-on-vine-23","name":"Cherry Tomatoes on Vine","category":"produce","price":4.42,"unit":"pack","brand":"Sunny Acres","size":"12 oz pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"heirloom-tomatoes-656","name":"Heirloom Tomatoes","category":"produce","price":4.52,"unit":"lb","brand":"Sunny Acres","size":"1 lb","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"beefsteak-tomatoes-647","name":"Beefsteak Tomatoes","category":"produce","price":5.87,"unit":"lb","brand":"Sunny Acres","size":"2 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"tomatillos-753","name":"Tomatillos","category":"produce","price":4.62,"unit":"lb","brand":"Field & Vine","size":"1 lb","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.48,"season":["all"],"substitutes":[]},
  {"id":"celery-stalks-470","name":"Celery Stalks","category":"produce","price":6.83,"unit":"bunch","brand":"GreenLeaf Co.","size":"1 bunch","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"green-cabbage-head-195","name":"Green Cabbage Head","category":"produce","price":3.23,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 head","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"red-cabbage-head-133","name":"Red Cabbage Head","category":"produce","price":3.09,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 head","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"napa-cabbage-98","name":"Napa Cabbage","category":"produce","price":3.39,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 head","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bok-choy-232","name":"Bok Choy","category":"produce","price":2.44,"unit":"bunch","brand":"GreenLeaf Co.","size":"1 bunch","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-arugula-544","name":"Baby Arugula","category":"produce","price":4.51,"unit":"tub","brand":"GreenLeaf Co.","size":"5 oz tub","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","fall"],"substitutes":[]},
  {"id":"spring-mix-greens-830","name":"Spring Mix Greens","category":"produce","price":6.68,"unit":"tub","brand":"GreenLeaf Co.","size":"16 oz tub","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"romaine-hearts-35","name":"Romaine Hearts","category":"produce","price":2.75,"unit":"bag","brand":"GreenLeaf Co.","size":"3 ct bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"iceberg-lettuce-626","name":"Iceberg Lettuce","category":"produce","price":4.6,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 head","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.23,"season":["all"],"substitutes":[]},
  {"id":"butterhead-lettuce-621","name":"Butterhead Lettuce","category":"produce","price":2.59,"unit":"pcs","brand":"GreenLeaf Co.","size":"1 live head","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"swiss-chard-38","name":"Swiss Chard","category":"produce","price":4.71,"unit":"bunch","brand":"GreenLeaf Co.","size":"1 bunch","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.4,"season":["spring","fall"],"substitutes":[]},
  {"id":"fresh-asparagus-983","name":"Fresh Asparagus","category":"produce","price":2.05,"unit":"bunch","brand":"GreenLeaf Co.","size":"1 lb bunch","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring"],"substitutes":[]},
  {"id":"green-beans-180","name":"Green Beans","category":"produce","price":1.78,"unit":"bag","brand":"Sunny Acres","size":"12 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"sugar-snap-peas-852","name":"Sugar Snap Peas","category":"produce","price":3.61,"unit":"bag","brand":"Sunny Acres","size":"8 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring"],"substitutes":[]},
  {"id":"snow-peas-635","name":"Snow Peas","category":"produce","price":3.11,"unit":"bag","brand":"Sunny Acres","size":"8 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring"],"substitutes":[]},
  {"id":"sweet-corn-on-cob-7","name":"Sweet Corn on Cob","category":"produce","price":2.81,"unit":"pack","brand":"Sunny Acres","size":"4 ct tray","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"eggplant-309","name":"Eggplant","category":"produce","price":4.02,"unit":"pcs","brand":"Sunny Acres","size":"1 ct","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer","fall"],"substitutes":[]},
  {"id":"red-radishes-555","name":"Red Radishes","category":"produce","price":6.89,"unit":"bunch","brand":"Root Cellar","size":"1 bunch","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["spring"],"substitutes":[]},
  {"id":"fresh-beets-with-greens-972","name":"Fresh Beets with Greens","category":"produce","price":4.4,"unit":"bunch","brand":"Root Cellar","size":"1 bunch","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.84,"season":["fall","winter"],"substitutes":[]},
  {"id":"turnips-137","name":"Turnips","category":"produce","price":2.67,"unit":"bunch","brand":"Root Cellar","size":"1 bunch","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"parsnips-872","name":"Parsnips","category":"produce","price":1.74,"unit":"bag","brand":"Root Cellar","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"leeks-618","name":"Leeks","category":"produce","price":3.57,"unit":"bunch","brand":"GreenLeaf Co.","size":"2 ct bunch","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["winter","spring"],"substitutes":[]},
  {"id":"fresh-ginger-root-265","name":"Fresh Ginger Root","category":"produce","price":3.02,"unit":"lb","brand":"Root Cellar","size":"0.5 lb","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.36,"season":["all"],"substitutes":[]},
  {"id":"turmeric-root-846","name":"Turmeric Root","category":"produce","price":3.7,"unit":"lb","brand":"Root Cellar","size":"0.25 lb","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"white-button-mushrooms-807","name":"White Button Mushrooms","category":"produce","price":5.81,"unit":"pack","brand":"Forest Forage","size":"8 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cremini-baby-bella-mushrooms-698","name":"Cremini Baby Bella Mushrooms","category":"produce","price":3.02,"unit":"pack","brand":"Forest Forage","size":"8 oz pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"portobello-mushroom-caps-807","name":"Portobello Mushroom Caps","category":"produce","price":3.65,"unit":"pack","brand":"Forest Forage","size":"6 oz tray (2 caps)","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3,"season":["all"],"substitutes":[]},
  {"id":"shiitake-mushrooms-682","name":"Shiitake Mushrooms","category":"produce","price":4.96,"unit":"pack","brand":"Forest Forage","size":"3.5 oz pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-basil-leaves-386","name":"Fresh Basil Leaves","category":"produce","price":2.53,"unit":"pack","brand":"Herb Garden","size":"0.75 oz pack","isOrganic":true,"inStock":true,"onSale":true,"salePrice":1.79,"season":["summer","all"],"substitutes":[]},
  {"id":"fresh-cilantro-773","name":"Fresh Cilantro","category":"produce","price":2.05,"unit":"bunch","brand":"Herb Garden","size":"1 bunch","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-flat-italian-parsley-766","name":"Fresh Flat Italian Parsley","category":"produce","price":5.85,"unit":"bunch","brand":"Herb Garden","size":"1 bunch","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-rosemary-776","name":"Fresh Rosemary","category":"produce","price":6.15,"unit":"pack","brand":"Herb Garden","size":"0.75 oz pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-thyme-527","name":"Fresh Thyme","category":"produce","price":2.19,"unit":"pack","brand":"Herb Garden","size":"0.75 oz pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-mint-750","name":"Fresh Mint","category":"produce","price":1.65,"unit":"pack","brand":"Herb Garden","size":"0.75 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"fresh-dill-87","name":"Fresh Dill","category":"produce","price":3.97,"unit":"pack","brand":"Herb Garden","size":"0.75 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","summer"],"substitutes":[]},
  {"id":"boneless-skinless-chicken-thighs-371","name":"Boneless Skinless Chicken Thighs","category":"meat-seafood","price":15.17,"unit":"lb","brand":"Prairie Poultry","size":"1.5 lb tray","isOrganic":true,"inStock":true,"onSale":true,"salePrice":14.88,"season":["all"],"substitutes":[]},
  {"id":"whole-young-chicken-454","name":"Whole Young Chicken","category":"meat-seafood","price":15.49,"unit":"pcs","brand":"Prairie Poultry","size":"4.5 lb whole","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chicken-wings-119","name":"Chicken Wings","category":"meat-seafood","price":10.1,"unit":"lb","brand":"Prairie Poultry","size":"2 lb pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.09,"season":["all"],"substitutes":[]},
  {"id":"chicken-drumsticks-79","name":"Chicken Drumsticks","category":"meat-seafood","price":9.18,"unit":"lb","brand":"Prairie Poultry","size":"2 lb family pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"grass-fed-ribeye-steak-190","name":"Grass-Fed Ribeye Steak","category":"meat-seafood","price":11.51,"unit":"lb","brand":"Ranch Reserve","size":"12 oz cut","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"new-york-strip-steak-113","name":"New York Strip Steak","category":"meat-seafood","price":5.35,"unit":"lb","brand":"Ranch Reserve","size":"10 oz cut","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"filet-mignon-tenderloin-steak-605","name":"Filet Mignon Tenderloin Steak","category":"meat-seafood","price":12.33,"unit":"lb","brand":"Ranch Reserve","size":"8 oz cut","isOrganic":true,"inStock":true,"onSale":true,"salePrice":5.54,"season":["all"],"substitutes":[]},
  {"id":"beef-chuck-roast-614","name":"Beef Chuck Roast","category":"meat-seafood","price":15.45,"unit":"lb","brand":"Ranch Reserve","size":"2.5 lb roast","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"beef-flank-steak-249","name":"Beef Flank Steak","category":"meat-seafood","price":14.47,"unit":"lb","brand":"Ranch Reserve","size":"1.5 lb cut","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.44,"season":["all"],"substitutes":[]},
  {"id":"pork-chops-boneless-478","name":"Pork Chops Boneless","category":"meat-seafood","price":5.55,"unit":"lb","brand":"Hearth & Farm","size":"1 lb tray (2 cuts)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pork-tenderloin-501","name":"Pork Tenderloin","category":"meat-seafood","price":6.92,"unit":"lb","brand":"Hearth & Farm","size":"1.25 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"thick-cut-smoked-bacon-90","name":"Thick Cut Smoked Bacon","category":"meat-seafood","price":6.56,"unit":"pack","brand":"Hearth & Farm","size":"16 oz pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ground-pork-883","name":"Ground Pork","category":"meat-seafood","price":13.7,"unit":"lb","brand":"Hearth & Farm","size":"1 lb brick","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lamb-loin-chops-447","name":"Lamb Loin Chops","category":"meat-seafood","price":11.24,"unit":"lb","brand":"Pasture Prime","size":"1 lb (4 chops)","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["spring","all"],"substitutes":[]},
  {"id":"ground-lamb-910","name":"Ground Lamb","category":"meat-seafood","price":6.93,"unit":"lb","brand":"Pasture Prime","size":"1 lb","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"atlantic-salmon-fillets-755","name":"Atlantic Salmon Fillets","category":"meat-seafood","price":10.07,"unit":"lb","brand":"Ocean Catch","size":"1 lb (2 fillets)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Wild Alaskan Cod Fillets"]},
  {"id":"wild-sockeye-salmon-fillet-604","name":"Wild Sockeye Salmon Fillet","category":"meat-seafood","price":13.77,"unit":"lb","brand":"Ocean Catch","size":"1 lb fillet","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":["Wild Alaskan Cod Fillets"]},
  {"id":"wild-alaskan-cod-fillets-583","name":"Wild Alaskan Cod Fillets","category":"meat-seafood","price":16.56,"unit":"lb","brand":"Ocean Catch","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"halibut-steak-fillet-671","name":"Halibut Steak Fillet","category":"meat-seafood","price":5.2,"unit":"lb","brand":"Ocean Catch","size":"12 oz cut","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"rainbow-trout-fillets-976","name":"Rainbow Trout Fillets","category":"meat-seafood","price":7.27,"unit":"lb","brand":"Ocean Catch","size":"1 lb","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.83,"season":["all"],"substitutes":[]},
  {"id":"raw-jumbo-shrimp-peeled-237","name":"Raw Jumbo Shrimp Peeled","category":"meat-seafood","price":10.08,"unit":"bag","brand":"Ocean Catch","size":"1 lb bag (16/20 ct)","isOrganic":false,"inStock":true,"onSale":true,"salePrice":7.69,"season":["all"],"substitutes":[]},
  {"id":"wild-sea-scallops-315","name":"Wild Sea Scallops","category":"meat-seafood","price":15.55,"unit":"lb","brand":"Ocean Catch","size":"1 lb pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-yellowfin-tuna-steaks-305","name":"Fresh Yellowfin Tuna Steaks","category":"meat-seafood","price":15.18,"unit":"lb","brand":"Ocean Catch","size":"12 oz (2 steaks)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lump-crab-meat-655","name":"Lump Crab Meat","category":"meat-seafood","price":9.3,"unit":"tub","brand":"Ocean Catch","size":"8 oz tub","isOrganic":false,"inStock":true,"onSale":true,"salePrice":7.25,"season":["all"],"substitutes":[]},
  {"id":"wild-cold-water-lobster-tails-476","name":"Wild Cold Water Lobster Tails","category":"meat-seafood","price":6.86,"unit":"pack","brand":"Ocean Catch","size":"8 oz (2 tails)","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pasture-raised-large-brown-eggs-159","name":"Pasture-Raised Large Brown Eggs","category":"dairy-eggs","price":7.16,"unit":"dozen","brand":"Vital Farms","size":"12 ct","isOrganic":true,"inStock":true,"onSale":true,"salePrice":4.04,"season":["all"],"substitutes":[]},
  {"id":"aged-sharp-cheddar-cheese-750","name":"Aged Sharp Cheddar Cheese","category":"dairy-eggs","price":2.55,"unit":"block","brand":"Cabot Creamery","size":"8 oz block","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fresh-mozzarella-ball-in-water-855","name":"Fresh Mozzarella Ball in Water","category":"dairy-eggs","price":6.32,"unit":"tub","brand":"BelGioioso","size":"8 oz tub","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"parmigiano-reggiano-wedge-876","name":"Parmigiano Reggiano Wedge","category":"dairy-eggs","price":3.76,"unit":"block","brand":"Bella Italia","size":"7 oz wedge","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"imported-french-brie-cheese-788","name":"Imported French Brie Cheese","category":"dairy-eggs","price":6.28,"unit":"block","brand":"President","size":"8 oz wheel","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dutch-smoked-gouda-cheese-684","name":"Dutch Smoked Gouda Cheese","category":"dairy-eggs","price":6.79,"unit":"block","brand":"Golden Rind","size":"7 oz block","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.12,"season":["all"],"substitutes":[]},
  {"id":"crumbled-feta-cheese-in-brine-434","name":"Crumbled Feta Cheese in Brine","category":"dairy-eggs","price":4.57,"unit":"tub","brand":"Olympus Dairy","size":"6 oz tub","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-whole-milk-ricotta-cheese-374","name":"Organic Whole Milk Ricotta Cheese","category":"dairy-eggs","price":2.75,"unit":"tub","brand":"Bella Italia","size":"15 oz tub","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"sour-cream-all-natural-241","name":"Sour Cream All Natural","category":"dairy-eggs","price":4.25,"unit":"tub","brand":"Meadow Fresh","size":"16 oz tub","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"european-style-cultured-unsalted-butter-381","name":"European Style Cultured Unsalted Butter","category":"dairy-eggs","price":4.17,"unit":"pack","brand":"Kerrygold","size":"8 oz foil pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.98,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"grass-fed-salted-butter-691","name":"Grass-Fed Salted Butter","category":"dairy-eggs","price":3.29,"unit":"pack","brand":"Kerrygold","size":"8 oz foil pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.55,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"plain-whole-milk-greek-yogurt-922","name":"Plain Whole Milk Greek Yogurt","category":"dairy-eggs","price":5.04,"unit":"tub","brand":"Fage Total","size":"32 oz tub","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.97,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"organic-soy-milk-plain-unsweetened-921","name":"Organic Soy Milk Plain Unsweetened","category":"dairy-eggs","price":7.8,"unit":"carton","brand":"Silk","size":"64 fl oz carton","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"unsweetened-coconut-milk-beverage-190","name":"Unsweetened Coconut Milk Beverage","category":"dairy-eggs","price":3.26,"unit":"carton","brand":"So Delicious","size":"64 fl oz carton","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-half-and-half-214","name":"Organic Half and Half","category":"dairy-eggs","price":6.34,"unit":"carton","brand":"Horizon Organic","size":"32 fl oz carton","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"plain-kefir-cultured-milk-331","name":"Plain Kefir Cultured Milk","category":"dairy-eggs","price":7.83,"unit":"bottle","brand":"Lifeway","size":"32 fl oz bottle","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-white-quinoa-771","name":"Organic White Quinoa","category":"pantry","price":6.05,"unit":"bag","brand":"Ancient Harvest","size":"16 oz bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":4.72,"season":["all"],"substitutes":["Jasmine Rice Fragrant"]},
  {"id":"organic-tri-color-quinoa-956","name":"Organic Tri-Color Quinoa","category":"pantry","price":1.8,"unit":"bag","brand":"Ancient Harvest","size":"16 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Jasmine Rice Fragrant"]},
  {"id":"jasmine-rice-fragrant-705","name":"Jasmine Rice Fragrant","category":"pantry","price":2.09,"unit":"bag","brand":"Dynasty","size":"5 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"basmati-rice-aged-long-grain-378","name":"Basmati Rice Aged Long Grain","category":"pantry","price":4.49,"unit":"bag","brand":"Royal","size":"5 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"brown-jasmine-rice-648","name":"Brown Jasmine Rice","category":"pantry","price":4.66,"unit":"bag","brand":"Lundberg Farms","size":"2 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wild-rice-blend-48","name":"Wild Rice Blend","category":"pantry","price":9.77,"unit":"bag","brand":"Lundberg Farms","size":"1 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"rolled-old-fashioned-oats-429","name":"Rolled Old Fashioned Oats","category":"pantry","price":9.99,"unit":"bag","brand":"Bob's Red Mill","size":"32 oz bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":7.89,"season":["all"],"substitutes":[]},
  {"id":"steel-cut-oats-17","name":"Steel Cut Oats","category":"pantry","price":8.81,"unit":"bag","brand":"Bob's Red Mill","size":"24 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-pearl-barley-326","name":"Organic Pearl Barley","category":"pantry","price":4.78,"unit":"bag","brand":"Bob's Red Mill","size":"24 oz bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dry-black-beans-994","name":"Dry Black Beans","category":"pantry","price":2.98,"unit":"bag","brand":"Goya","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.32,"season":["all"],"substitutes":[]},
  {"id":"dry-pinto-beans-12","name":"Dry Pinto Beans","category":"pantry","price":2.69,"unit":"bag","brand":"Goya","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.16,"season":["all"],"substitutes":[]},
  {"id":"dry-red-kidney-beans-815","name":"Dry Red Kidney Beans","category":"pantry","price":5.6,"unit":"bag","brand":"Goya","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.3,"season":["all"],"substitutes":[]},
  {"id":"dry-garbanzo-chickpeas-663","name":"Dry Garbanzo Chickpeas","category":"pantry","price":4.39,"unit":"bag","brand":"Goya","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dry-brown-lentils-426","name":"Dry Brown Lentils","category":"pantry","price":6.66,"unit":"bag","brand":"Arrowhead Mills","size":"1 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dry-red-split-lentils-105","name":"Dry Red Split Lentils","category":"pantry","price":5.91,"unit":"bag","brand":"Arrowhead Mills","size":"1 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"canned-black-beans-low-sodium-10","name":"Canned Black Beans Low Sodium","category":"pantry","price":5.26,"unit":"can","brand":"Bush’s Best","size":"15 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"canned-organic-garbanzo-chickpeas-733","name":"Canned Organic Garbanzo Chickpeas","category":"pantry","price":9.98,"unit":"can","brand":"Eden Foods","size":"15 oz can","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"canned-cannellini-white-kidney-beans-738","name":"Canned Cannellini White Kidney Beans","category":"pantry","price":5.84,"unit":"can","brand":"Progresso","size":"15 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"extra-virgin-cold-pressed-olive-oil-338","name":"Extra Virgin Cold Pressed Olive Oil","category":"pantry","price":7.94,"unit":"bottle","brand":"California Olive Ranch","size":"25.4 fl oz bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-unrefined-virgin-coconut-oil-361","name":"Organic Unrefined Virgin Coconut Oil","category":"pantry","price":6.72,"unit":"tub","brand":"Nutiva","size":"15 fl oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"toasted-pure-sesame-oil-361","name":"Toasted Pure Sesame Oil","category":"pantry","price":5.67,"unit":"bottle","brand":"Kadoya","size":"11 fl oz bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pure-avocado-oil-high-heat-177","name":"Pure Avocado Oil High Heat","category":"pantry","price":9.48,"unit":"bottle","brand":"Chosen Foods","size":"16.9 fl oz bottle","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.56,"season":["all"],"substitutes":[]},
  {"id":"raw-unfiltered-apple-cider-vinegar-952","name":"Raw Unfiltered Apple Cider Vinegar","category":"pantry","price":7.91,"unit":"bottle","brand":"Bragg","size":"16 fl oz bottle","isOrganic":true,"inStock":true,"onSale":true,"salePrice":6.24,"season":["all"],"substitutes":[]},
  {"id":"aged-balsamic-vinegar-of-modena-60","name":"Aged Balsamic Vinegar of Modena","category":"pantry","price":4.47,"unit":"bottle","brand":"Lucini","size":"8.5 fl oz bottle","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"raw-clover-honey-pure-345","name":"Raw Clover Honey Pure","category":"pantry","price":4.85,"unit":"bottle","brand":"Nature Nate’s","size":"16 oz squeeze bottle","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pure-grade-a-dark-maple-syrup-407","name":"Pure Grade A Dark Maple Syrup","category":"pantry","price":5.64,"unit":"bottle","brand":"Coombs Family Farms","size":"12 fl oz bottle","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"unbleached-all-purpose-flour","name":"Unbleached All Purpose Flour","category":"household","price":7.54,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"whole-wheat-flour-stone-ground-835","name":"Whole Wheat Flour Stone Ground","category":"pantry","price":11.45,"unit":"bag","brand":"King Arthur Baking","size":"5 lb bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":7.51,"season":["all"],"substitutes":[]},
  {"id":"almond-flour-super-fine-560","name":"Almond Flour Super Fine","category":"pantry","price":4.59,"unit":"bag","brand":"Bob's Red Mill","size":"16 oz bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-pure-cane-sugar-903","name":"Organic Pure Cane Sugar","category":"pantry","price":2.35,"unit":"bag","brand":"Wholesome Sweeteners","size":"2 lb bag","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"coarse-sea-salt-crystals-365","name":"Coarse Sea Salt Crystals","category":"pantry","price":9.36,"unit":"box","brand":"Maldon","size":"8.5 oz box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-black-peppercorns-grinder-409","name":"Organic Black Peppercorns Grinder","category":"pantry","price":8.95,"unit":"tub","brand":"Simply Organic","size":"2.8 oz grinder jar","isOrganic":true,"inStock":true,"onSale":true,"salePrice":6.76,"season":["all"],"substitutes":[]},
  {"id":"ground-ceylon-cinnamon-41","name":"Ground Ceylon Cinnamon","category":"pantry","price":3.46,"unit":"tub","brand":"Frontier Co-op","size":"1.9 oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ground-cumin-seed-organic-819","name":"Ground Cumin Seed Organic","category":"pantry","price":3.02,"unit":"tub","brand":"Simply Organic","size":"2.3 oz jar","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.38,"season":["all"],"substitutes":[]},
  {"id":"organic-low-sodium-chicken-bone-broth-678","name":"Organic Low Sodium Chicken Bone Broth","category":"pantry","price":11,"unit":"carton","brand":"Pacific Foods","size":"32 fl oz carton","isOrganic":true,"inStock":true,"onSale":true,"salePrice":8.56,"season":["all"],"substitutes":[]},
  {"id":"organic-low-sodium-vegetable-broth-513","name":"Organic Low Sodium Vegetable Broth","category":"pantry","price":9.54,"unit":"carton","brand":"Pacific Foods","size":"32 fl oz carton","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"san-marzano-whole-peeled-tomatoes-264","name":"San Marzano Whole Peeled Tomatoes","category":"pantry","price":11.25,"unit":"can","brand":"Cento","size":"28 oz can","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-tomato-paste-in-glass-jar-137","name":"Organic Tomato Paste in Glass Jar","category":"pantry","price":11.4,"unit":"tub","brand":"Bionaturae","size":"7 oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"creamy-valencia-peanut-butter-no-sugar-738","name":"Creamy Valencia Peanut Butter No Sugar","category":"pantry","price":6.41,"unit":"tub","brand":"MaraNatha","size":"16 oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"raw-creamy-almond-butter-227","name":"Raw Creamy Almond Butter","category":"pantry","price":1.69,"unit":"tub","brand":"Artisana Organics","size":"14 oz jar","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"semolina-spaghetti-no-12-663","name":"Semolina Spaghetti No. 12","category":"pantry","price":4.38,"unit":"box","brand":"De Cecco","size":"1 lb box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Quinoa"]},
  {"id":"bronze-cut-penne-rigate-661","name":"Bronze Cut Penne Rigate","category":"pantry","price":2.76,"unit":"box","brand":"De Cecco","size":"1 lb box","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Quinoa"]},
  {"id":"organic-apple-butternut-squash-baby-food","name":"Organic Apple Butternut Squash Baby Food","category":"baby","price":13.4,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-apple-spinach-kale-baby-food","name":"Organic Apple Spinach Kale Baby Food","category":"baby","price":20.98,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Kale Bunches"]},
  {"id":"organic-apple-sweet-potato-baby-food","name":"Organic Apple Sweet Potato Baby Food","category":"baby","price":16.53,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-pear-carrot-broccoli-baby-food","name":"Organic Pear Carrot Broccoli Baby Food","category":"baby","price":18.51,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-pear-strawberry-rhubarb-baby-food","name":"Organic Pear Strawberry Rhubarb Baby Food","category":"baby","price":5.81,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-prune-baby-food","name":"Organic Prune Baby Food","category":"baby","price":21.4,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-food-stage-1-beef-and-broth","name":"Baby Food Stage 1 Beef And Broth","category":"baby","price":17.82,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"baby-food-stage-1-chkn-and-broth","name":"Baby Food Stage 1 Chkn And Broth","category":"baby","price":11.7,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"baby-food-stage-1-turkey-and-broth","name":"Baby Food Stage 1 Turkey And Broth","category":"baby","price":4.72,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["fall","winter"],"substitutes":[]},
  {"id":"baby-food-stage-2-applesauce","name":"Baby Food Stage 2 Applesauce","category":"baby","price":6.36,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baby-food-stage-2-bananas","name":"Baby Food Stage 2 Bananas","category":"baby","price":18.19,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-broccoli-pear-baby-food","name":"Organic Broccoli Pear Baby Food","category":"baby","price":12.42,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-carrot-pumpkin-baby-food","name":"Organic Carrot Pumpkin Baby Food","category":"baby","price":19.95,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-spinach-apple-sweet-potato-baby-food","name":"Organic Spinach Apple Sweet Potato Baby Food","category":"baby","price":11.62,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Kale Bunches"]},
  {"id":"organic-sweet-potato-mango-baby-food","name":"Organic Sweet Potato Mango Baby Food","category":"baby","price":18.94,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":true,"salePrice":15.92,"season":["all"],"substitutes":[]},
  {"id":"peas-organic-baby-food","name":"Peas Organic Baby Food","category":"baby","price":11.41,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"stage-2-organic-pears-baby-food","name":"Stage 2 Organic Pears Baby Food","category":"baby","price":10.16,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"tender-chicken-stars-baby-food","name":"Tender Chicken & Stars Baby Food","category":"baby","price":11.76,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pepperlicious-toddler-snack","name":"Pepperlicious Toddler Snack","category":"baby","price":9.4,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"two-to-mango-toddler-snack","name":"Two To Mango Toddler Snack","category":"baby","price":16.45,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"yoyummy-yogurt-squeeze-mixed-berry","name":"Yoyummy Yogurt Squeeze Mixed Berry","category":"dairy-eggs","price":3.58,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"happy-tot-love-my-veggies-organic-banana","name":"Happy Tot Love My Veggies Organic Banana","category":"dairy-eggs","price":3.58,"unit":"pack","brand":"4 22 Oz","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"happy-tot-love-my-veggies-organic-spinach","name":"Happy Tot Love My Veggies Organic Spinach","category":"dairy-eggs","price":4.72,"unit":"pack","brand":"4 22 Oz","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Kale Bunches"]},
  {"id":"strawberry-banana-yogurt-tubes","name":"Strawberry Banana Yogurt Tubes","category":"dairy-eggs","price":5.86,"unit":"tub","brand":"Baby-food","size":"16 oz tub","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kefir-cultured-whole-milk","name":"Kefir Cultured Whole Milk","category":"dairy-eggs","price":3.16,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"organic-kefir-strawnana-probugs","name":"Organic Kefir Strawnana Probugs","category":"dairy-eggs","price":4.18,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"green-kale-apples-fruit-veggie-blend","name":"Green Kale & Apples Fruit & Veggie Blend","category":"dairy-eggs","price":3.83,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Baby Spinach"]},
  {"id":"mama-blueberry-fruit-veggie-blend","name":"Mama Blueberry Fruit & Veggie Blend","category":"dairy-eggs","price":6.03,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ohmymega-veggie-fruit-veggie-blend","name":"Ohmymega Veggie Fruit & Veggie Blend","category":"dairy-eggs","price":6.37,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-ohmymega-veggie-fruit-veggie-blend","name":"Organic Ohmymega Veggie Fruit & Veggie Blend","category":"dairy-eggs","price":6.63,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"strawberry-banana-swirl-dairy-free-smoothie-457","name":"Strawberry Banana Swirl Dairy-free Smoothie","category":"beverages","price":6.04,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wild-rumpus-avocado-fruit-veggie-blend","name":"Wild Rumpus Avocado Fruit & Veggie Blend","category":"dairy-eggs","price":2.87,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-blueberry-whole-milk-yogurt-pouch","name":"Organic Blueberry Whole Milk Yogurt Pouch","category":"dairy-eggs","price":3.1,"unit":"bag","brand":"Baby-food","size":"1 lb bag","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.38,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"yobaby-whole-milk-baby-yogurt-pouches-68","name":"Yobaby Whole Milk Baby Yogurt Pouches","category":"dairy-eggs","price":4.1,"unit":"bag","brand":"Wholefoods","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.2,"season":["all"],"substitutes":["Oat Milk"]},
  {"id":"yobaby-plain-yogurt-6pk","name":"Yobaby Plain Yogurt 6pk","category":"dairy-eggs","price":2.47,"unit":"pack","brand":"Baby-food","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":1.93,"season":["all"],"substitutes":[]},
  {"id":"once-upon-a-farm-organic-fruit-veggie-blend-851","name":"Once Upon A Farm Organic Fruit & Veggie Blend","category":"dairy-eggs","price":7.33,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":true,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"once-upon-a-farm-organic-dairy-free-smoothie-538","name":"Once Upon A Farm Organic Dairy-free Smoothie","category":"beverages","price":2.85,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gogo-squeez-yogurtz","name":"Gogo Squeez Yogurtz","category":"dairy-eggs","price":4.93,"unit":"pack","brand":"4 Ct","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-chocolate-shell-topping","name":"Hershey's Chocolate Shell Topping","category":"beverages","price":5.44,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-syrup-genuine-chocolate-flavor","name":"Hershey's Syrup Genuine Chocolate Flavor","category":"beverages","price":1.77,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":1.34,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-sugar-free-chocolate-syrup","name":"Hershey's Sugar Free Chocolate Syrup","category":"beverages","price":2.32,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-hot-fudge-topping","name":"Hershey's Hot Fudge Topping","category":"pantry","price":6.98,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-caramel-topping","name":"Hershey's Caramel Topping","category":"snacks","price":3.51,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-caramel-syrup","name":"Hershey's Caramel Syrup","category":"snacks","price":5.62,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-classic-caramel-sundae-syrup","name":"Hershey's Classic Caramel Sundae Syrup","category":"snacks","price":3.26,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-natural-unsweetened-cocoa","name":"Hershey's Natural Unsweetened Cocoa","category":"pantry","price":6.8,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"krusteaz-cinnamon-crumb-cake-muffin-mix","name":"Krusteaz Cinnamon Crumb Cake & Muffin Mix","category":"beverages","price":3.62,"unit":"pack","brand":"Krusteaz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"krusteaz-honey-cornbread-muffin-mix","name":"Krusteaz Honey Cornbread & Muffin Mix","category":"beverages","price":6.86,"unit":"pack","brand":"Krusteaz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"krusteaz-cranberry-orange-supreme-muffin-mix","name":"Krusteaz Cranberry Orange Supreme Muffin Mix","category":"beverages","price":1.53,"unit":"pack","brand":"Krusteaz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-dark-chocolate-brownie-mix","name":"Ghirardelli Dark Chocolate Brownie Mix","category":"beverages","price":4.24,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"krusteaz-meyer-lemon-bar-mix","name":"Krusteaz Meyer Lemon Bar Mix","category":"beverages","price":6.3,"unit":"pack","brand":"Krusteaz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"krusteaz-buttermilk-pancake-mix","name":"Krusteaz Buttermilk Pancake Mix","category":"beverages","price":2.58,"unit":"pack","brand":"Krusteaz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"arm-hammer-pure-baking-soda-48","name":"Arm & Hammer Pure Baking Soda","category":"beverages","price":3.01,"unit":"pack","brand":"Arm & Hammer","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-rainbow-non-pariels","name":"Wilton Rainbow Non Pariels","category":"pantry","price":2.9,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-white-frosting","name":"Betty Crocker White Frosting","category":"pantry","price":4.51,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-whipped-vanilla-frosting","name":"Betty Crocker Whipped Vanilla Frosting","category":"pantry","price":9.25,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-whipped-cream-cheese-frosting","name":"Betty Crocker Whipped Cream Cheese Frosting","category":"personal-care","price":9.41,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-chocolate-frosting","name":"Betty Crocker Chocolate Frosting","category":"beverages","price":3.82,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-milk-chocolate-frosting","name":"Betty Crocker Milk Chocolate Frosting","category":"beverages","price":4.04,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-pie-crust-mix","name":"Betty Crocker Pie Crust Mix","category":"pantry","price":6.12,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-spice-cake-mix","name":"Betty Crocker Spice Cake Mix","category":"pantry","price":3.98,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-whipped-butter-cream-frosting","name":"Betty Crocker Whipped Butter Cream Frosting","category":"personal-care","price":9.4,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gold-medal-all-purpose-flour-762","name":"Gold Medal All Purpose Flour","category":"pantry","price":7.7,"unit":"pack","brand":"Gold Medal","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-super-moist-yellow-mix","name":"Betty Crocker Super Moist Yellow Mix","category":"pantry","price":7.18,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-supermoist-devil-food-cake-mix","name":"Betty Crocker Supermoist Devil Food Cake Mix","category":"pantry","price":5.21,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-super-moist-white-cake-mix","name":"Betty Crocker Super Moist White Cake Mix","category":"pantry","price":1.65,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-sugar-cookie-mix","name":"Betty Crocker Sugar Cookie Mix","category":"snacks","price":2.64,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.06,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-supermoist-vanilla-cake-mix","name":"Betty Crocker Supermoist Vanilla Cake Mix","category":"pantry","price":3.62,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-supreme-original-brownie-mix","name":"Betty Crocker Supreme Original Brownie Mix","category":"pantry","price":5.07,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-cookie-brownie-bars-mix","name":"Betty Crocker Cookie Brownie Bars Mix","category":"snacks","price":4.93,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-angel-food-white-cake-mix","name":"Betty Crocker Angel Food White Cake Mix","category":"pantry","price":5.71,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-classic-pizza-crust","name":"Pillsbury Classic Pizza Crust","category":"frozen","price":2.88,"unit":"pack","brand":"Pillsbury","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.08,"season":["all"],"substitutes":[]},
  {"id":"nestle-toll-house-premier-white-morsels","name":"Nestle Toll House Premier White Morsels","category":"pantry","price":4.44,"unit":"pack","brand":"Toll House","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"nestle-toll-house-milk-chocolate-morsels","name":"Nestle Toll House Milk Chocolate Morsels","category":"beverages","price":6.29,"unit":"pack","brand":"Toll House","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bisquick-original-pancake-and-baking-mix","name":"Bisquick Original Pancake And Baking Mix","category":"pantry","price":3.49,"unit":"pack","brand":"Bisquick","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.87,"season":["all"],"substitutes":[]},
  {"id":"bisquick-shake-n-pour-buttermilk-pancake-mix","name":"Bisquick Shake 'n Pour Buttermilk Pancake Mix","category":"dairy-eggs","price":3.17,"unit":"pack","brand":"Bisquick","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"wilton-red-sugar","name":"Wilton Red Sugar","category":"pantry","price":5.65,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-dark-green-sugar","name":"Wilton Dark Green Sugar","category":"pantry","price":9.76,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"duncan-hines-cream-cheese-frosting","name":"Duncan Hines Cream Cheese Frosting","category":"personal-care","price":5.13,"unit":"can","brand":"Duncan Hines","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"duncan-hines-vanilla-frosting","name":"Duncan Hines Vanilla Frosting","category":"pantry","price":2.45,"unit":"can","brand":"Duncan Hines","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"duncan-hines-chocolate-frosting","name":"Duncan Hines Chocolate Frosting","category":"beverages","price":4.6,"unit":"can","brand":"Duncan Hines","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-gel-icing-decorating-set","name":"Wilton Gel Icing Decorating Set","category":"pantry","price":9.65,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pam-canola-oil-baking-spray-with-flour","name":"Pam Canola Oil Baking Spray With Flour","category":"pantry","price":7.54,"unit":"can","brand":"Pam","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-pink-sugar","name":"Wilton Pink Sugar","category":"pantry","price":7.68,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-celebrations-assorted-candles","name":"Wilton Celebrations Assorted Candles","category":"pantry","price":3.87,"unit":"can","brand":"Wilton","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-creamy-supreme-vanilla-frosting","name":"Pillsbury Creamy Supreme Vanilla Frosting","category":"personal-care","price":4.56,"unit":"pack","brand":"Target","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-creamy-supreme-buttercream-frosting","name":"Pillsbury Creamy Supreme Buttercream Frosting","category":"personal-care","price":8.9,"unit":"pack","brand":"Target","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"smucker-s-caramel-flavored-topping","name":"Smucker's Caramel Flavored Topping","category":"snacks","price":4.09,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"smucker-s-magic-shell-chocolate-fudge","name":"Smucker's Magic Shell Chocolate Fudge","category":"beverages","price":2.11,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"smucker-s-magic-shell-chocolate","name":"Smucker's Magic Shell Chocolate","category":"beverages","price":6.95,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"smucker-s-chocolate-hot-fudge-toppings","name":"Smucker's Chocolate Hot Fudge Toppings","category":"beverages","price":5.34,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"smuckers-caramel-sundae-syrup","name":"Smuckers Caramel Sundae Syrup","category":"snacks","price":3.15,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-white-premium-baking-chips","name":"Ghirardelli White Premium Baking Chips","category":"snacks","price":4.5,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.51,"season":["all"],"substitutes":[]},
  {"id":"mccormick-4ct-assorted-food-color-and-egg-dye","name":"Mccormick 4ct Assorted Food Color And Egg Dye","category":"dairy-eggs","price":5.14,"unit":"pack","brand":"Mccormick","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jiffy-corn-muffin-mix-980","name":"Jiffy Corn Muffin Mix","category":"bakery","price":3.51,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.77,"season":["all"],"substitutes":[]},
  {"id":"wilton-candy-eye-balls","name":"Wilton Candy Eye Balls","category":"snacks","price":2.65,"unit":"can","brand":"Wilton","size":"12 oz can","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-snickerdoodle-cookie-mix","name":"Betty Crocker Snickerdoodle Cookie Mix","category":"snacks","price":2.95,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-pumpkin-cookie-mix","name":"Betty Crocker Pumpkin Cookie Mix","category":"snacks","price":5.81,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-chocolate-semi-sweet-mini-chips","name":"Ghirardelli Chocolate Semi Sweet Mini Chips","category":"beverages","price":5.01,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.88,"season":["all"],"substitutes":[]},
  {"id":"smucker-s-hot-caramel-topping","name":"Smucker's Hot Caramel Topping","category":"snacks","price":4.43,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"smucker-s-butterscotch-flavored-topping","name":"Smucker's Butterscotch Flavored Topping","category":"dairy-eggs","price":5.16,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"kodiak-cakes-whole-wheat","name":"Kodiak Cakes Whole Wheat","category":"frozen","price":3.02,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"reese-s-peanut-butter-baking-chips","name":"Reese's Peanut Butter Baking Chips","category":"snacks","price":2.86,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"nestle-nesquik-chocolate-syrup","name":"Nestle Nesquik Chocolate Syrup","category":"beverages","price":3.35,"unit":"pack","brand":"Nesquik","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"king-arthur-flour-unbleached-bread-flour","name":"King Arthur Flour Unbleached Bread Flour","category":"household","price":10.15,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.83,"season":["all"],"substitutes":[]},
  {"id":"mrs-richardson-s-caramel-topping","name":"Mrs Richardson's Caramel Topping","category":"snacks","price":5.01,"unit":"pack","brand":"Mrs Richardson's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.21,"season":["all"],"substitutes":[]},
  {"id":"heath-milk-chocolate-toffee-bits","name":"Heath Milk Chocolate Toffee Bits","category":"beverages","price":5.93,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"nestle-toll-house-dark-chocolate-morsels","name":"Nestle Toll House Dark Chocolate Morsels","category":"beverages","price":6.25,"unit":"pack","brand":"Toll House","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"king-arthur-gluten-free-muffin-mix","name":"King Arthur Gluten Free Muffin Mix","category":"bakery","price":6.08,"unit":"pack","brand":"King Arthur","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chiquita-banana-bread-mix","name":"Chiquita Banana Bread Mix","category":"bakery","price":4.71,"unit":"pack","brand":"Concord Foods","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-dark-chocolate-melting-wafers","name":"Ghirardelli Dark Chocolate Melting Wafers","category":"beverages","price":3.55,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.92,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-genuine-chocolate-syrup-833","name":"Hershey's Genuine Chocolate Syrup","category":"beverages","price":5.73,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.14,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-lite-chocolate-syrup","name":"Hershey's Lite Chocolate Syrup","category":"beverages","price":5.93,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-special-dark-chocolate-syrup","name":"Hershey's Special Dark Chocolate Syrup","category":"beverages","price":3.73,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"king-arthur-gluten-free-chocolate-cake-mix","name":"King Arthur Gluten Free Chocolate Cake Mix","category":"beverages","price":4.79,"unit":"pack","brand":"King Arthur","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"smucker-s-sundae-caramel-syrup","name":"Smucker's Sundae Caramel Syrup","category":"snacks","price":2.71,"unit":"pack","brand":"Smucker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"red-lobster-cheddar-bay-biscuit-mix","name":"Red Lobster Cheddar Bay Biscuit Mix","category":"snacks","price":2.84,"unit":"pack","brand":"Red Lobster","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"king-arthur-gluten-free-cookie-mix","name":"King Arthur Gluten Free Cookie Mix","category":"snacks","price":3.31,"unit":"pack","brand":"King Arthur","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"santa-cruz-organic-chocolate-syrup","name":"Santa Cruz Organic Chocolate Syrup","category":"beverages","price":5.42,"unit":"pack","brand":"Santa Cruz Organic","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"santa-cruz-organic-mint-chocolate-syrup","name":"Santa Cruz Organic Mint Chocolate Syrup","category":"beverages","price":3.05,"unit":"pack","brand":"Santa Cruz Organic","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ah-laska-chocolate-syrup","name":"Ah Laska Chocolate Syrup","category":"beverages","price":6.55,"unit":"pack","brand":"Ah Laska","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-rainbow-chip-frosting","name":"Betty Crocker Rainbow Chip Frosting","category":"snacks","price":6.44,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-premium-caramel-sauce","name":"Ghirardelli Premium Caramel Sauce","category":"snacks","price":3.24,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-premium-chocolate-syrup","name":"Ghirardelli Premium Chocolate Syrup","category":"beverages","price":3.24,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-milk-chocolate-baking-chips","name":"Hershey's Milk Chocolate Baking Chips","category":"beverages","price":3.41,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jiffy-blueberry-muffin-mix-682","name":"Jiffy Blueberry Muffin Mix","category":"bakery","price":4.44,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dean-jacob-s-ice-cream-accents","name":"Dean Jacob's Ice Cream Accents","category":"personal-care","price":8.03,"unit":"pack","brand":"Dean Jacob's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":6.32,"season":["summer"],"substitutes":[]},
  {"id":"famous-dave-s-cornbread-mix","name":"Famous Dave's Cornbread Mix","category":"bakery","price":5.29,"unit":"pack","brand":"Famous Dave's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-semi-sweet-chocolate-chips","name":"Ghirardelli Semi-sweet Chocolate Chips","category":"beverages","price":6.78,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-thin-pizza-crust","name":"Pillsbury Thin Pizza Crust","category":"frozen","price":7.04,"unit":"pack","brand":"Pillsbury","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.7,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-rainbow-chip-cake-mix","name":"Betty Crocker Rainbow Chip Cake Mix","category":"snacks","price":4.83,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"m-m-s-mini-s-milk-chocolate-baking-bits","name":"M&m's Mini's Milk Chocolate Baking Bits","category":"beverages","price":2.56,"unit":"pack","brand":"M&m's","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sander-s-milk-chocolate-hot-fudge-topping","name":"Sander's Milk Chocolate Hot Fudge Topping","category":"beverages","price":4.81,"unit":"pack","brand":"Sander's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.81,"season":["all"],"substitutes":[]},
  {"id":"sander-s-classic-caramel-topping","name":"Sander's Classic Caramel Topping","category":"snacks","price":3.53,"unit":"pack","brand":"Sander's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"krusteaz-wild-blueberry-muffin-mix","name":"Krusteaz Wild Blueberry Muffin Mix","category":"beverages","price":5.06,"unit":"pack","brand":"Krusteaz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"birch-benders-chocolate-chip-pancake-mix","name":"Birch Benders Chocolate Chip Pancake Mix","category":"beverages","price":2.66,"unit":"pack","brand":"Birch Benders","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"king-arthur-flour-unbleached-cake-flour-983","name":"King Arthur Flour Unbleached Cake Flour","category":"household","price":13.49,"unit":"pack","brand":"King Arthur","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"arm-hammer-fresh-n-natural-baking-soda","name":"Arm & Hammer Fresh N Natural Baking Soda","category":"beverages","price":5.68,"unit":"pack","brand":"Arm & Hammer","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-gluten-free-choc-chip-cookie-mix","name":"Pillsbury Gluten Free Choc Chip Cookie Mix","category":"snacks","price":4.58,"unit":"pack","brand":"Target","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baker-s-german-chocolate-baking-bars","name":"Baker's German Chocolate Baking Bars","category":"beverages","price":6.31,"unit":"pack","brand":"Baker's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"guittard-semisweet-chocolate-baking-chips","name":"Guittard Semisweet Chocolate Baking Chips","category":"beverages","price":5.86,"unit":"pack","brand":"Guittard","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"guittard-extra-dark-chocolate-baking-chips","name":"Guittard Extra Dark Chocolate Baking Chips","category":"beverages","price":3.58,"unit":"pack","brand":"Guittard","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"annie-s-organic-double-chocolate-brownie-mix","name":"Annie's Organic Double Chocolate Brownie Mix","category":"beverages","price":6.48,"unit":"pack","brand":"Annie's","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"annie-s-organic-cookie-brownie-bar-baking-mix","name":"Annie's Organic Cookie Brownie Bar Baking Mix","category":"snacks","price":2.49,"unit":"pack","brand":"Annie's","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-vanilla-flavored-filled-pastry-bag","name":"Pillsbury Vanilla Flavored Filled Pastry Bag","category":"bakery","price":5.19,"unit":"bag","brand":"Target","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-chocolate-fudge-filled-pastry-bag","name":"Pillsbury Chocolate Fudge Filled Pastry Bag","category":"beverages","price":5.34,"unit":"bag","brand":"Target","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kodiak-cakes-cornbread-mix","name":"Kodiak Cakes Cornbread Mix","category":"bakery","price":5.16,"unit":"pack","brand":"Kodiak Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.85,"season":["all"],"substitutes":[]},
  {"id":"apple-streusel-muffin-mix","name":"Apple Streusel Muffin Mix","category":"bakery","price":6.47,"unit":"pack","brand":"Archer Farms","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"reese-s-baking-cups-and-candy-pieces","name":"Reese's Baking Cups And Candy Pieces","category":"snacks","price":3.84,"unit":"can","brand":"Reese's","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ghirardelli-grand-semi-sweet-baking-chips","name":"Ghirardelli Grand Semi-sweet Baking Chips","category":"snacks","price":2.91,"unit":"pack","brand":"Ghirardelli","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.19,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-funfetti-vanilla-filled-pastry-bag","name":"Pillsbury Funfetti Vanilla Filled Pastry Bag","category":"bakery","price":3.32,"unit":"bag","brand":"Target","size":"1 lb bag","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"hershey-s-cinnamon-chip","name":"Hershey's Cinnamon Chip","category":"snacks","price":5.08,"unit":"pack","brand":"Hershey's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-white-cookie-icing","name":"Wilton White Cookie Icing","category":"snacks","price":2.73,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-red-cookie-icing","name":"Wilton Red Cookie Icing","category":"snacks","price":2.5,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-blue-cookie-icing","name":"Wilton Blue Cookie Icing","category":"snacks","price":4.43,"unit":"pack","brand":"Wilton","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.23,"season":["all"],"substitutes":[]},
  {"id":"honey-maid-graham-cracker-crumbs","name":"Honey Maid Graham Cracker Crumbs","category":"snacks","price":6.32,"unit":"pack","brand":"Honey Maid","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"meli-s-original-gluten-free-cookie-mix","name":"Meli's Original Gluten Free Cookie Mix","category":"snacks","price":2.1,"unit":"pack","brand":"Meli's Monster Cookies","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"meli-s-choco-lot-gluten-free-cookie-mix","name":"Meli's Choco-lot Gluten Free Cookie Mix","category":"snacks","price":4.39,"unit":"pack","brand":"Meli's Monster Cookies","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.58,"season":["all"],"substitutes":[]},
  {"id":"lily-s-dark-chocolate-baking-chips","name":"Lily's Dark Chocolate Baking Chips","category":"beverages","price":2.49,"unit":"pack","brand":"Lily's Sweets","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"godiva-milk-chocolate-morsels","name":"Godiva Milk Chocolate Morsels","category":"beverages","price":4.65,"unit":"pack","brand":"Godiva","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"nestle-toll-house-espresso-baking-morsels","name":"Nestle Toll House Espresso Baking Morsels","category":"beverages","price":1.68,"unit":"pack","brand":"Toll House","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baking-soda","name":"Baking Soda","category":"beverages","price":4.8,"unit":"pack","brand":"Good & Gather","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"milk-chocolate-morsels","name":"Milk Chocolate Morsels","category":"beverages","price":6.37,"unit":"pack","brand":"Good & Gather","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"torani-salted-caramel-syrup","name":"Torani Salted Caramel Syrup","category":"snacks","price":3.22,"unit":"pack","brand":"Torani","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kodiak-cakes-protein-ball-chocolate-chip","name":"Kodiak Cakes Protein Ball Chocolate Chip","category":"beverages","price":5.9,"unit":"pack","brand":"Kodiak Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lily-s-white-baking-chips","name":"Lily's White Baking Chips","category":"snacks","price":3.95,"unit":"pack","brand":"Lily's Sweets","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-edible-birthday-cookie-dough","name":"Betty Crocker Edible Birthday Cookie Dough","category":"snacks","price":4.18,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-brownie-mix-bundle","name":"Betty Crocker Brownie Mix Bundle","category":"bakery","price":4.65,"unit":"pack","brand":"Betty Crocker","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.28,"season":["all"],"substitutes":[]},
  {"id":"baking-mix","name":"Baking Mix","category":"bakery","price":5.37,"unit":"pack","brand":"Wholefoods","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bread-crumbs-961","name":"Bread Crumbs","category":"bakery","price":3.66,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-bread-flour-101","name":"Organic Bread Flour","category":"bakery","price":3.97,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":true,"inStock":true,"onSale":true,"salePrice":2.99,"season":["all"],"substitutes":[]},
  {"id":"organic-coconut-cream","name":"Organic Coconut Cream","category":"personal-care","price":5.32,"unit":"pack","brand":"Wholefoods","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-evaporated-milk","name":"Organic Evaporated Milk","category":"dairy-eggs","price":5.55,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-flour","name":"Organic Flour","category":"bakery","price":4.99,"unit":"pack","brand":"Wholefoods","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"italian-bread-crumbs","name":"Italian Bread Crumbs","category":"bakery","price":3.61,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"plain-bread-crumbs","name":"Plain Bread Crumbs","category":"bakery","price":5.5,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-unbleached-white-flour-789","name":"Organic Unbleached White Flour","category":"household","price":11.27,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"egg-replacer","name":"Egg Replacer","category":"dairy-eggs","price":3.91,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-unbleached-white-all-purpose-flour-307","name":"Organic Unbleached White All-purpose Flour","category":"household","price":12.07,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pizza-crust-mix","name":"Pizza Crust Mix","category":"frozen","price":6.06,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"coconut-cream","name":"Coconut Cream","category":"personal-care","price":10.73,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":7.84,"season":["all"],"substitutes":[]},
  {"id":"organic-italian-bread-crumbs","name":"Organic Italian Bread Crumbs","category":"bakery","price":4.8,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"breadcrumbs-italian-style","name":"Breadcrumbs Italian Style","category":"bakery","price":4.83,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"caramel-coconut","name":"Caramel Coconut","category":"snacks","price":5.96,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gluten-free-italian-style-panko-breadcrumbs","name":"Gluten Free Italian Style Panko Breadcrumbs","category":"bakery","price":3.63,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":false,"onSale":true,"salePrice":3.07,"season":["all"],"substitutes":[]},
  {"id":"gluten-free-orignal-panko-breadcrumbs","name":"Gluten-free Orignal Panko Breadcrumbs","category":"bakery","price":3.36,"unit":"pack","brand":"Ian's Natural Foods","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"flatbread-pizza-bread-mix","name":"Flatbread Pizza Bread Mix","category":"frozen","price":3.2,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"extra-crispy-batter-mix","name":"Extra Crispy Batter Mix","category":"snacks","price":6.47,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"panko-bread-crumbs","name":"Panko Bread Crumbs","category":"bakery","price":5.08,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gluten-free-banana-bread-mix","name":"Gluten Free Banana Bread Mix","category":"bakery","price":3.17,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"unbleached-bread-flour-863","name":"Unbleached Bread Flour","category":"household","price":8.19,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"unbleached-cake-flour-612","name":"Unbleached Cake Flour","category":"household","price":5.39,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"gluten-free-sugar-cones","name":"Gluten Free Sugar Cones","category":"pantry","price":7.82,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"45-cacao-semi-sweet-style-baking-chips-198","name":"45 Cacao Semi-sweet Style Baking Chips","category":"snacks","price":2.65,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"honeysuckle-fabric-softener-648","name":"Honeysuckle Fabric Softener","category":"household","price":10.7,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bread-machine-yeast","name":"Bread Machine Yeast","category":"bakery","price":3.19,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"7-spice-cauliflower-bread-crumbs","name":"7 Spice Cauliflower Bread Crumbs","category":"bakery","price":2.72,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pizza-dough-almond-flour-mix","name":"Pizza Dough Almond Flour Mix","category":"frozen","price":8.19,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"honey-raw-creamed","name":"Honey Raw Creamed","category":"personal-care","price":8.71,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"english-toffee-sweet-drops","name":"English Toffee Sweet Drops","category":"snacks","price":5.63,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cultured-buttermilk-powder","name":"Cultured Buttermilk Powder","category":"dairy-eggs","price":6.76,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"carnation-vitamin-d-added-evaporated-milk-60","name":"Carnation Vitamin D Added Evaporated Milk","category":"dairy-eggs","price":3.92,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"zatarain-s-seasoned-fish-fri-breading-mix","name":"Zatarain's Seasoned Fish Fri Breading Mix","category":"bakery","price":6.06,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"martha-white-blueberry-cheesecake-muffin-mix","name":"Martha White Blueberry Cheesecake Muffin Mix","category":"bakery","price":6.34,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jm-smucker-martha-white-cornbread","name":"Jm Smucker Martha White Cornbread","category":"bakery","price":5.44,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"martha-white-strawberry-muffin-mix","name":"Martha White Strawberry Muffin Mix","category":"bakery","price":3.22,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"martha-white-blueberry-muffin-mix","name":"Martha White Blueberry Muffin Mix","category":"bakery","price":3.41,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"martha-white-banana-nut-muffin-mix","name":"Martha White Banana Nut Muffin Mix","category":"bakery","price":5.35,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"fleischmann-s-classic-bread-machine-yeast","name":"Fleischmann's Classic Bread Machine Yeast","category":"bakery","price":4,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"4c-seasoned-bread-crumbs-156","name":"4c Seasoned Bread Crumbs","category":"bakery","price":3.03,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"4c-plain-bread-crumbs-660","name":"4c Plain Bread Crumbs","category":"bakery","price":5.18,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-creamy-supreme-frosting","name":"Pillsbury Creamy Supreme Frosting","category":"personal-care","price":5.45,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":false,"onSale":true,"salePrice":4.46,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-banana-quick-bread-muffin-mix","name":"Pillsbury Banana Quick Bread & Muffin Mix","category":"bakery","price":5.18,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"borden-eagle-brand-sweetened-condensed-milk","name":"Borden Eagle Brand Sweetened Condensed Milk","category":"dairy-eggs","price":2.66,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"eagle-brand-borden-sweetened-condensed-milk","name":"Eagle Brand Borden Sweetened Condensed Milk","category":"dairy-eggs","price":4.46,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-blueberry-muffin-mix","name":"Betty Crocker Blueberry Muffin Mix","category":"bakery","price":4.64,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"reese-s-peanut-butter-chips","name":"Reese's Peanut Butter Chips","category":"snacks","price":4.8,"unit":"pack","brand":"Bag","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"swans-down-enriched-573","name":"Swans Down Enriched","category":"household","price":13.78,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-italian-style-bread-crumbs","name":"Great Value Italian Style Bread Crumbs","category":"bakery","price":2.78,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.12,"season":["all"],"substitutes":[]},
  {"id":"great-value-plain-bread-crumbs","name":"Great Value Plain Bread Crumbs","category":"bakery","price":3.45,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"saco-buttermilk-12oz","name":"Saco Buttermilk 12oz","category":"dairy-eggs","price":5.45,"unit":"pack","brand":"Saco","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Extra Virgin Olive Oil"]},
  {"id":"progresso-panko-plain-crispy-bread-crumbs","name":"Progresso Panko Plain Crispy Bread Crumbs","category":"snacks","price":5.87,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"progresso","name":"Progresso","category":"bakery","price":5.84,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"progresso-plain-bread-crumbs","name":"Progresso Plain Bread Crumbs","category":"bakery","price":3.94,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"progresso-italian-style-bread-crumbs","name":"Progresso Italian Style Bread Crumbs","category":"bakery","price":4.29,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"house-autry-seafood-seasoned-breading-mix","name":"House-autry Seafood Seasoned Breading Mix","category":"bakery","price":4.83,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"house-autry-chicken-seasoned-breading-mix","name":"House-autry Chicken Seasoned Breading Mix","category":"bakery","price":3.48,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"house-autry-medium-hot-seasoned-breading-mix","name":"House-autry Medium Hot Seasoned Breading Mix","category":"bakery","price":2.81,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-instant-nonfat-dry-milk-152","name":"Great Value Instant Nonfat Dry Milk","category":"dairy-eggs","price":5.32,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pizza-buddy-pizza-dough","name":"Pizza Buddy Pizza Dough","category":"frozen","price":7.81,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"zatarain-s-crispy-southern-fish-fri","name":"Zatarain's Crispy Southern Fish Fri","category":"snacks","price":2.06,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-evaporated-milk","name":"Great Value Evaporated Milk","category":"dairy-eggs","price":3.34,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-fat-free-evaporated-milk-12-oz","name":"Great Value Fat Free Evaporated Milk 12 Oz","category":"dairy-eggs","price":3.67,"unit":"pack","brand":"Great Value","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-sweetened-condensed-milk","name":"Great Value Sweetened Condensed Milk","category":"dairy-eggs","price":4.67,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-fat-free-sweetened-condensed-milk","name":"Great Value Fat Free Sweetened Condensed Milk","category":"dairy-eggs","price":4.79,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"imperial-dragon-coconut-milk","name":"Imperial Dragon Coconut Milk","category":"dairy-eggs","price":2.87,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"la-lechera-sweetened-condensed-milk-14-oz-can","name":"La Lechera Sweetened Condensed Milk 14 Oz Can","category":"dairy-eggs","price":6.28,"unit":"can","brand":"La Lechera","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.3,"season":["all"],"substitutes":[]},
  {"id":"carnation-evaporated-lowfat-2-milk-12-fl-oz","name":"Carnation Evaporated Lowfat 2 Milk 12 Fl Oz","category":"dairy-eggs","price":5.65,"unit":"bottle","brand":"Carnation","size":"16 fl oz","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"keebler-ready-crust-pie-crust-graham-6-oz","name":"Keebler Ready Crust Pie Crust Graham 6 Oz","category":"meat-seafood","price":12.56,"unit":"pack","brand":"Keebler","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"keebler-ready-crust-mini-graham-pie-crusts","name":"Keebler Ready Crust Mini Graham Pie Crusts","category":"meat-seafood","price":8.6,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pepe-s-all-natural-pizza-dough","name":"Pepe's All Natural Pizza Dough","category":"frozen","price":7.91,"unit":"pack","brand":"Pepe's Bakery","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"meyenberg-evaporated-goat-milk","name":"Meyenberg Evaporated Goat Milk","category":"dairy-eggs","price":2.47,"unit":"pack","brand":"Meyenberg","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.04,"season":["all"],"substitutes":["Almond Milk"]},
  {"id":"louisiana-fish-fry-chicken-fry-mix","name":"Louisiana Fish Fry Chicken Fry Mix","category":"meat-seafood","price":14.18,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dynasty-panko-japanese-style-bread-crumbs","name":"Dynasty Panko Japanese Style Bread Crumbs","category":"bakery","price":3.96,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kikkoman-panko-bread-crumbs","name":"Kikkoman Panko Bread Crumbs","category":"bakery","price":5.44,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"de-la-rosa-peanuts-confection","name":"De La Rosa Peanuts Confection","category":"snacks","price":5.94,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chocomaker-vanilla-flavored-candy-wafers","name":"Chocomaker Vanilla Flavored Candy Wafers","category":"snacks","price":4.69,"unit":"can","brand":"Chocomaker","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.73,"season":["all"],"substitutes":[]},
  {"id":"bake-believe-keto-friendly-white-baking-chips","name":"Bake Believe Keto-friendly White Baking Chips","category":"snacks","price":4.79,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-all-purpose-unbleached-flour-366","name":"Great Value All-purpose Unbleached Flour","category":"household","price":8.06,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pepperidge-farm-puff-pastry-shells-frozen","name":"Pepperidge Farm Puff Pastry Shells Frozen","category":"frozen","price":7.45,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-white-candy-melts-candy","name":"Wilton White Candy Melts Candy","category":"snacks","price":2.29,"unit":"can","brand":"Baking","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"iberia-coconut-milk","name":"Iberia Coconut Milk","category":"dairy-eggs","price":4.4,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"thai-kitchen-gluten-free-lite-coconut-milk","name":"Thai Kitchen Gluten Free Lite Coconut Milk","category":"dairy-eggs","price":6.15,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.53,"season":["all"],"substitutes":[]},
  {"id":"great-value-white-melting-wafers","name":"Great Value White Melting Wafers","category":"snacks","price":4.64,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"crema-media-50-less-fat-lite-table-cream","name":"Crema Media 50 Less Fat Lite Table Cream","category":"personal-care","price":6.8,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"a-taste-of-thai-unsweetened-coconut-milk","name":"A Taste Of Thai Unsweetened Coconut Milk","category":"dairy-eggs","price":5.27,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"meyenberg-whole-powdered-goat-milk-vitamin-d","name":"Meyenberg Whole Powdered Goat Milk Vitamin D","category":"dairy-eggs","price":5.35,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Almond Milk"]},
  {"id":"goya-coconut-milk-cream-of-coconut","name":"Goya Coconut Milk Cream Of Coconut","category":"personal-care","price":3.73,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"mccormick-golden-dipt-deluxe-hush-puppy-mix","name":"Mccormick Golden Dipt Deluxe Hush Puppy Mix","category":"pet","price":6.62,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-baking-regular-pizza-crust-mix","name":"Pillsbury Baking Regular Pizza Crust Mix","category":"frozen","price":5.73,"unit":"pack","brand":"Pillsbury","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.23,"season":["all"],"substitutes":[]},
  {"id":"great-value-chicken-seasoned-coating-mix","name":"Great Value Chicken Seasoned Coating Mix","category":"meat-seafood","price":5.58,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-pork-seasoned-coating-mix","name":"Great Value Pork Seasoned Coating Mix","category":"meat-seafood","price":8.22,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":6.83,"season":["all"],"substitutes":[]},
  {"id":"great-value-extra-crispy-seasoned-coating-mix","name":"Great Value Extra Crispy Seasoned Coating Mix","category":"snacks","price":3.94,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-butterscotch-baking-chips","name":"Great Value Butterscotch Baking Chips","category":"snacks","price":3.75,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bake-believe","name":"Bake Believe","category":"snacks","price":3.26,"unit":"pack","brand":"9 Oz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"betty-crocker-cookies-and-cream-no-bake-bites","name":"Betty Crocker Cookies And Cream No-bake Bites","category":"personal-care","price":10.71,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-edible-glitter-gel-icing","name":"Great Value Edible Glitter Gel Icing","category":"pet","price":10.44,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"baileys-original-irish-cream-baking-chips","name":"Baileys Original Irish Cream Baking Chips","category":"personal-care","price":12.7,"unit":"pack","brand":"Baking","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"garlic-frozen-bread","name":"Garlic Frozen Bread","category":"frozen","price":5.63,"unit":"pack","brand":"Market Pantry","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"garlic-frozen-texas-toast","name":"Garlic Frozen Texas Toast","category":"frozen","price":5.23,"unit":"pack","brand":"Market Pantry","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"udi-s-gluten-free-frozen-hamburger-buns","name":"Udi's Gluten Free Frozen Hamburger Buns","category":"frozen","price":2.53,"unit":"pack","brand":"Udi's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"athens-vegan-frozen-fillo-dough","name":"Athens Vegan Frozen Fillo Dough","category":"frozen","price":7.18,"unit":"pack","brand":"Athens","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"goya-discos-frozen-pastry-dough","name":"Goya Discos Frozen Pastry Dough","category":"frozen","price":5.74,"unit":"pack","brand":"Goya","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"goya-frozen-disco-grandes-para-empanadas","name":"Goya Frozen Disco Grandes Para Empanadas","category":"frozen","price":3.81,"unit":"pack","brand":"Goya","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"new-york-bakery-hand-tied-frozen-garlic-knots","name":"New York Bakery Hand Tied Frozen Garlic Knots","category":"frozen","price":2.85,"unit":"pack","brand":"New York Bakery","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"new-york-bakery-frozen-parmesan-garlic-bread","name":"New York Bakery Frozen Parmesan Garlic Bread","category":"frozen","price":3.2,"unit":"pack","brand":"New York Bakery","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"joseph-campione-frozen-garlic-loaf-bread","name":"Joseph Campione Frozen Garlic Loaf Bread","category":"frozen","price":3.39,"unit":"loaf","brand":"Joseph Campione","size":"24 oz loaf","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"el-sembrador-frozen-discos-585","name":"El Sembrador Frozen Discos","category":"frozen","price":4.44,"unit":"pack","brand":"El Sembrador","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"udi-s-gluten-free-frozen-white-bread","name":"Udi's Gluten Free Frozen White Bread","category":"frozen","price":4.31,"unit":"pack","brand":"Udi's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"udi-s-gluten-free-frozen-whole-grain-bread","name":"Udi's Gluten Free Frozen Whole Grain Bread","category":"frozen","price":4.92,"unit":"pack","brand":"Udi's","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.12,"season":["all"],"substitutes":[]},
  {"id":"frozen-puff-pastry-sheets","name":"Frozen Puff Pastry Sheets","category":"frozen","price":5.8,"unit":"pack","brand":"Favorite Day","size":"standard pack","isOrganic":false,"inStock":false,"onSale":true,"salePrice":4.52,"season":["all"],"substitutes":[]},
  {"id":"organic-hot-dog-buns-whole-wheat","name":"Organic Hot Dog Buns Whole Wheat","category":"pet","price":21.34,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":true,"inStock":true,"onSale":true,"salePrice":16.65,"season":["all"],"substitutes":[]},
  {"id":"three-cheese-pizza-shell","name":"Three Cheese Pizza Shell","category":"frozen","price":6.43,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.57,"season":["all"],"substitutes":[]},
  {"id":"100-whole-wheat-stone-baked-pizza-crusts","name":"100 Whole Wheat Stone Baked Pizza Crusts","category":"frozen","price":4.43,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-pizza-dough","name":"Organic Pizza Dough","category":"frozen","price":3.3,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-vanilla-waffle","name":"Organic Vanilla Waffle","category":"frozen","price":7.58,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pizza-dough","name":"Pizza Dough","category":"frozen","price":5.16,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pizza-dough-ball","name":"Pizza Dough Ball","category":"frozen","price":6.19,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chocolate-chip-pb-creamie","name":"Chocolate Chip Pb Creamie","category":"personal-care","price":12.65,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cream-cheese-brioche","name":"Cream Cheese Brioche","category":"personal-care","price":9.39,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-original-french-toast-sticks","name":"Great Value Original French Toast Sticks","category":"frozen","price":4.73,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pepperidge-farm-frozen-garlic-garlic-bread","name":"Pepperidge Farm Frozen Garlic Garlic Bread","category":"frozen","price":5.09,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"pepperidge-farm-frozen-5-cheese-garlic-bread","name":"Pepperidge Farm Frozen 5 Cheese Garlic Bread","category":"frozen","price":2.51,"unit":"pack","brand":"Bread","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-garlic-bread-sticks","name":"Great Value Garlic Bread Sticks","category":"frozen","price":8.18,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"eggo-thick-and-fluffy-frozen-french-toast","name":"Eggo Thick And Fluffy Frozen French Toast","category":"frozen","price":3.74,"unit":"pack","brand":"12 6oz Box 6 Slices","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.63,"season":["all"],"substitutes":[]},
  {"id":"pillsbury-strawberry-frozen-toaster-strudel","name":"Pillsbury Strawberry Frozen Toaster Strudel","category":"frozen","price":8.24,"unit":"pack","brand":"Pillsbury","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kellogg-s-eggo-frozen-homestyle-waffles-894","name":"Kellogg's Eggo Frozen Homestyle Waffles","category":"frozen","price":6.38,"unit":"pack","brand":"Eggo","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kellogg-s-eggo-blueberry-frozen-waffles","name":"Kellogg's Eggo Blueberry Frozen Waffles","category":"frozen","price":2.76,"unit":"pack","brand":"Eggo","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.34,"season":["all"],"substitutes":[]},
  {"id":"kellogg-s-eggo-buttermilk-frozen-waffles-268","name":"Kellogg's Eggo Buttermilk Frozen Waffles","category":"frozen","price":5.62,"unit":"pack","brand":"Eggo","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kellogg-s-eggo-frozen-mini-pancakes","name":"Kellogg's Eggo Frozen Mini Pancakes","category":"frozen","price":6.32,"unit":"pack","brand":"Eggo","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.06,"season":["all"],"substitutes":[]},
  {"id":"jimmy-dean-frozen-bacon-breakfast-bowl","name":"Jimmy Dean Frozen Bacon Breakfast Bowl","category":"frozen","price":7.87,"unit":"pack","brand":"Jimmy Dean","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jimmy-dean-frozen-meat-lovers-breakfast-bowl","name":"Jimmy Dean Frozen Meat Lovers Breakfast Bowl","category":"frozen","price":3.23,"unit":"pack","brand":"Jimmy Dean","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"de-wafelbakkers-frozen-buttermilk-pancaes","name":"De Wafelbakkers Frozen Buttermilk Pancaes","category":"frozen","price":4.76,"unit":"lb","brand":"De Wafelbakkers","size":"1 lb","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"annie-s-organic-pancake-waffle-mix","name":"Annie's Organic Pancake & Waffle Mix","category":"frozen","price":7.98,"unit":"pack","brand":"Annie's","size":"standard pack","isOrganic":true,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"kodiak-cakes-frozen-power-waffles-cinnamon","name":"Kodiak Cakes Frozen Power Waffles Cinnamon","category":"frozen","price":8.16,"unit":"pack","brand":"Kodiak Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"birch-benders-gluten-free-keto-frozen-waffles","name":"Birch Benders Gluten Free Keto Frozen Waffles","category":"frozen","price":6.52,"unit":"pack","brand":"Birch Benders","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jimmy-dean-skillets-meat-lovers","name":"Jimmy Dean Skillets Meat Lovers","category":"meat-seafood","price":11.44,"unit":"pack","brand":"Jimmy Dean","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jimmy-dean-skillets-sausage","name":"Jimmy Dean Skillets Sausage","category":"meat-seafood","price":13.14,"unit":"pack","brand":"Jimmy Dean","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chicken-apple-breakfast-sausage","name":"Chicken & Apple Breakfast Sausage","category":"meat-seafood","price":7.25,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chicken-apple-breakfast-sausage-patties","name":"Chicken & Apple Breakfast Sausage Patties","category":"meat-seafood","price":9.43,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chicken-maple-breakfast-sausage","name":"Chicken & Maple Breakfast Sausage","category":"meat-seafood","price":7.58,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.87,"season":["all"],"substitutes":[]},
  {"id":"chicken-maple-breakfast-sausage-patties","name":"Chicken & Maple Breakfast Sausage Patties","category":"meat-seafood","price":11.89,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chicken-sage-breakfast-sausage","name":"Chicken & Sage Breakfast Sausage","category":"meat-seafood","price":6.36,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"no-sugar-chicken-herb-breakfast-sausage","name":"No Sugar Chicken & Herb Breakfast Sausage","category":"meat-seafood","price":5.79,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":4.15,"season":["all"],"substitutes":[]},
  {"id":"no-sugar-original-pork-breakfast-sausage","name":"No Sugar Original Pork Breakfast Sausage","category":"meat-seafood","price":5.83,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-chicken-apple-breakfast-sausage","name":"Organic Chicken & Apple Breakfast Sausage","category":"meat-seafood","price":11.31,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"organic-chicken-maple-breakfast-sausage","name":"Organic Chicken & Maple Breakfast Sausage","category":"meat-seafood","price":18.31,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":true,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"savory-turkey-breakfast-sausage","name":"Savory Turkey Breakfast Sausage","category":"meat-seafood","price":9.39,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jimmy-dean-ham","name":"Jimmy Dean Ham","category":"meat-seafood","price":13.21,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"canadian-bacon","name":"Canadian Bacon","category":"meat-seafood","price":16.65,"unit":"can","brand":"Breakfast","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-meat-lovers-breakfast-bowl","name":"Great Value Meat Lovers Breakfast Bowl","category":"meat-seafood","price":12.27,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"meat-lovers-breakfast-bowl","name":"Meat Lovers Breakfast Bowl","category":"meat-seafood","price":11.28,"unit":"pack","brand":"Jimmy Dean","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"jimmy-dean-delights-bacon","name":"Jimmy Dean Delights Bacon","category":"meat-seafood","price":5.81,"unit":"pack","brand":"4 Count","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-sausage-gravy-breakfast-bowl","name":"Great Value Sausage & Gravy Breakfast Bowl","category":"meat-seafood","price":12.14,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-bacon-breakfast-bowl","name":"Great Value Bacon Breakfast Bowl","category":"meat-seafood","price":7.54,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-sausage-breakfast-bowl","name":"Great Value Sausage Breakfast Bowl","category":"meat-seafood","price":7.38,"unit":"pack","brand":"Breakfast","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.52,"season":["all"],"substitutes":[]},
  {"id":"jimmy-dean-delights-ham","name":"Jimmy Dean Delights Ham","category":"meat-seafood","price":13.01,"unit":"pack","brand":"4 Count","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"keebler-ready-crust-graham-pie-crust","name":"Keebler Ready Crust Graham Pie Crust","category":"meat-seafood","price":7.53,"unit":"pack","brand":"Keebler","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"drake-s-devil-dog-s","name":"Drake's Devil Dog's","category":"pet","price":17.77,"unit":"pack","brand":"Drake","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"little-debbie-devil-cream-cakes","name":"Little Debbie Devil Cream Cakes","category":"personal-care","price":12.89,"unit":"pack","brand":"Little Debbie","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"just-desserts-cookies-cream-cupcake","name":"Just Desserts Cookies & Cream Cupcake","category":"personal-care","price":9.11,"unit":"pack","brand":"Just Desserts","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"berry-chantilly-cake-ice-cream","name":"Berry Chantilly Cake Ice Cream","category":"personal-care","price":12,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"cookies-cream-ice-cream-cake","name":"Cookies & Cream Ice Cream Cake","category":"personal-care","price":7.53,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"for-the-love-of-chocolate-ice-cream-cake","name":"For The Love Of Chocolate Ice Cream Cake","category":"personal-care","price":12.2,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":9.23,"season":["summer"],"substitutes":[]},
  {"id":"chocolate-molten-cake-ice-cream","name":"Chocolate Molten Cake Ice Cream","category":"personal-care","price":12.17,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"gooey-butter-cake-ice-cream-257","name":"Gooey Butter Cake Ice Cream","category":"personal-care","price":4.34,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":3.54,"season":["summer"],"substitutes":[]},
  {"id":"graham-style-pie-crust","name":"Graham Style Pie Crust","category":"meat-seafood","price":10.82,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"banana-cream-tart","name":"Banana Cream Tart","category":"personal-care","price":3.82,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chocolate-cream-pie-6-inch","name":"Chocolate Cream Pie 6 Inch","category":"personal-care","price":6.17,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":false,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"cupcake-carrot-cream-cheese-836","name":"Cupcake Carrot Cream Cheese","category":"personal-care","price":7.56,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"almond-cream-cake-slice","name":"Almond Cream Cake Slice","category":"personal-care","price":11.57,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"chocolate-cream-pie-slice","name":"Chocolate Cream Pie Slice","category":"personal-care","price":7.74,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"sponge-cake-dessert-cups","name":"Sponge Cake Dessert Cups","category":"household","price":9.16,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":6.73,"season":["all"],"substitutes":[]},
  {"id":"strawberry-and-cream-cake-slice","name":"Strawberry And Cream Cake Slice","category":"personal-care","price":12.1,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"great-value-graham-9-pie-crust","name":"Great Value Graham 9 Pie Crust","category":"meat-seafood","price":14.96,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"friendlys-ice-cream-strawberry-krunch-cake","name":"Friendlys Ice Cream Strawberry Krunch Cake","category":"personal-care","price":6.03,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"keebler-ready-crust-10-inch-graham-pie-crust","name":"Keebler Ready Crust 10 Inch Graham Pie Crust","category":"meat-seafood","price":9.45,"unit":"pack","brand":"Cakes","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"blue-glitter-3-candle","name":"Blue Glitter 3 Candle","category":"pet","price":10.99,"unit":"can","brand":"Bakery Crafts","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"bakery-crafts-glitter-dot-and-stripe-candles","name":"Bakery Crafts Glitter-dot And Stripe Candles","category":"pet","price":10.01,"unit":"can","brand":"Bakery Crafts","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"glitter-numeral-candle-purple","name":"Glitter Numeral Candle Purple","category":"pet","price":7.29,"unit":"can","brand":"Bakery Crafts","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"glitter-numeral-candle-blue","name":"Glitter Numeral Candle Blue","category":"pet","price":4.33,"unit":"can","brand":"Bakery Crafts","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"lime-glitter-1-candle","name":"Lime Glitter 1 Candle","category":"pet","price":9.64,"unit":"can","brand":"Bakery Crafts","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":["Lemons"]},
  {"id":"blue-glitter-2-candle","name":"Blue Glitter 2 Candle","category":"pet","price":4.14,"unit":"can","brand":"Bakery Crafts","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"blue-glitter-4-candle","name":"Blue Glitter 4 Candle","category":"pet","price":11.95,"unit":"can","brand":"Bakery Crafts","size":"12 oz can","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"heinz-hot-dog-relish","name":"Heinz Hot Dog Relish","category":"pet","price":17.57,"unit":"pack","brand":"Heinz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":12.8,"season":["all"],"substitutes":[]},
  {"id":"catalina-crunch-cinnamon-toast-keto-cereal","name":"Catalina Crunch Cinnamon Toast Keto Cereal","category":"pet","price":13.24,"unit":"pack","brand":"Catalina Crunch","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"catalina-crunch-dark-chocolate-keto-cereal","name":"Catalina Crunch Dark Chocolate Keto Cereal","category":"pet","price":18.59,"unit":"pack","brand":"Catalina Crunch","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"dark-chocolate-catalina-crunch-cereal","name":"Dark Chocolate Catalina Crunch Cereal","category":"pet","price":8.66,"unit":"pack","brand":"Cereal","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":6.98,"season":["all"],"substitutes":[]},
  {"id":"catamount-cheddar","name":"Catamount Cheddar","category":"pet","price":13.55,"unit":"pack","brand":"Cabot Creamery","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"president-foil-wrapped-brie-cheese-wedge-961","name":"President Foil Wrapped Brie Cheese Wedge","category":"household","price":6.02,"unit":"pack","brand":"Cheese","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"ambriola-locatelli-grated-cheese","name":"Ambriola Locatelli Grated Cheese","category":"pet","price":13.08,"unit":"pack","brand":"Cheese","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"black-cat-classic-espresso","name":"Black Cat Classic Espresso","category":"pet","price":8.49,"unit":"pack","brand":"Coffee-beans-wf","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"stella-d-oro-cookies-584","name":"Stella D'oro Cookies","category":"household","price":12.51,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"grass-fed-pure-irish-unsalted-butter-foil-24","name":"Grass-fed Pure Irish Unsalted Butter Foil","category":"household","price":8.47,"unit":"pack","brand":"Culinary-ingredients","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"grass-fed-pure-irish-salted-butter-foil-659","name":"Grass-fed Pure Irish Salted Butter Foil","category":"household","price":4.61,"unit":"pack","brand":"Culinary-ingredients","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"delicate-avocado-oil-913","name":"Delicate Avocado Oil","category":"pet","price":6.56,"unit":"pack","brand":"Culinary-ingredients","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-edible-gold-glitter-spray","name":"Wilton Edible Gold Glitter Spray","category":"pet","price":8.36,"unit":"pack","brand":"Culinary-ingredients","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"number-3-foil-balloon-cake-topper-with-tassel-249","name":"Number 3 Foil Balloon Cake Topper With Tassel","category":"household","price":4.22,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"number-1-foil-balloon-cake-topper-with-tassel-597","name":"Number 1 Foil Balloon Cake Topper With Tassel","category":"household","price":11.83,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["all"],"substitutes":[]},
  {"id":"wilton-foil-cupcake-liners-813","name":"Wilton Foil Cupcake Liners","category":"household","price":3.55,"unit":"pack","brand":"Walmart","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":2.77,"season":["all"],"substitutes":[]},
  {"id":"yoplait-go-gurt-515","name":"Yoplait Go-gurt","category":"household","price":11.4,"unit":"pack","brand":"32 Oz","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":5.52,"season":["all"],"substitutes":[]},
  {"id":"popsicle-spongebob-squarepants-frozen-pop-ups-766","name":"Popsicle Spongebob Squarepants Frozen Pop Ups","category":"household","price":14.77,"unit":"pack","brand":"Popsicle","size":"standard pack","isOrganic":false,"inStock":true,"onSale":false,"salePrice":null,"season":["summer"],"substitutes":[]},
  {"id":"popsicle-pop-ups-spongebob-squarepants-9-ct-717","name":"Popsicle Pop Ups Spongebob Squarepants 9 Ct","category":"household","price":8.19,"unit":"pack","brand":"Popsicle","size":"standard pack","isOrganic":false,"inStock":true,"onSale":true,"salePrice":6.39,"season":["summer"],"substitutes":[]},
];

/* ---------------------------------------------------------------------------
 * CROSS-LANGUAGE ALIASES — regional terms mapped to canonical English terms
 * Keys are pre-normalized (lowercase, accents stripped). Devanagari is kept.
 * -------------------------------------------------------------------------*/

export const IRREGULAR_PLURALS = {
  mangoes: 'mango',
  mangos: 'mango',
  tomatoes: 'tomato',
  potatoes: 'potato',
  berries: 'berry',
  strawberries: 'strawberry',
  blueberries: 'blueberry',
  raspberries: 'raspberry',
  blackberries: 'blackberry',
  cranberries: 'cranberry',
  cherries: 'cherry',
  cookies: 'cookie',
  loaves: 'loaf',
  halves: 'half',
  calves: 'calf',
  leaves: 'leaf',
  radishes: 'radish',
  bunches: 'bunch',
  sandwiches: 'sandwich',
  peaches: 'peach',
  boxes: 'box',
  pouches: 'pouch',
  dishes: 'dish',
  glasses: 'glass',
};

export const SINGULAR_EXCEPTIONS = new Set([
  'hummus',
  'asparagus',
  'citrus',
  'couscous',
  'hibiscus',
  'lotus',
  'grass',
  'hass',
  'boneless',
  'flourless',
  'guiltless',
  'delicious',
  'radius',
  'walrus',
  'status',
  'plus',
  'minus',
  'canvas',
  'basis',
  'crisis',
  'tapas',
]);

export function singular(word, lang = 'en') {
  const n = normalize(word);
  if (!n || n.length <= 2) return n;

  if (SINGULAR_EXCEPTIONS.has(n)) return n;
  if (IRREGULAR_PLURALS[n]) return IRREGULAR_PLURALS[n];

  // Spanish plural rules (-ces -> z, -es, -s)
  if (lang === 'es') {
    if (n.endsWith('ces') && n.length > 4) return `${n.slice(0, -3)}z`;
    if (n.endsWith('es') && n.length > 4) return n.slice(0, -2);
    if (n.endsWith('s') && !n.endsWith('ss') && n.length > 3) return n.slice(0, -1);
    return n;
  }

  // French plural rules (-aux -> al, -eaux -> eau, -s -> drop)
  if (lang === 'fr') {
    if (n.endsWith('aux') && n.length > 4) return `${n.slice(0, -3)}al`;
    if (n.endsWith('eaux') && n.length > 5) return n.slice(0, -1);
    if (n.endsWith('s') && !n.endsWith('ss') && n.length > 3) return n.slice(0, -1);
    return n;
  }

  // German plural rules (-en, -n, -s)
  if (lang === 'de') {
    if (n.endsWith('innen') && n.length > 6) return n.slice(0, -3);
    if (n.endsWith('en') && n.length > 4) return n.slice(0, -2);
    if (n.endsWith('n') && n.length > 4 && /[aeiou]n$/.test(n)) return n.slice(0, -1);
    if (n.endsWith('s') && n.length > 3) return n.slice(0, -1);
    return n;
  }

  // English general suffix rules
  if (n.endsWith('ies') && n.length > 4) return `${n.slice(0, -3)}y`;
  if (n.endsWith('ves') && n.length > 4) return `${n.slice(0, -3)}f`;
  if (/(?:ches|shes|sses|axes|oxes|ixes)$/.test(n) && n.length > 4) return n.slice(0, -2);
  if (n.endsWith('oes') && n.length > 4) return n.slice(0, -2);
  if (n.endsWith('s') && !n.endsWith('ss') && !n.endsWith('us') && !n.endsWith('is') && n.length > 3) {
    return n.slice(0, -1);
  }

  return n;
}

const ALIASES = {
  en: {
    veggies: 'vegetables', veggie: 'vegetables', greens: 'spinach',
    soda: 'soft drink', pop: 'soft drink', cola: 'soda',
    spuds: 'potatoes', taters: 'potatoes', oj: 'orange juice',
    pb: 'peanut butter', evoo: 'olive oil',
  },
  es: {
    leche: 'milk', pan: 'bread', huevos: 'eggs', huevo: 'eggs', manzanas: 'apples', manzana: 'apples',
    arroz: 'rice', queso: 'cheese', pollo: 'chicken', mantequilla: 'butter', yogur: 'yogurt',
    cafe: 'coffee', cebolla: 'onion', cebollas: 'onion', tomate: 'tomatoes', tomates: 'tomatoes',
    fresas: 'strawberries', jugo: 'juice', agua: 'water', chocolate: 'chocolate', galletas: 'cookies',
    pasta: 'pasta', salmon: 'salmon', helado: 'ice cream', aceite: 'olive oil', miel: 'honey',
    te: 'tea', avena: 'oat milk', tocino: 'bacon', camarones: 'shrimp', espinaca: 'spinach',
    zanahorias: 'carrots', limones: 'lemons', aguacate: 'avocados', aguacates: 'avocados',
    naranja: 'oranges', naranjas: 'oranges', pina: 'pineapple', pinas: 'pineapple', 'piña': 'pineapple',
    mango: 'mango', mangos: 'mango',
    ajo: 'garlic', papas: 'potatoes', papa: 'potatoes', uvas: 'grapes', pepino: 'cucumber',
    azucar: 'sugar', sopa: 'soup', cereal: 'cereal', jabon: 'soap', papitas: 'chips',
    champinones: 'mushrooms', atun: 'tuna',
  },
  fr: {
    lait: 'milk', pain: 'bread', oeufs: 'eggs', oeuf: 'eggs', pommes: 'apples', pomme: 'apples',
    riz: 'rice', fromage: 'cheese', poulet: 'chicken', beurre: 'butter', yaourt: 'yogurt',
    cafe: 'coffee', oignon: 'onion', oignons: 'onion', tomates: 'tomatoes', tomate: 'tomatoes',
    fraises: 'strawberries', jus: 'juice', eau: 'water', chocolat: 'chocolate', biscuits: 'cookies',
    pates: 'pasta', saumon: 'salmon', glace: 'ice cream', huile: 'olive oil', miel: 'honey',
    the: 'tea', 'lait davoine': 'oat milk', bacon: 'bacon', crevettes: 'shrimp', epinards: 'spinach',
    carottes: 'carrots', citrons: 'lemons', avocat: 'avocados', avocats: 'avocados',
    ananas: 'pineapple', mangue: 'mango',
    ail: 'garlic', 'pommes de terre': 'potatoes', raisins: 'grapes', concombre: 'cucumber',
    sucre: 'sugar', soupe: 'soup', cereales: 'cereal', savon: 'soap', chips: 'chips',
    champignons: 'mushrooms', thon: 'tuna',
  },
  hi: {
    doodh: 'milk', dudh: 'milk', 'दूध': 'milk', pyaz: 'onion', pyaaz: 'onion', 'प्याज़': 'onion', 'प्याज': 'onion',
    seb: 'apples', 'सेब': 'apples', ande: 'eggs', anda: 'eggs', 'अंडे': 'eggs',
    palak: 'spinach', 'पालक': 'spinach', tamatar: 'tomatoes', 'टमाटर': 'tomatoes',
    chai: 'tea', 'चाय': 'tea', chawal: 'rice', 'चावल': 'rice', makkhan: 'butter', 'मक्खन': 'butter',
    dahi: 'yogurt', 'दही': 'yogurt', atta: 'flour', 'आटा': 'flour', kela: 'bananas', 'केला': 'bananas',
    gajar: 'carrots', 'गाजर': 'carrots', nimbu: 'lemons', 'नींबू': 'lemons',
    'कॉफ़ी': 'coffee', 'चॉकलेट': 'chocolate',
    'शिमला मिर्च': 'capsicum', shimla: 'capsicum',
    santra: 'oranges', santre: 'oranges', 'संतरा': 'oranges', 'संतरे': 'oranges',
    ananas: 'pineapple', 'अनानास': 'pineapple',
    lehsun: 'garlic', 'लहसुन': 'garlic', aaloo: 'potatoes', aloo: 'potatoes', 'आलू': 'potatoes',
    angoor: 'grapes', 'अंगूर': 'grapes', kheera: 'cucumber', 'खीरा': 'cucumber',
    cheeni: 'sugar', 'चीनी': 'sugar', sabun: 'soap', 'साबुन': 'soap',
    aam: 'mango', 'आम': 'mango',
  },
  de: {
    milch: 'milk', brot: 'bread', eier: 'eggs', ei: 'eggs', apfel: 'apples', apfeln: 'apples',
    reis: 'rice', kase: 'cheese', haehnchen: 'chicken', huhn: 'chicken',
    joghurt: 'yogurt', kaffee: 'coffee', zwiebeln: 'onion', zwiebel: 'onion', tomaten: 'tomatoes',
    erdbeeren: 'strawberries', saft: 'juice', wasser: 'water', schokolade: 'chocolate', kekse: 'cookies',
    nudeln: 'pasta', lachs: 'salmon', eis: 'ice cream', oel: 'olive oil', honig: 'honey',
    tee: 'tea', hafermilch: 'oat milk', speck: 'bacon', garnelen: 'shrimp', spinat: 'spinach',
    karotten: 'carrots', zitronen: 'lemons', orangen: 'oranges', orang: 'oranges',
    ananas: 'pineapple', mango: 'mango',
    knoblauch: 'garlic', kartoffeln: 'potatoes', trauben: 'grapes', gurke: 'cucumber',
    zucker: 'sugar', suppe: 'soup', seife: 'soap', chips: 'chips', pilze: 'mushrooms',
    thunfisch: 'tuna',
  },
};

/* ---------------------------------------------------------------------------
 * NLP ENGINE — normalization, verbs, numbers, units, intent parsing
 * -------------------------------------------------------------------------*/

export const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const currentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

const STOPWORDS = new Set([
  'please', 'pls', 'hey', 'yo', 'hi', 'can', 'you', 'could', 'would', 'i', 'me', 'my', 'some',
  'the', 'a', 'an', 'of', 'to', 'for', 'and', 'with', 'in', 'on', 'need', 'want', 'get', 'put',
  'tu', 'te', 'vous', 'du', 'de', 'des', 'le', 'la', 'les', 'un', 'une', 'je', 'veux', 'il',
  'se', 'pan', 'arroz', 'leche',
  'por', 'favor', 'para', 'con', 'los', 'las', 'el', 'unos', 'unas', 'quiero', 'necesito',
  'bitte', 'mal', 'ich', 'will', 'möchte', 'der', 'die', 'das', 'ein', 'eine', 'von', 'zu',
  'und', 'mir', 'einpacken', 'hinzu', 'mochte', 'tee',
  'karo', 'kijiye', 'do', 'mujhe', 'mera', 'meri', 'thoda', 'thodi', 'zara', 'haan', 'ji',
  'bhai', 'yaar', 'wala', 'wali', 'jo', 'bhi', 'ekdum', 'teen', 'pyaz', 'pyaaz',
]);

const ACTION_VERBS = {
  add: {
    en: ['add', 'insert', 'include', 'throw in', 'grab'],
    es: ['añade', 'anade', 'agrega', 'añadir', 'agregar', 'pon', 'suma'],
    fr: ['ajoute', 'ajouter', 'ajoutez', 'mets', 'mettre', 'prends'],
    hi: ['jodo', 'जोड़ो', 'daalo', 'डालो', 'add karo', 'daal do', 'daal do', 'जोड़ दो', 'khareedo', 'kharido', 'लो'],
    de: ['füge', 'fug', 'fügen', 'fugen', 'hinzufügen', 'hinzufugen', 'pack', 'nimm'],
  },
  remove: {
    en: ['remove', 'delete', 'take off', 'drop', 'get rid of'],
    es: ['quita', 'quitar', 'elimina', 'eliminar', 'saca', 'borra'],
    fr: ['retire', 'retirer', 'enleve', 'enlève', 'supprime', 'supprimer'],
    hi: ['hatao', 'हटाओ', 'nikalo', 'निकालो', 'remove karo', 'hata do', 'हटा दो'],
    de: ['entferne', 'entfernen', 'streich', 'streiche', 'lösche', 'losche'],
  },
  search: {
    en: ['search', 'find', 'show', 'look for', 'browse'],
    es: ['busca', 'buscar', 'muestra', 'ensename', 'enseña'],
    fr: ['cherche', 'chercher', 'recherche', 'montre', 'trouve'],
    hi: ['khojo', 'खोजो', 'search karo', 'dikhao', 'दिखाओ', 'dhundo', 'ढूंढो'],
    de: ['suche', 'suchen', 'finde', 'finden', 'zeig', 'zeige'],
  },
  update: {
    en: ['change', 'update', 'set', 'adjust', 'make it'],
    es: ['cambia', 'cambiar', 'ajusta', 'actualiza'],
    fr: ['change', 'modifier', 'modifie', 'passe'],
    hi: ['badlo', 'badal do', 'badal', 'set karo'],
    de: ['andere', 'ändere', 'aendere', 'setze'],
  },
  clear: {
    en: ['clear', 'empty', 'reset'],
    es: ['vaciar', 'vacia', 'vacía', 'limpia'],
    fr: ['vide', 'vider', 'efface', 'effacer'],
    hi: ['khali karo', 'khali', 'saaf karo', 'साफ करो', 'खाली करो'],
    de: ['leere', 'leeren', 'lösche alles', 'losche alles'],
  },
};

const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, dozen: 12, half: 0.5,
  uno: 1, un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8,
  nueve: 9, diez: 10, once: 11, doce: 12, docena: 12,
  deux: 2, trois: 3, quatre: 4, cinq: 5, sept: 7, huit: 8, neuf: 9, dix: 10,
  onze: 11, douze: 12, douzaine: 12,
  ek: 1, do: 2, teen: 3, char: 4, paanch: 5, panch: 5, chhe: 6, saat: 7, aath: 8, nau: 9,
  das: 10, gyarah: 11, barah: 12, darjan: 12,
  'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पाँच': 5, 'पांच': 5, 'छह': 6, 'सात': 7, 'आठ': 8,
  'नौ': 9, 'दस': 10, 'दर्जन': 12,
  eins: 1, zwei: 2, drei: 3, vier: 4, funf: 5, fünf: 5, sechs: 6, sieben: 7, acht: 8,
  neun: 9, zehn: 10, elf: 11, zwolf: 12, zwölf: 12, dutzend: 12,
};

const UNIT_WORDS = [
  { canonical: 'pcs', words: ['pcs', 'pieces', 'piece', 'items', 'item'] },
  { canonical: 'bottle', words: ['bottle', 'bottles', 'botellas', 'botella', 'bouteille', 'bouteilles', 'flasche', 'flaschen', 'बोतल', 'बोतलें'] },
  { canonical: 'carton', words: ['carton', 'cartons', 'brick', 'बॉक्स'] },
  { canonical: 'loaf', words: ['loaf', 'loaves', 'hogaza', 'baguette'] },
  { canonical: 'bag', words: ['bag', 'bags', 'bolsa', 'bolsas', 'sachet', 'tute', 'beutel', 'बैग', 'थैला'] },
  { canonical: 'box', words: ['box', 'boxes', 'caja', 'cajas', 'boite', 'schachtel', 'डब्बा'] },
  { canonical: 'pack', words: ['pack', 'packs', 'package', 'paquete', 'paquetes', 'paquet', 'packung', 'पैकेट'] },
  { canonical: 'jar', words: ['jar', 'jars', 'frasco', 'bocal', 'glas', 'ग्लास'] },
  { canonical: 'can', words: ['can', 'cans', 'lata', 'latas', 'dose', 'dosen', 'डब्बे'] },
  { canonical: 'dozen', words: ['dozen', 'docena', 'douzaine', 'dutzend', 'दर्जन'] },
  { canonical: 'kilo', words: ['kilo', 'kilos', 'kg', 'kilogram', 'kilograms', 'किलो', 'किलोग्राम'] },
  { canonical: 'lb', words: ['lb', 'lbs', 'pound', 'pounds', 'libra', 'libras', 'livre', 'livres', 'pfund'] },
  { canonical: 'liter', words: ['liter', 'liters', 'litre', 'litres', 'litro', 'litros', 'लीटर'] },
  { canonical: 'roll', words: ['roll', 'rolls', 'rollo', 'rouleau', 'rolle'] },
];

const UNIT_LOOKUP = Object.fromEntries(
  UNIT_WORDS.flatMap((group) => group.words.map((word) => [word, group.canonical])),
);

const numberPattern = Object.keys(NUMBER_WORDS)
  .sort((a, b) => b.length - a.length)
  .join('|');
const unitPattern = Object.keys(UNIT_LOOKUP)
  .sort((a, b) => b.length - a.length)
  .join('|');

const qtyUnitRegex = new RegExp(
  `(?<![\\p{L}\\p{N}])(\\d+(?:\\.\\d+)?|${numberPattern})(?:\\s*x\\s*)?\\s*(${unitPattern})?(?![\\p{L}\\p{N}])\\s*(?:(?:of|de|von)\\s+)?`,
  'u',
);

const UNDER_PHRASES = '(?:under|below|less than|max(?:imum)?|cheaper than|menos de|por menos de|maximo|sous|moins de|maximum|unter|billiger als|maximal|se kam|kam me|mein)';

export function parseIntent(rawText, lang = 'en') {
  const text = normalize(rawText);
  const intent = { action: null, itemName: '', quantity: 1, unit: 'pcs', maxPrice: null };
  if (!text) return intent;

  const working = { text };

  // --- action detection (multi-word verbs first, across all known languages) ---
  const langs = [lang, ...Object.keys(ACTION_VERBS.add).filter((l) => l !== lang)];
  outer: for (const action of ['clear', 'search', 'remove', 'update', 'add']) {
    for (const l of langs) {
      for (const verb of ACTION_VERBS[action][l] || []) {
        const v = normalize(verb);
        if (!v) continue;
        const verbRegex = new RegExp(`(?<![\\p{L}\\p{N}])${v.replace(/\s+/g, '\\s+')}(?![\\p{L}\\p{N}])`, 'u');
        if (verbRegex.test(working.text)) {
          intent.action = action.toUpperCase();
          working.text = working.text.replace(verbRegex, ' ');
          break outer;
        }
      }
    }
  }

  // --- price constraint: "under $5", "menos de 5", "5 se kam" ---
  const underRegex = new RegExp(`${UNDER_PHRASES}\\s*\\$?\\s*(\\d+(?:\\.\\d+)?)`, 'u');
  const underMatch = working.text.match(underRegex);
  if (underMatch) {
    intent.maxPrice = parseFloat(underMatch[1]);
    working.text = working.text.replace(underMatch[0], ' ');
  } else {
    const priceAfter = working.text.match(/\$\s*(\d+(?:\.\d+)?)(?:\s*(?:or less|dollars?)?\s*(?:se kam|under))?/u);
    if (priceAfter && /(?:se kam|or less|under)/.test(priceAfter[0])) {
      intent.maxPrice = parseFloat(priceAfter[1]);
      working.text = working.text.replace(priceAfter[0], ' ');
    } else if (priceAfter && intent.action === 'search') {
      intent.maxPrice = parseFloat(priceAfter[1]);
      working.text = working.text.replace(priceAfter[0], ' ');
    }
  }

  // --- quantity + unit: "2 bottles of", "three", "teen kilo" ---
  const qtyMatch = working.text.match(qtyUnitRegex);
  if (qtyMatch) {
    const qtyToken = qtyMatch[1];
    intent.quantity = Number(qtyToken) || NUMBER_WORDS[qtyToken] || 1;
    if (qtyMatch[2]) intent.unit = UNIT_LOOKUP[qtyMatch[2]] || 'pcs';
    working.text = working.text.replace(qtyMatch[0], ' ');
  }

  // --- remaining tokens -> item name, with cross-language alias expansion ---
  const tokens = working.text.split(' ').filter(Boolean);
  const aliasTable = { ...ALIASES.en, ...(ALIASES[lang] || {}) };
  const mapped = tokens.map((token) => {
    const sToken = singular(token, lang);
    if (aliasTable[token]) return aliasTable[token];
    if (aliasTable[sToken]) return aliasTable[sToken];
    if (STOPWORDS.has(token) || STOPWORDS.has(sToken) || NUMBER_WORDS[token] !== undefined || UNIT_LOOKUP[token]) return null;
    return sToken;
  });
  const itemTokens = mapped.filter(Boolean).filter((t) => !STOPWORDS.has(t));
  intent.itemName = itemTokens.join(' ').trim();

  if (!intent.action) intent.action = intent.itemName ? 'ADD' : null;
  return intent;
}

/* ---------------------------------------------------------------------------
 * LANGUAGE DETECTION — script scan first, then multilingual lexicon scoring
 * -------------------------------------------------------------------------*/

const SCRIPT_HINTS = [{ short: 'hi', regex: /[\u0900-\u097F]/ }];

export const languageMeta = (short, source = 'default') => {
  const entry = LANGUAGE_INDEX[short];
  if (!entry) return { short: 'en', code: 'en-US', label: 'English', flag: '🇺🇸', source };
  return { short: entry.short, code: entry.code, label: entry.label, flag: entry.flag, source };
};

const ENGLISH_CORE_VOCAB = new Set([
  'milk', 'eggs', 'egg', 'bread', 'butter', 'cheese', 'apples', 'apple', 'bananas', 'banana',
  'oranges', 'orange', 'strawberries', 'strawberry', 'blueberries', 'blueberry', 'potatoes', 'potato',
  'tomatoes', 'tomato', 'onions', 'onion', 'garlic', 'spinach', 'carrots', 'carrot', 'broccoli',
  'chicken', 'beef', 'pork', 'salmon', 'tuna', 'shrimp', 'turkey', 'bacon', 'rice', 'pasta',
  'quinoa', 'oats', 'cereal', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'olive', 'water',
  'juice', 'coffee', 'tea', 'yogurt', 'cream', 'cookies', 'cookie', 'chips', 'nuts', 'chocolate',
  'soap', 'paper', 'towel', 'detergent', 'diapers', 'wipes', 'cat', 'dog', 'food', 'snack', 'snacks'
]);

const lexiconScore = (normText, short) => {
  const tokens = normText.split(' ');
  let score = 0;

  // 1. Action verbs matching (3 pts for multi-word, 2 pts for single-word)
  for (const action of Object.keys(ACTION_VERBS)) {
    for (const verb of ACTION_VERBS[action][short] || []) {
      const v = normalize(verb);
      if (!v) continue;
      if (v.includes(' ')) {
        if (normText.includes(v)) score += 3;
      } else if (tokens.includes(v)) {
        score += 2;
      }
    }
  }

  // 2. Multilingual alias vocabulary matching (3 pts)
  for (const term of Object.keys(ALIASES[short] || {})) {
    if (tokens.includes(term)) score += 3;
  }

  // 3. English core catalog nouns matching (3 pts)
  if (short === 'en') {
    for (const token of tokens) {
      if (ENGLISH_CORE_VOCAB.has(token) || ENGLISH_CORE_VOCAB.has(singular(token))) {
        score += 3;
      }
    }
  }

  // 4. Unit words matching (1 pt)
  for (const group of UNIT_WORDS) {
    for (const word of group.words) {
      if (tokens.includes(word)) {
        // match specific language unit words
        if (short === 'es' && ['botellas', 'botella', 'bolsa', 'bolsas', 'caja', 'cajas', 'paquete', 'paquetes', 'frasco', 'lata', 'latas', 'docena', 'libra', 'libras', 'litro', 'litros'].includes(word)) score += 1;
        else if (short === 'fr' && ['bouteille', 'bouteilles', 'sachet', 'boite', 'paquet', 'bocal', 'douzaine', 'livre', 'livres', 'litre', 'litres'].includes(word)) score += 1;
        else if (short === 'de' && ['flasche', 'flaschen', 'beutel', 'schachtel', 'packung', 'glas', 'dose', 'dosen', 'dutzend', 'pfund'].includes(word)) score += 1;
        else if (short === 'hi' && ['बोतल', 'बोतलें', 'बॉक्स', 'थैला', 'बैग', 'डब्बा', 'पैकेट', 'डब्बे', 'दर्जन', 'किलो', 'लीटर'].includes(word)) score += 2;
        else if (short === 'en' && ['bottle', 'bottles', 'carton', 'cartons', 'loaf', 'loaves', 'bag', 'bags', 'box', 'boxes', 'pack', 'packs', 'jar', 'jars', 'can', 'cans', 'dozen', 'lb', 'lbs', 'pound', 'pounds', 'liter', 'liters'].includes(word)) score += 1;
      }
    }
  }

  return score;
};

export function detectLanguage(text, fallbackShort = 'en') {
  const normText = normalize(text);
  if (!normText) return languageMeta(fallbackShort, 'fallback');

  for (const hint of SCRIPT_HINTS) {
    if (hint.regex.test(text)) return languageMeta(hint.short, 'script');
  }

  let best = { short: null, score: 0 };
  for (const short of ['en', 'es', 'fr', 'hi', 'de']) {
    const score = lexiconScore(normText, short);
    if (score > best.score) best = { short, score };
  }
  if (best.short && best.score >= 2) return languageMeta(best.short, 'lexicon');
  return languageMeta(fallbackShort, 'fallback');
}

/* ---------------------------------------------------------------------------
 * CATALOG SEARCH & SUBSTITUTES
 * -------------------------------------------------------------------------*/

const tokenize = (query) =>
  String(query || '')
    .toLowerCase()
    .split(/[\s.,;:!?¿¡'"’“”()\[\]]+/)
    .filter(Boolean);

export function searchCatalog(rawQuery, { maxPrice = null } = {}) {
  const query = normalize(rawQuery);
  const sQuery = singular(query);
  const organicOnly = /\borganic\b|\bbio\b|\borganica\b|\borganico\b/.test(query);
  const tokens = tokenize(query)
    .filter((t) => !['organic', 'bio', 'organica', 'organico'].includes(t))
    .map((t) => singular(t));

  const scored = CATALOG.map((item, catalogIndex) => {
    if (organicOnly && !item.isOrganic) return null;
    if (maxPrice !== null && item.price > maxPrice) return null;

    const nameTokens = tokenize(item.name).map(normalize);
    const sNameTokens = nameTokens.map((t) => singular(t));
    const brandTokens = tokenize(item.brand || '').map(normalize).map((t) => singular(t));
    const sizeTokens = tokenize(item.size || '').map(normalize).map((t) => singular(t));
    const deptTokens = tokenize(DEPARTMENT_INDEX[item.category]?.label || '').map(normalize).map((t) => singular(t));
    const allHaystack = [...sNameTokens, ...brandTokens, ...sizeTokens, ...deptTokens];

    const normalizedName = normalize(item.name);
    const sNormalizedName = singular(normalizedName);
    let score = 0;

    // Direct full-name match bonus (normalized or singularized)
    if (normalizedName === query || sNormalizedName === query || sNormalizedName === sQuery || normalizedName === sQuery) {
      score += 35;
    }

    const isProduce = item.category === 'produce';

    for (const rawToken of tokens) {
      const t = rawToken;
      if (!t) continue;

      // Primary name token match (both raw and singular)
      const exactNameHit = sNameTokens.some((h) => h === t) || nameTokens.some((h) => h === t);
      if (exactNameHit) {
        score += 15;
        // Exact 1:1 or 1:2 concise name match
        if (sNameTokens.length <= 2) {
          score += 15;
        }
        if (isProduce) {
          score += 8; // Prioritize raw produce over flavored snacks/desserts
        }
      } else if (sNameTokens.some((h) => h.startsWith(t)) || nameTokens.some((h) => h.startsWith(t))) {
        score += 5;
      } else if (allHaystack.some((h) => h === t)) {
        score += 4;
      } else if (allHaystack.some((h) => h.startsWith(t))) {
        score += 2;
      }
    }

    if (score === 0) return null;

    // Penalize verbose/compound multi-word SKU names when looking for short terms
    if (tokens.length > 0) {
      const tokenDiff = Math.max(0, sNameTokens.length - tokens.length);
      score -= tokenDiff * 2.0;
    }

    return { ...item, score, catalogIndex };
  }).filter(Boolean);

  return scored
    .sort((a, b) => b.score - a.score || a.catalogIndex - b.catalogIndex)
    .map(({ score, catalogIndex, ...item }) => item);
}

export function findSubstitute(product) {
  if (!product?.substitutes?.length) return null;
  for (const altName of product.substitutes) {
    const alt = CATALOG.find((item) => normalize(item.name) === normalize(altName));
    if (alt && alt.inStock) {
      return { ...alt, reason: alt.category === product.category ? 'Similar aisle pick' : 'Close match in stock' };
    }
  }
  return null;
}

/* ---------------------------------------------------------------------------
 * CONTEXT-AWARE TTS ENGINE — casual confirmations per language × intent
 * -------------------------------------------------------------------------*/

export const TTS_PHRASES = {
  en: {
    add: [(name) => `All set, added ${name}!`, (name) => `Got it, added ${name}!`, (name) => `${name} is on the list — nice pick!`],
    addRestock: [(name) => `Got it, added ${name} before you run dry!`, (name) => `On it! Restocking ${name} on the list.`],
    addMulti: [() => 'Done, got all those added for ya!', () => 'Sweet, threw those on your list.'],
    remove: [(name) => `Poof! Removed ${name} from your list.`, (name) => `Got rid of ${name} for ya!`],
    update: [(name, qty) => `Done, ${qty} ${name} it is!`, (name, qty) => `Updated — ${name} is set to ${qty}.`],
    cleared: [() => 'Fresh start — the list is cleared!', () => 'All wiped clean!'],
    notFound: [() => 'Hmm, I couldn’t find that one — try a different name?', () => 'Sorry, that didn’t match anything in the store.'],
  },
  es: {
    add: [(name) => `¡Listo, agregué ${name}!`, (name) => `¡Anotado! ${name} está en la lista.`],
    addRestock: [(name) => `¡Entendido! Agregué ${name} antes de que te quedes sin nada.`, (name) => `¡Voy! Reponiendo ${name}.`],
    addMulti: [() => '¡Hecho, agregué todo!', () => '¡Genial, todo en la lista!'],
    remove: [(name) => `¡Puf! Quité ${name} de la lista.`, (name) => `${name} fuera de la lista.`],
    update: [(name, qty) => `¡Listo! ${name} ahora son ${qty}.`, (name, qty) => `Actualizado: ${qty} de ${name}.`],
    cleared: [() => '¡Lista vaciada!', () => '¡Todo limpio!'],
    notFound: [() => 'No encontré eso, ¿puedes repetirlo?', () => 'Eso no está en la tienda.'],
  },
  fr: {
    add: [(name) => `C'est bon, j'ai ajouté ${name} !`, (name) => `${name} est sur la liste !`],
    addRestock: [(name) => `Bien joué, j'ai ajouté ${name} avant la panne sèche !`, (name) => `Je m'en occupe, je rajoute ${name}.`],
    addMulti: [() => 'Voilà, tout est ajouté !', () => 'Parfait, tout est sur la liste.'],
    remove: [(name) => `Pouf ! J'ai retiré ${name} de la liste.`, (name) => `${name}, c'est enlevé !`],
    update: [(name, qty) => `C'est fait, ${qty} ${name} !`, (name, qty) => `Mis à jour : ${name} passe à ${qty}.`],
    cleared: [() => 'La liste est vidée !', () => 'Tout est nettoyé !'],
    notFound: [() => 'Je n’ai pas trouvé ça, tu peux reformuler ?', () => 'Ça n’existe pas en magasin.'],
  },
  hi: {
    add: [(name) => `Ho gaya, ${name} list mein add kar diya!`, (name) => `${name} list par hai, badhiya choice!`],
    addRestock: [(name) => `Samajh gaya, khatam hone se pehle ${name} add kar diya!`, (name) => `Ho gaya, ${name} dobara le aayenge.`],
    addMulti: [() => 'Ho gaya, sab kuch add kar diya!', () => 'Badhiya, sab list par daal diya!'],
    remove: [(name) => `Poof! ${name} list se hata diya.`, (name) => `${name} hata diya, done!`],
    update: [(name, qty) => `Ho gaya, ${name} ab ${qty} hai!`, (name, qty) => `Update kar diya — ${qty} ${name}.`],
    cleared: [() => 'List ekdum saaf ho gayi!', () => 'Sab hata diya, fresh start!'],
    notFound: [() => 'Yeh item nahi mila, doosra naam try karein?', () => 'Maaf kijiye, woh store mein nahi hai.'],
  },
  de: {
    add: [(name) => `Alles klar, ${name} ist auf der Liste!`, (name) => `Erledigt, ${name} hinzugefügt!`],
    addRestock: [(name) => `Verstanden, ${name} hinzugefügt, bevor alles leer ist!`, (name) => `Ich kümmere mich darum — ${name} kommt auf die Liste.`],
    addMulti: [() => 'Fertig, alles hinzugefügt!', () => 'Super, alles landet auf deiner Liste.'],
    remove: [(name) => `Puff! ${name} von der Liste entfernt.`, (name) => `${name} ist raus aus der Liste!`],
    update: [(name, qty) => `Erledigt, ${qty} ${name}!`, (name, qty) => `Aktualisiert — ${name} ist jetzt ${qty}.`],
    cleared: [() => 'Die Liste ist leer!', () => 'Alles gelöscht!'],
    notFound: [() => 'Das habe ich nicht gefunden — sagst du es anders?', () => 'Das gibt es leider nicht im Laden.'],
  },
};

const lastPhrasePick = {};

export function pickPhrase(short, category, ...args) {
  const bank = TTS_PHRASES[short]?.[category] || TTS_PHRASES.en[category] || TTS_PHRASES.en.add;
  const key = `${short}:${category}`;
  let index = Math.floor(Math.random() * bank.length);
  if (bank.length > 1 && lastPhrasePick[key] === index) {
    index = (index + 1) % bank.length;
  }
  lastPhrasePick[key] = index;
  return bank[index](...args);
}

const RESTOCK_HINTS = {
  en: ['running low', 'running out', 'out of', 'ran out', 'need more', 'low on', 'restock', 'almost empty'],
  es: ['se acabo', 'se esta acabando', 'me quede sin', 'quedan pocos', 'necesito mas', 'se agoto'],
  fr: ['plus de', 'je n ai plus', 'bientot fini', 'manque de', 'reste plus', 'epuise'],
  hi: ['khatam ho gaya', 'khatam ho rahi', 'khatam hone', 'bacha nahi', 'aur chahiye', 'doobara'],
  de: ['geht aus', 'fast leer', 'nichts mehr', 'brauche mehr', 'ausgegangen', 'wieder her'],
};

export function detectRestockContext(text, short = 'en') {
  const norm = normalize(text);
  if (!norm) return false;
  const hints = [...(RESTOCK_HINTS[short] || []), ...RESTOCK_HINTS.en];
  return hints.some((hint) => norm.includes(normalize(hint)));
}

export const MULTI_ITEM_SPLIT = /(?:,|\band\b|\by\b|\bet\b|\bund\b|और|\baur\b)/i;

export function splitMultiItems(text) {
  return String(text || '')
    .split(MULTI_ITEM_SPLIT)
    .map((part) => part.trim())
    .filter(Boolean);
}

export const detectMultiItem = (text) => splitMultiItems(text).length > 1;

/* ---------------------------------------------------------------------------
 * LLM AUTO-DETECTION ENGINE (optional Gemini refinement)
 * Raw transcripts in ANY language go in; canonical English + detected
 * language code + localized reply come out. Silent degradation to the
 * on-device parser when no key is configured or the call fails.
 * -------------------------------------------------------------------------*/

export const RETRY_LANGUAGE_CHAIN = ['en-US', 'hi-IN', 'es-ES', 'fr-FR', 'de-DE'];

export const buildLLMSystemPrompt = () => `You are the multilingual NLP engine of a voice shopping assistant.
Canonical store catalog (match items ONLY against these names): ${CATALOG.map((item) => item.name).join(', ')}.

For every raw voice transcript you receive, you must:
1. Automatically identify the language spoken in the input transcript (e.g., Hindi, Hinglish, Spanish, French, German, English).
2. Translate the intent and item into canonical English for database matching.
3. Identify the response language code (e.g., 'hi-IN', 'es-ES', 'en-US').
4. Return a structured JSON response containing exactly these keys:
{
  "detectedLanguageCode": "hi-IN",
  "action": "ADD" | "REMOVE" | "SEARCH",
  "canonicalItem": "Milk",
  "originalItemSpoken": "Doodh",
  "quantity": 2,
  "replyMessage": "Do packet doodh aapki list mein add kar diya hai!"
}

Rules:
- "action" must be one of ADD, REMOVE, SEARCH. Use ADD when unsure.
- "canonicalItem" must be the closest canonical English catalog name above (or the best English guess).
- "quantity" is a number; default to 1 when not spoken.
- "originalItemSpoken" is the item exactly as the user said it, in their language.
- "replyMessage" is a warm, casual one-sentence confirmation written in the SAME language the user spoke (Hinglish allowed for Hindi speakers), mentioning the item.
- Return ONLY the JSON object. No markdown, no commentary.`;

export const LLM_SYSTEM_PROMPT = buildLLMSystemPrompt();

export function sanitizeLLMResponse(raw) {
  if (!raw) return null;
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      const cleaned = raw.replace(/```(?:json)?/gi, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const code = typeof parsed.detectedLanguageCode === 'string' ? parsed.detectedLanguageCode.trim() : '';
  const short = code.split('-')[0].toLowerCase();
  const action = ['ADD', 'REMOVE', 'SEARCH'].includes(String(parsed.action).toUpperCase())
    ? String(parsed.action).toUpperCase()
    : 'ADD';
  const canonicalItem = typeof parsed.canonicalItem === 'string' ? parsed.canonicalItem.trim() : '';
  if (!canonicalItem) return null;
  return {
    detectedLanguageCode: LANGUAGE_INDEX[short]?.code || 'en-US',
    action,
    canonicalItem,
    originalItemSpoken: typeof parsed.originalItemSpoken === 'string' ? parsed.originalItemSpoken : canonicalItem,
    quantity: Number(parsed.quantity) > 0 ? Number(parsed.quantity) : 1,
    replyMessage: typeof parsed.replyMessage === 'string' ? parsed.replyMessage : '',
  };
}

export async function parseWithLLM(transcript, apiKey, { timeoutMs = 8000 } = {}) {
  if (!apiKey) throw new Error('missing-api-key');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: LLM_SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: String(transcript) }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        }),
        signal: controller.signal,
      },
    );
    if (!response.ok) throw new Error(`llm-http-${response.status}`);
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const sanitized = sanitizeLLMResponse(text);
    if (!sanitized) throw new Error('llm-unparsable-response');
    return sanitized;
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------------------------------------------------------------------
 * WEB SPEECH HOOKS
 * -------------------------------------------------------------------------*/

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — degrade silently */
    }
  }, [key, value]);

  return [value, setValue];
}

const LOW_CONFIDENCE_THRESHOLD = 0.4;
const RETRYABLE_SPEECH_ERRORS = new Set(['no-speech', 'network', 'audio-capture', 'language-not-supported']);

export function useSpeechRecognition({ lang, fallbackLangs = null, onResult, onError, onStateChange, onLangSwitch, continuous = false }) {
  const [isListening, setIsListening] = useState(false);
  const [activeLang, setActiveLang] = useState(lang);
  const recognitionRef = useRef(null);
  const retryIndexRef = useRef(0);
  const manualStopRef = useRef(false);
  const restartingRef = useRef(false);
  const continuousRef = useRef(continuous);
  const continuousTimerRef = useRef(null);

  // Keep ref in sync so the closure in onend always sees the latest value.
  useEffect(() => { continuousRef.current = continuous; }, [continuous]);

  // Clean up the auto-restart timer on unmount.
  useEffect(() => () => { if (continuousTimerRef.current) clearTimeout(continuousTimerRef.current); }, []);

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
  const supported = Boolean(SpeechRecognition);

  const chain = useMemo(() => {
    if (Array.isArray(fallbackLangs) && fallbackLangs.length > 1) return fallbackLangs;
    return [lang];
  }, [fallbackLangs, lang]);
  const autoRetry = chain.length > 1;

  const bootRecognition = useCallback(
    (langCode) => {
      const recognition = new SpeechRecognition();
      recognition.lang = langCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const alternative = event.results?.[0]?.[0];
        const transcript = alternative?.transcript || '';
        const confidence = alternative?.confidence ?? 1;

        // Low-confidence transcript on locale A → instantly re-listen on the next locale.
        if (
          autoRetry &&
          !manualStopRef.current &&
          confidence > 0 &&
          confidence < LOW_CONFIDENCE_THRESHOLD &&
          retryIndexRef.current < chain.length - 1
        ) {
          retryIndexRef.current += 1;
          onLangSwitch?.(chain[retryIndexRef.current], 'low-confidence');
          restartWith(chain[retryIndexRef.current]);
          return;
        }

        retryIndexRef.current = 0;
        if (transcript.trim()) onResult?.(transcript.trim(), langCode);
      };

      recognition.onerror = (event) => {
        if (restartingRef.current && event.error === 'aborted') return;
        const errorType = event.error || 'unknown';

        // Input/network error on locale A → rotate to the next locale and retry.
        if (
          autoRetry &&
          RETRYABLE_SPEECH_ERRORS.has(errorType) &&
          !manualStopRef.current &&
          retryIndexRef.current < chain.length - 1
        ) {
          retryIndexRef.current += 1;
          onLangSwitch?.(chain[retryIndexRef.current], errorType);
          restartWith(chain[retryIndexRef.current]);
          return;
        }

        setIsListening(false);
        onStateChange?.('error');
        onError?.({
          type: autoRetry && RETRYABLE_SPEECH_ERRORS.has(errorType) ? 'exhausted' : errorType,
          message: errorType,
        });
      };

      recognition.onend = () => {
        if (restartingRef.current) return;
        setIsListening(false);
        // If continuous mode is active and the user didn't manually stop,
        // auto-restart after 900 ms so TTS has time to finish speaking.
        if (continuousRef.current && !manualStopRef.current) {
          onStateChange?.('idle');
          continuousTimerRef.current = setTimeout(() => {
            if (continuousRef.current && !manualStopRef.current) {
              bootRecognition(langCode);
            }
          }, 900);
          return;
        }
        onStateChange?.('idle');
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
        setActiveLang(langCode);
        setIsListening(true);
        onStateChange?.('listening');
      } catch {
        onError?.({ type: 'start-failed', message: 'Could not start the microphone.' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoRetry, chain, onResult, onError, onStateChange, onLangSwitch],
  );

  const restartWith = useCallback(
    (langCode) => {
      restartingRef.current = true;
      try {
        recognitionRef.current?.abort();
      } catch {
        /* nothing to abort */
      }
      bootRecognition(langCode);
      restartingRef.current = false;
    },
    [bootRecognition],
  );

  const stop = useCallback(() => {
    manualStopRef.current = true;
    if (continuousTimerRef.current) {
      clearTimeout(continuousTimerRef.current);
      continuousTimerRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
    setIsListening(false);
    onStateChange?.('idle');
  }, [onStateChange]);

  const start = useCallback(() => {
    if (!supported) {
      onError?.({ type: 'unsupported', message: 'Speech recognition is not supported in this browser.' });
      return;
    }
    manualStopRef.current = false;
    retryIndexRef.current = 0;
    try {
      recognitionRef.current?.abort();
    } catch {
      /* nothing to abort */
    }
    bootRecognition(chain[0]);
  }, [supported, chain, bootRecognition, onError]);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  useEffect(() => () => {
    manualStopRef.current = true;
    try {
      recognitionRef.current?.abort();
    } catch {
      /* cleanup best-effort */
    }
  }, []);

  return { supported, isListening, activeLang, start, stop, toggle };
}

export function useSpeechSynthesis() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text, langCode = 'en-US') => {
      if (!supported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        const voice = window.speechSynthesis
          .getVoices()
          .find((v) => v.lang === langCode || v.lang.startsWith(langCode.split('-')[0]));
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } catch {
        /* TTS failure is non-blocking */
      }
    },
    [supported],
  );

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  return { supported, speak, cancel };
}

/* ---------------------------------------------------------------------------
 * LIST REDUCER
 * -------------------------------------------------------------------------*/

const LIST_KEY = 'vc.list.v1';

function listReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return Array.isArray(action.items) ? action.items : state;
    case 'ADD': {
      const { product, quantity = 1, unit } = action;
      const existing = state.find((entry) => entry.id === product.id);
      if (existing) {
        return state.map((entry) =>
          entry.id === product.id
            ? { ...entry, quantity: entry.quantity + quantity, checked: false }
            : entry,
        );
      }
      return [
        ...state,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          unit: unit || product.unit,
          brand: product.brand,
          isOrganic: product.isOrganic,
          quantity,
          checked: false,
          addedAt: Date.now(),
        },
      ];
    }
    case 'REMOVE':
      return state.filter((entry) => entry.id !== action.id);
    case 'SET_QTY':
      return state
        .map((entry) =>
          entry.id === action.id ? { ...entry, quantity: Math.max(0, action.quantity) } : entry,
        )
        .filter((entry) => entry.quantity > 0);
    case 'TOGGLE':
      return state.map((entry) =>
        entry.id === action.id ? { ...entry, checked: !entry.checked } : entry,
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

/* ---------------------------------------------------------------------------
 * UI PRIMITIVES
 * -------------------------------------------------------------------------*/

const toastMeta = {
  success: { icon: CheckCircle2, classes: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  info: { icon: Info, classes: 'border-blue-200 bg-blue-50 text-blue-900' },
  error: { icon: AlertTriangle, classes: 'border-rose-200 bg-rose-50 text-rose-900' },
};

function Toast({ toast, onDismiss }) {
  const meta = toastMeta[toast.type] || toastMeta.info;
  const Icon = meta.icon;
  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg animate-fade-in-down ${meta.classes}`}
      role="status"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.message && <p className="mt-0.5 text-xs opacity-80">{toast.message}</p>}
      </div>
      {toast.detected ? (
        <span className="inline-flex shrink-0 animate-badge-pop items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200 shadow-sm">
          🌐 Auto-Detected: {toast.detected.label} ({toast.detected.code})
        </span>
      ) : toast.langBadge ? (
        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold">
          {toast.langBadge}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-full p-1.5 opacity-60 transition hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function DepartmentBadge({ categoryId }) {
  const dept = DEPARTMENT_INDEX[categoryId];
  if (!dept) return null;
  const Icon = dept.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${dept.tint}`}
    >
      <Icon className="h-3 w-3" />
      {dept.label}
    </span>
  );
}

function VoiceStatusBadge({ listening, supported }) {
  if (listening) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 shadow-glow-emerald">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Voice Active
      </span>
    );
  }
  if (supported) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        API Connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
      <MicOff className="h-3 w-3" />
      Voice Offline
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
      <div className="h-4 w-2/3 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
    </div>
  );
}

function EmptyListState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200/60">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <ShoppingCart className="h-8 w-8" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Your list is empty</h3>
        <p className="mt-1 text-sm text-slate-500">
          Tap the mic and say something like “add two cartons of oat milk”, or try a demo chip below.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * LIST VIEW — smart department group cards
 * -------------------------------------------------------------------------*/

function QtyStepper({ entry, onQty }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onQty(entry, entry.quantity - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/60 transition hover:bg-blue-50 hover:text-blue-600"
        aria-label={`Decrease ${entry.name} quantity`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-800">
        {entry.quantity}
      </span>
      <button
        type="button"
        onClick={() => onQty(entry, entry.quantity + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/60 transition hover:bg-blue-50 hover:text-blue-600"
        aria-label={`Increase ${entry.name} quantity`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function ListItemRow({ entry, onQty, onToggle, onRemove, substitute, onAddSubstitute }) {
  const dept = DEPARTMENT_INDEX[entry.category];
  const DeptIcon = dept?.icon || Package;
  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition-shadow duration-200 hover:shadow-md animate-fade-in-down">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${dept?.tint || 'bg-slate-100 text-slate-600'}`}>
          <DeptIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold text-slate-800 ${entry.checked ? 'line-through opacity-50' : ''}`}>
            {entry.name}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {entry.brand} · {formatPrice(entry.price)} / {entry.unit}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <DepartmentBadge categoryId={entry.category} />
            {entry.isOrganic && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <Leaf className="h-3 w-3" /> Organic
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm font-bold text-slate-800">{formatPrice(entry.price * entry.quantity)}</p>
          <button
            type="button"
            onClick={() => onRemove(entry)}
            className="rounded-full p-2.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            aria-label={`Remove ${entry.name} from list`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
        <QtyStepper entry={entry} onQty={onQty} />
        <button
          type="button"
          onClick={() => onToggle(entry)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            entry.checked
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          {entry.checked ? 'Got it' : 'Check off'}
        </button>
      </div>

      {substitute && !entry.checked && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-4 text-amber-800 ring-1 ring-amber-200/60">
          <span className="flex items-center gap-2 text-xs font-medium">
            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
            Substitute available: <span className="font-semibold">{substitute.name}</span> ({formatPrice(substitute.price)})
          </span>
          <button
            type="button"
            onClick={() => onAddSubstitute(substitute)}
            className="shrink-0 rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function MyListView({ list, onQty, onToggle, onRemove, substitutesByEntry, onAddSubstitute, onClear }) {
  const grouped = useMemo(
    () =>
      DEPARTMENTS.map((dept) => ({
        dept,
        items: list.filter((entry) => entry.category === dept.id),
      })).filter((group) => group.items.length > 0),
    [list],
  );

  if (list.length === 0) return <EmptyListState />;

  const total = list.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
  const checkedCount = list.filter((entry) => entry.checked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-6 text-white shadow-lg shadow-blue-500/25">
        <div>
          <p className="text-sm font-medium text-blue-100">
            {list.length} item{list.length === 1 ? '' : 's'} · {checkedCount} checked off
          </p>
          <p className="mt-1 text-3xl font-bold">{formatPrice(total)}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
        >
          Clear list
        </button>
      </div>

      {grouped.map(({ dept, items }) => {
        const DeptIcon = dept.icon;
        return (
          <section key={dept.id} className="space-y-4">
            <header className="flex items-center gap-2 px-1">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${dept.tint}`}>
                <DeptIcon className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">{dept.label}</h3>
              <span className="text-xs text-slate-400">
                {formatPrice(items.reduce((sum, entry) => sum + entry.price * entry.quantity, 0))}
              </span>
            </header>
            {items.map((entry) => (
              <ListItemRow
                key={entry.id}
                entry={entry}
                onQty={onQty}
                onToggle={onToggle}
                onRemove={onRemove}
                substitute={substitutesByEntry[entry.id] || null}
                onAddSubstitute={onAddSubstitute}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * SEARCH VIEW — filtered catalog cards
 * -------------------------------------------------------------------------*/

function SearchView({ results, query, maxPrice, onAdd, booting }) {
  if (booting) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition-shadow duration-200 hover:shadow-md">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Search className="h-4 w-4 text-blue-600" />
          {query ? (
            <>
              <span className="font-semibold text-slate-800">{results.length}</span> result{results.length === 1 ? '' : 's'} for
              <span className="font-semibold text-slate-800"> “{query}”</span>
              {maxPrice !== null && <span className="text-slate-500"> · under {formatPrice(maxPrice)}</span>}
            </>
          ) : (
            <>Say or type a search like <span className="font-semibold text-slate-800">“find organic apples under $5”</span> to browse the {CATALOG.length}-item catalog.</>
          )}
        </p>
      </div>

      {!query ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {CATALOG.slice(0, 8).map((item) => (
            <SearchResultCard key={item.id} item={item} onAdd={onAdd} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200/60">
          <p className="text-sm font-semibold text-slate-800">No matches found</p>
          <p className="mt-1 text-sm text-slate-500">Try a broader term, a different brand, or a higher price limit.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((item) => (
            <SearchResultCard key={item.id} item={item} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchResultCard({ item, onAdd }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition-shadow duration-200 hover:shadow-md animate-fade-in-down">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{item.brand}</p>
        </div>
        <p className="text-sm font-bold text-slate-800">{formatPrice(item.price)}</p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <DepartmentBadge categoryId={item.category} />
        {item.isOrganic && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <Leaf className="h-3 w-3" /> Organic
          </span>
        )}
        {!item.inStock && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            Out of stock
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
        <span className="text-xs text-slate-500">per {item.unit}</span>
        <button
          type="button"
          disabled={!item.inStock}
          onClick={() => onAdd(item)}
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          <Plus className="h-3.5 w-3.5" />
          Add to List
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * SMART SUGGESTIONS — history picks, seasonal recs, healthy substitutes
 * -------------------------------------------------------------------------*/

function SuggestionChip({ item, label, onPick }) {
  const isSale = item.onSale && typeof item.salePrice === 'number';
  return (
    <button
      type="button"
      onClick={() => onPick(item)}
      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-blue-50 p-3 text-left text-sm font-medium text-blue-800 ring-1 ring-blue-200/60 transition hover:bg-blue-100 active:scale-[0.98]"
    >
      <Plus className="h-3.5 w-3.5 text-blue-500" />
      <span>
        {item.name}
        {isSale && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600">
            <span className="line-through text-slate-400 font-normal">{formatPrice(item.price)}</span>
            {formatPrice(item.salePrice)}
          </span>
        )}
        {!isSale && label && <span className="block text-[10px] font-normal text-blue-500">{label}</span>}
        {isSale && label && <span className="block text-[10px] font-normal text-blue-500">{label}</span>}
      </span>
    </button>
  );
}

function SuggestionsPanel({ list, history, onPick }) {
  const listIds = useMemo(() => new Set(list.map((entry) => entry.id)), [list]);
  const season = currentSeason();

  // Real purchase history: score by frequency (add count) and recency
  // (days since last add), then surface the top repeat-buy candidates.
  const historyPicks = useMemo(() => {
    const DAY = 24 * 60 * 60 * 1000;
    return Object.entries(history)
      .map(([id, entry]) => {
        const product = CATALOG.find((item) => item.id === id);
        if (!product || !product.inStock || listIds.has(product.id)) return null;
        const daysSince = (Date.now() - entry.lastAddedAt) / DAY;
        const score = entry.count * 2 + Math.min(daysSince, 30) / 10;
        const historyLabel =
          entry.count >= 2 && daysSince >= 5
            ? 'running low?'
            : entry.count >= 2
              ? 'you usually buy this'
              : 'bought before';
        return { product, score, historyLabel };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ product, historyLabel }) => ({ ...product, historyLabel }));
  }, [history, listIds]);

  const seasonalPicks = useMemo(
    () =>
      CATALOG.filter(
        (item) => item.inStock && !listIds.has(item.id) && item.season.includes(season) && !item.season.includes('all'),
      ).slice(0, 3),
    [listIds, season],
  );

  const substitutePicks = useMemo(() => {
    const picks = [];
    for (const entry of list) {
      const product = CATALOG.find((item) => item.id === entry.productId);
      const sub = findSubstitute(product);
      if (sub && !listIds.has(sub.id)) picks.push(sub);
      if (picks.length >= 3) break;
    }
    return picks;
  }, [list, listIds]);

  const salePicks = useMemo(
    () => CATALOG.filter((item) => item.onSale && item.inStock && !listIds.has(item.id)).slice(0, 4),
    [listIds],
  );

  if (historyPicks.length + seasonalPicks.length + substitutePicks.length + salePicks.length === 0) return null;

  const sections = [
    { icon: History, title: 'Based on your history', items: historyPicks, label: (item) => item.historyLabel },
    { icon: Tag, title: 'On sale now', items: salePicks, label: (item) => item.onSale ? `was ${formatPrice(item.price)}` : null },
    { icon: Sun, title: `In season · ${season}`, items: seasonalPicks, label: 'fresh right now' },
    { icon: Heart, title: 'Smart substitutes', items: substitutePicks, label: 'worth a swap' },
  ].filter((section) => section.items.length > 0);

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 px-1 text-sm font-bold uppercase tracking-wide text-slate-600">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        Smart Suggestions
      </h2>
      {sections.map(({ icon: Icon, title, items, label }) => (
        <div key={title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition-shadow duration-200 hover:shadow-md">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Icon className="h-3.5 w-3.5 text-blue-500" />
            {title}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {items.map((item) => (
              <SuggestionChip
                key={`${title}-${item.id}`}
                item={item}
                label={typeof label === 'function' ? label(item) : label}
                onPick={onPick}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * FLOATING VOICE BAR + DEMO CHIPS
 * -------------------------------------------------------------------------*/

const DEMO_COMMANDS = [
  'Yo, add 2 cartons of oat milk',
  'Pyaz teen kilo add karo',
  'Find organic apples under $5',
  'Añadir leche',
  'Ajouter du pain',
  'Füge Kaffee hinzu',
  'Running low on coffee beans',
  'Set eggs to 6',
  'Remove the eggs',
];

function VoiceBar({
  value,
  onChange,
  onSubmit,
  onMicToggle,
  listening,
  processing,
  supported,
  langLabel,
  statusText,
  inputRef,
  onDemo,
  continuous,
  onToggleContinuous,
}) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2">
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="list" aria-label="Demo voice commands">
        {DEMO_COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            role="listitem"
            onClick={() => onDemo(command)}
            className="shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {command}
          </button>
        ))}
      </div>

      <div className="rounded-[1.75rem] border border-slate-200/60 bg-white/90 p-5 shadow-xl shadow-blue-900/10 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Globe className="h-3 w-3" />
            {langLabel}
          </span>
          <div className="flex items-center gap-2">
            {/* Continuous-listen toggle */}
            <button
              type="button"
              onClick={onToggleContinuous}
              title={continuous ? 'Continuous listening on — tap to switch to push-to-talk' : 'Push-to-talk mode — tap to enable continuous listening'}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 transition ${
                continuous
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200'
              }`}
              aria-pressed={continuous}
              aria-label={continuous ? 'Disable continuous listening' : 'Enable continuous listening'}
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${continuous ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {continuous ? 'Continuous' : 'Push-to-talk'}
            </button>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              {listening && <span className="flex gap-0.5">
                <span className="h-2.5 w-0.5 animate-pulse rounded bg-rose-500" />
                <span className="h-3.5 w-0.5 animate-pulse rounded bg-rose-500 [animation-delay:150ms]" />
                <span className="h-2 w-0.5 animate-pulse rounded bg-rose-500 [animation-delay:300ms]" />
              </span>}
              {statusText}
            </span>
          </div>
        </div>

        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Type a command… e.g. “add eggs”"
            className="min-w-0 flex-1 rounded-full border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            aria-label="Manual command input"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            aria-label="Send command"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onMicToggle}
            className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-5 shadow-lg transition ${
              listening
                ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                : 'bg-blue-600 text-white shadow-blue-600/40 hover:bg-blue-700'
            }`}
            aria-label={listening ? 'Stop listening' : 'Start listening'}
          >
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full bg-rose-400/60 animate-pulse-ring" />
                <span className="absolute inset-0 rounded-full bg-rose-400/40 animate-pulse-ring [animation-delay:500ms]" />
              </>
            )}
            {listening ? <Mic className="relative h-6 w-6" /> : supported ? <Mic className="relative h-6 w-6" /> : <MicOff className="relative h-6 w-6" />}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * HEADER — status badges, language dropdown, view switcher
 * -------------------------------------------------------------------------*/

function Header({ listening, supported, selectedLang, onSelectLang, view, onChangeView, itemCount, llmKey, onSaveLlmKey }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [keyDraft, setKeyDraft] = useState(llmKey || '');
  const aiRef = useRef(null);

  useEffect(() => {
    if (aiOpen) setKeyDraft(llmKey || '');
  }, [aiOpen, llmKey]);

  useEffect(() => {
    if (!aiOpen) return;
    const handleClickOutside = (event) => {
      if (aiRef.current && !aiRef.current.contains(event.target)) {
        setAiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [aiOpen]);

  return (
    <header className="sticky top-0 z-[55] border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-500/30">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-800">Voice Cart</h1>
            <p className="text-[11px] leading-tight text-slate-400">Speak in any of 5 languages</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <VoiceStatusBadge listening={listening} supported={supported} />
          {llmKey && (
            <span className="inline-flex animate-badge-pop items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200">
              <Sparkles className="h-3 w-3" />
              AI Parser
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative" ref={aiRef}>
            <button
              type="button"
              onClick={() => setAiOpen((open) => !open)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full ring-1 transition ${
                llmKey
                  ? 'bg-violet-50 text-violet-600 ring-violet-200 hover:bg-violet-100'
                  : 'bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200'
              }`}
              aria-label="AI language detection settings"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            {aiOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200/60 animate-fade-in-down">
                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  Gemini auto-detect (optional)
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                  Paste a Gemini API key to let the AI identify the spoken language on the fly, translate items to
                  canonical English, and reply in the speaker’s own language. Without a key, the on-device
                  auto-detect parser handles everything.
                </p>
                <input
                  type="password"
                  value={keyDraft}
                  onChange={(event) => setKeyDraft(event.target.value)}
                  placeholder="Gemini API key"
                  className="mt-3 w-full rounded-xl border-0 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
                  aria-label="Gemini API key"
                />
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSaveLlmKey(keyDraft.trim());
                      setAiOpen(false);
                    }}
                    className="rounded-full bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                  >
                    Save
                  </button>
                  {llmKey && (
                    <button
                      type="button"
                      onClick={() => {
                        onSaveLlmKey('');
                        setKeyDraft('');
                      }}
                      className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                    >
                      Remove key
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setAiOpen(false)}
                    className="ml-auto rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Close AI settings"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <label className="relative inline-flex items-center">
            <Globe className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedLang}
              onChange={(event) => onSelectLang(event.target.value)}
              className="cursor-pointer appearance-none rounded-full bg-slate-100 py-1.5 pl-8 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
              aria-label="Voice language"
            >
              <option value="auto">Auto-detect</option>
              {LANGUAGES.map((entry) => (
                <option key={entry.short} value={entry.short}>
                  {entry.flag} {entry.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400" />
          </label>

          <div className="flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => onChangeView('list')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                view === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ListChecks className="h-3.5 w-3.5" />
              List{itemCount > 0 && ` (${itemCount})`}
            </button>
            <button
              type="button"
              onClick={() => onChangeView('search')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                view === 'search' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------------
 * APP ROOT
 * -------------------------------------------------------------------------*/

const SPEECH_ERROR_MESSAGES = {
  'not-allowed': 'Microphone permission was denied — you can still type commands below.',
  'service-not-allowed': 'Voice service is blocked by the browser — the text bar is ready instead.',
  network: 'Voice service hit a network error — falling back to the text bar.',
  'audio-capture': 'No microphone was found — you can type commands instead.',
  'no-speech': 'I didn’t catch anything — try again or type it below.',
  exhausted: 'I tried every language locale and still couldn’t listen — the text bar is ready.',
  'language-not-supported': 'That locale isn’t supported here — the text bar still works.',
  unsupported: 'This browser doesn’t support voice input — the text bar works great.',
};

export default function App() {
  const [list, dispatch] = useReducer(listReducer, undefined, () => {
    try {
      const raw = window.localStorage.getItem(LIST_KEY);
      const parsed = raw !== null ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [selectedLang, setSelectedLang] = usePersistentState('vc.lang.v1', 'auto');
  const [continuousListen, setContinuousListen] = usePersistentState('vc.continuous.v1', false);
  const [lastDetected, setLastDetected] = usePersistentState('vc.detected.v1', 'en');
  const [llmKey, setLlmKey] = usePersistentState('vc.llm.key.v1', '');
  const [buyHistory, setBuyHistory] = usePersistentState('vc.history.v1', {});
  const [view, setView] = useState('list');
  const [booting, setBooting] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [voiceState, setVoiceState] = useState('idle');
  const [manualText, setManualText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchBooting, setSearchBooting] = useState(false);
  const searchTimerRef = useRef(null);

  const manualInputRef = useRef(null);
  const tts = useSpeechSynthesis();

  useEffect(() => {
    try {
      window.localStorage.setItem(LIST_KEY, JSON.stringify(list));
    } catch {
      /* storage unavailable */
    }
  }, [list]);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
  }, []);

  // Brief skeleton while the search "runs", then reveal results — keeps the
  // SearchView loading state honest instead of hardcoded off.
  const runSearch = useCallback((query, maxPrice) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setSearchBooting(true);
    setView('search');
    searchTimerRef.current = window.setTimeout(() => {
      setSearchQuery(query);
      setSearchMaxPrice(maxPrice);
      setSearchResults(searchCatalog(query, { maxPrice }));
      setSearchBooting(false);
    }, 450);
  }, []);

  const toastTimersRef = useRef(new Set());

  const pushToast = useCallback((toast) => {
    const id = uid();
    setToasts((prev) => [...prev, { id, type: 'info', ...toast }]);
    const timer = setTimeout(() => {
      toastTimersRef.current.delete(timer);
      setToasts((prev) => prev.filter((entry) => entry.id !== id));
    }, 4200);
    toastTimersRef.current.add(timer);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  useEffect(() => {
    const timers = toastTimersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  // Purchase history: per-product add count + last-added timestamp, used
  // for recency/frequency scoring in the Smart Suggestions panel.
  const recordHistory = useCallback(
    (product, quantity = 1) => {
      setBuyHistory((prev) => {
        const entry = prev[product.id] || { count: 0, lastAddedAt: 0 };
        return { ...prev, [product.id]: { count: entry.count + quantity, lastAddedAt: Date.now() } };
      });
    },
    [setBuyHistory],
  );

  const browserShort = useMemo(() => {
    const nav = typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
    const short = nav.split('-')[0].toLowerCase();
    return LANGUAGE_INDEX[short] ? short : 'en';
  }, []);

  const recognitionLang = useMemo(() => {
    if (selectedLang !== 'auto') return LANGUAGE_INDEX[selectedLang]?.code || 'en-US';
    return LANGUAGE_INDEX[lastDetected]?.code || LANGUAGE_INDEX[browserShort].code;
  }, [selectedLang, lastDetected, browserShort]);

  const focusManualInput = useCallback(() => {
    setTimeout(() => manualInputRef.current?.focus(), 120);
  }, []);

  const handleSpeechError = useCallback(
    ({ type }) => {
      setVoiceState('error');
      pushToast({
        type: 'error',
        title: 'Voice unavailable',
        message: SPEECH_ERROR_MESSAGES[type] || 'Something went wrong with the microphone — the text bar is ready.',
      });
      focusManualInput();
    },
    [pushToast, focusManualInput],
  );

  const addProduct = useCallback(
    (product, quantity = 1, unit = null, { lang = null, phraseCategory = 'add', silent = false, detected = null } = {}) => {
      dispatch({ type: 'ADD', product, quantity, unit });
      recordHistory(product, quantity);
      if (silent || !lang) return;
      const sub = findSubstitute(product);
      const subNote = sub ? ` If it’s sold out, try ${sub.name}.` : '';
      pushToast({
        type: 'success',
        title: `Added ${product.name}`,
        message: `${quantity} × ${unit || product.unit} · ${formatPrice(product.price)} each${subNote}`,
        ...(detected ? { detected } : { langBadge: `${lang.flag} ${lang.label}` }),
      });
      tts.speak(pickPhrase(lang.short, phraseCategory, product.name, quantity), lang.code);
    },
    [pushToast, recordHistory, tts],
  );

  const parseOnDevice = useCallback(
    (rawText, hintedShort = null) => {
      const trimmed = String(rawText || '').trim();
      if (!trimmed) return;
      setVoiceState('processing');

      const baseFallback = selectedLang !== 'auto' ? selectedLang : hintedShort || lastDetected || browserShort;
      const lang =
        selectedLang === 'auto' ? detectLanguage(trimmed, baseFallback) : languageMeta(selectedLang, 'manual');
      if (selectedLang === 'auto' && lang.source !== 'fallback' && lang.short !== lastDetected) {
        setLastDetected(lang.short);
      }
      const langTag =
        selectedLang === 'auto'
          ? { detected: { label: lang.label, code: lang.code } }
          : { langBadge: `${lang.flag} ${lang.label}` };

      const intent = parseIntent(trimmed, lang.short);
      const restock = detectRestockContext(trimmed, lang.short);
      const finish = () => setVoiceState('idle');

      const notFound = () => {
        pushToast({ type: 'error', title: 'Item not found', message: `No match for “${intent.itemName || trimmed}” in the catalog.` });
        tts.speak(pickPhrase(lang.short, 'notFound'), lang.code);
        finish();
      };

      switch (intent.action) {
        case 'ADD': {
          const segments = splitMultiItems(trimmed);
          if (segments.length > 1) {
            const added = [];
            for (const segment of segments) {
              const segIntent = parseIntent(segment, lang.short);
              if (!segIntent.itemName) continue;
              const results = searchCatalog(segIntent.itemName);
              if (results.length > 0) {
                dispatch({ type: 'ADD', product: results[0], quantity: segIntent.quantity, unit: segIntent.unit !== 'pcs' ? segIntent.unit : undefined });
                recordHistory(results[0], segIntent.quantity);
                added.push(results[0]);
              }
            }
            if (added.length === 0) {
              notFound();
              return;
            }
            const uniqueNames = [...new Map(added.map((item) => [item.id, item.name])).values()];
            pushToast({
              type: 'success',
              title: `${uniqueNames.length} item${uniqueNames.length === 1 ? '' : 's'} added to list`,
              message: uniqueNames.join(', '),
              ...langTag,
            });
            tts.speak(
              pickPhrase(lang.short, uniqueNames.length > 1 ? 'addMulti' : restock ? 'addRestock' : 'add', uniqueNames[0]),
              lang.code,
            );
            setView('list');
            finish();
            return;
          }

          if (!intent.itemName) {
            notFound();
            return;
          }
          const results = searchCatalog(intent.itemName);
          if (results.length === 0) {
            notFound();
            return;
          }
          addProduct(results[0], intent.quantity, intent.unit !== 'pcs' ? intent.unit : null, {
            lang,
            phraseCategory: restock ? 'addRestock' : 'add',
            detected: selectedLang === 'auto' ? { label: lang.label, code: lang.code } : null,
          });
          setView('list');
          finish();
          return;
        }

        case 'REMOVE': {
          const target = list.find(
            (entry) =>
              normalize(entry.name).includes(normalize(intent.itemName)) ||
              normalize(intent.itemName).includes(normalize(entry.name)),
          );
          if (!intent.itemName || !target) {
            pushToast({ type: 'error', title: 'Nothing to remove', message: `“${intent.itemName || trimmed}” isn’t on your list.` });
            tts.speak(pickPhrase(lang.short, 'notFound'), lang.code);
            finish();
            return;
          }
          dispatch({ type: 'REMOVE', id: target.id });
          setView('list');
          pushToast({ type: 'info', title: `Removed ${target.name}`, message: 'Taken off your list.', ...langTag });
          tts.speak(pickPhrase(lang.short, 'remove', target.name), lang.code);
          finish();
          return;
        }

        case 'UPDATE': {
          const updateTarget = list.find(
            (entry) =>
              normalize(entry.name).includes(normalize(intent.itemName)) ||
              normalize(intent.itemName).includes(normalize(entry.name)),
          );
          if (!intent.itemName || !updateTarget) {
            pushToast({ type: 'error', title: 'Nothing to update', message: `“${intent.itemName || trimmed}” isn’t on your list.` });
            tts.speak(pickPhrase(lang.short, 'notFound'), lang.code);
            finish();
            return;
          }
          dispatch({ type: 'SET_QTY', id: updateTarget.id, quantity: intent.quantity });
          setView('list');
          pushToast({ type: 'success', title: `Updated ${updateTarget.name}`, message: `Quantity set to ${intent.quantity}.`, ...langTag });
          tts.speak(pickPhrase(lang.short, 'update', updateTarget.name, intent.quantity), lang.code);
          finish();
          return;
        }

        case 'SEARCH': {
          runSearch(intent.itemName || trimmed, intent.maxPrice);
          finish();
          return;
        }

        case 'CLEAR': {
          dispatch({ type: 'CLEAR' });
          setView('list');
          pushToast({ type: 'info', title: 'List cleared', message: 'Every item was removed.', ...langTag });
          tts.speak(pickPhrase(lang.short, 'cleared'), lang.code);
          finish();
          return;
        }

        default:
          notFound();
      }
    },
    [addProduct, browserShort, lastDetected, list, pushToast, recordHistory, runSearch, selectedLang, setLastDetected, tts],
  );

  const applyLLMResult = useCallback(
    (llm) => {
      const code = llm.detectedLanguageCode;
      const short = code.split('-')[0].toLowerCase();
      const meta = languageMeta(short);
      const detected = { label: meta.label, code };
      setLastDetected(short);
      const finish = () => setVoiceState('idle');

      switch (llm.action) {
        case 'ADD': {
          const results = searchCatalog(llm.canonicalItem);
          if (results.length === 0) {
            pushToast({ type: 'error', title: 'Item not found', message: `No match for “${llm.canonicalItem}” in the catalog.`, detected });
            tts.speak(pickPhrase(short, 'notFound'), code);
            finish();
            return;
          }
          const product = results[0];
          dispatch({ type: 'ADD', product, quantity: llm.quantity, unit: undefined });
          recordHistory(product, llm.quantity);
          const sub = findSubstitute(product);
          const subNote = sub ? ` If it’s sold out, try ${sub.name}.` : '';
          pushToast({
            type: 'success',
            title: `Added ${product.name}`,
            message: `${llm.quantity} × ${product.unit} · ${formatPrice(product.price)} each · spoken as “${llm.originalItemSpoken}”${subNote}`,
            detected,
          });
          tts.speak(llm.replyMessage || pickPhrase(short, 'add', product.name, llm.quantity), code);
          setView('list');
          finish();
          return;
        }

        case 'REMOVE': {
          const target = list.find(
            (entry) =>
              normalize(entry.name).includes(normalize(llm.canonicalItem)) ||
              normalize(llm.canonicalItem).includes(normalize(entry.name)),
          );
          if (!target) {
            pushToast({ type: 'error', title: 'Nothing to remove', message: `“${llm.canonicalItem}” isn’t on your list.`, detected });
            tts.speak(pickPhrase(short, 'notFound'), code);
            finish();
            return;
          }
          dispatch({ type: 'REMOVE', id: target.id });
          setView('list');
          pushToast({ type: 'info', title: `Removed ${target.name}`, message: 'Taken off your list.', detected });
          tts.speak(llm.replyMessage || pickPhrase(short, 'remove', target.name), code);
          finish();
          return;
        }

        case 'SEARCH': {
          runSearch(llm.canonicalItem, null);
          if (llm.replyMessage) tts.speak(llm.replyMessage, code);
          finish();
          return;
        }

        default:
          finish();
      }
    },
    [list, pushToast, recordHistory, runSearch, setLastDetected, tts],
  );

  const handleCommand = useCallback(
    async (rawText, recognitionLocale = null) => {
      const trimmed = String(rawText || '').trim();
      if (!trimmed) return;
      setVoiceState('processing');

      // LLM refinement first (any-language transcript in → canonical English + localized reply out).
      if (llmKey) {
        try {
          const llm = await parseWithLLM(trimmed, llmKey);
          applyLLMResult(llm);
          return;
        } catch {
          // Silent degradation: the on-device auto-detect parser takes over.
        }
      }

      // On-device heuristic pipeline. The recognition locale is a free hint:
      // if the transcript lexically matches the locale's language, trust it.
      const hinted = recognitionLocale
        ? languageMeta(recognitionLocale.split('-')[0].toLowerCase()).short
        : null;
      parseOnDevice(trimmed, hinted);
    },
    [applyLLMResult, llmKey, parseOnDevice],
  );

  const retryChain = useMemo(() => {
    if (selectedLang !== 'auto') return null;
    const preferred = LANGUAGE_INDEX[lastDetected]?.code || LANGUAGE_INDEX[browserShort].code;
    return [preferred, ...RETRY_LANGUAGE_CHAIN.filter((code) => code !== preferred)];
  }, [selectedLang, lastDetected, browserShort]);

  const handleLangSwitch = useCallback(
    (code, reason) => {
      const meta = languageMeta(code.split('-')[0].toLowerCase());
      pushToast({
        type: 'info',
        title: `Retrying mic in ${meta.label}`,
        message: `Auto-switched recognition to ${code} (${reason === 'low-confidence' ? 'low-confidence transcript' : reason}).`,
      });
    },
    [pushToast],
  );

  const { supported: recognitionSupported, isListening, activeLang, toggle: toggleMic } = useSpeechRecognition({
    lang: recognitionLang,
    fallbackLangs: retryChain,
    onResult: handleCommand,
    onError: handleSpeechError,
    onStateChange: (state) => {
      if (typeof state === 'function') return;
      setVoiceState((prev) => (state === 'idle' && prev === 'processing' ? prev : state));
    },
    onLangSwitch: handleLangSwitch,
    continuous: continuousListen,
  });

  const substitutesByEntry = useMemo(() => {
    const map = {};
    for (const entry of list) {
      const product = CATALOG.find((item) => item.id === entry.productId);
      if (product && !product.inStock) {
        const sub = findSubstitute(product);
        if (sub && !list.some((other) => other.id === sub.id)) map[entry.id] = sub;
      }
    }
    return map;
  }, [list]);

  const handleManualSubmit = () => {
    const text = manualText.trim();
    if (!text) return;
    setManualText('');
    handleCommand(text);
  };

  const handleAddFromCatalog = (item) => {
    addProduct(item, 1, null, { lang: languageMeta(lastDetected || browserShort), phraseCategory: 'add' });
  };

  const langMeta = LANGUAGE_INDEX[selectedLang] || null;
  const statusText = isListening
    ? `Listening in ${activeLang}…`
    : voiceState === 'processing'
      ? 'Processing…'
      : recognitionSupported
        ? 'Tap the mic or type'
        : 'Voice offline — type below';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-blue-50/20 text-slate-800">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <Header
        listening={isListening}
        supported={recognitionSupported || tts.supported}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        view={view}
        onChangeView={setView}
        itemCount={list.length}
        llmKey={llmKey}
        onSaveLlmKey={setLlmKey}
      />

      <main className="mx-auto max-w-5xl space-y-4 px-4 pb-64 pt-6 sm:space-y-6 sm:px-6 md:px-8">
        {booting ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : view === 'list' ? (
          <>
            <MyListView
              list={list}
              onQty={(entry, quantity) => dispatch({ type: 'SET_QTY', id: entry.id, quantity })}
              onToggle={(entry) => dispatch({ type: 'TOGGLE', id: entry.id })}
              onRemove={(entry) => dispatch({ type: 'REMOVE', id: entry.id })}
              substitutesByEntry={substitutesByEntry}
              onAddSubstitute={handleAddFromCatalog}
              onClear={() => {
                dispatch({ type: 'CLEAR' });
                pushToast({ type: 'info', title: 'List cleared', message: 'Every item was removed.' });
              }}
            />
            <SuggestionsPanel list={list} history={buyHistory} onPick={handleAddFromCatalog} />
          </>
        ) : (
          <SearchView
            results={searchResults}
            query={searchQuery}
            maxPrice={searchMaxPrice}
            onAdd={handleAddFromCatalog}
            booting={searchBooting}
          />
        )}
      </main>

      <VoiceBar
        value={manualText}
        onChange={setManualText}
        onSubmit={handleManualSubmit}
        onMicToggle={toggleMic}
        listening={isListening}
        processing={voiceState === 'processing'}
        supported={recognitionSupported}
        langLabel={langMeta ? `${langMeta.flag} ${langMeta.label}` : '🌐 Auto-detect'}
        statusText={statusText}
        inputRef={manualInputRef}
        onDemo={handleCommand}
        continuous={continuousListen}
        onToggleContinuous={() => setContinuousListen((v) => !v)}
      />

      <footer className="pointer-events-none fixed bottom-1 left-1/2 z-40 -translate-x-1/2 text-[10px] text-slate-400">
        Voice Cart · {CATALOG.length} items · {DEPARTMENTS.length} departments · en / es / fr / hi / de
      </footer>
    </div>
  );
}
