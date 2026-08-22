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
  // ---- Fresh Produce ----
  { id: 'organic-apples', name: 'Organic Apples', category: 'produce', price: 4.29, unit: 'lb', brand: 'Orchard Crate', isOrganic: true, inStock: true, season: ['summer', 'fall'], substitutes: ['Strawberries'] },
  { id: 'bananas', name: 'Bananas', category: 'produce', price: 1.89, unit: 'lb', brand: 'Tropicana Farms', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'red-onions', name: 'Red Onions', category: 'produce', price: 2.49, unit: 'lb', brand: 'Field & Vine', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'roma-tomatoes', name: 'Roma Tomatoes', category: 'produce', price: 3.29, unit: 'lb', brand: 'Sunny Acres', isOrganic: false, inStock: true, season: ['summer'], substitutes: ['Roma Tomatoes'] },
  { id: 'baby-spinach', name: 'Baby Spinach', category: 'produce', price: 3.49, unit: 'bag', brand: 'GreenLeaf Co.', isOrganic: true, inStock: true, season: ['spring', 'fall'], substitutes: ['Kale Bunches'] },
  { id: 'kale-bunches', name: 'Kale Bunches', category: 'produce', price: 2.99, unit: 'bunch', brand: 'GreenLeaf Co.', isOrganic: true, inStock: true, season: ['fall', 'winter'], substitutes: ['Baby Spinach'] },
  { id: 'hass-avocados', name: 'Hass Avocados', category: 'produce', price: 5.49, unit: 'bag', brand: 'Verde Grove', isOrganic: false, inStock: true, season: ['spring', 'summer'], substitutes: [] },
  { id: 'strawberries', name: 'Strawberries', category: 'produce', price: 4.99, unit: 'pack', brand: 'Berry Patch', isOrganic: true, inStock: true, season: ['spring', 'summer'], substitutes: ['Organic Apples'] },
  { id: 'lemons', name: 'Lemons', category: 'produce', price: 3.79, unit: 'bag', brand: 'Citrus Grove', isOrganic: false, inStock: true, season: ['winter', 'spring'], substitutes: [] },
  { id: 'carrots', name: 'Carrots', category: 'produce', price: 2.29, unit: 'bag', brand: 'Root Cellar', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },

  // ---- Dairy & Eggs ----
  { id: 'whole-milk', name: 'Whole Milk', category: 'dairy-eggs', price: 3.29, unit: 'carton', brand: 'Meadow Fresh', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Oat Milk', 'Almond Milk'] },
  { id: 'oat-milk', name: 'Oat Milk', category: 'dairy-eggs', price: 4.49, unit: 'carton', brand: 'PureHarvest', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Almond Milk'] },
  { id: 'almond-milk', name: 'Almond Milk', category: 'dairy-eggs', price: 4.19, unit: 'carton', brand: 'NutBloom', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Oat Milk'] },
  { id: 'greek-yogurt', name: 'Greek Yogurt', category: 'dairy-eggs', price: 4.79, unit: 'tub', brand: 'Olympus Dairy', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Cottage Cheese'] },
  { id: 'cheddar-cheese', name: 'Cheddar Cheese', category: 'dairy-eggs', price: 5.29, unit: 'block', brand: 'Golden Rind', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Mozzarella'] },
  { id: 'mozzarella', name: 'Mozzarella', category: 'dairy-eggs', price: 4.99, unit: 'pack', brand: 'Bella Italia', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Cheddar Cheese'] },
  { id: 'free-range-eggs', name: 'Free-Range Eggs', category: 'dairy-eggs', price: 4.49, unit: 'dozen', brand: 'Happy Hen', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'butter', name: 'Butter', category: 'dairy-eggs', price: 3.99, unit: 'pack', brand: 'Meadow Fresh', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Extra Virgin Olive Oil'] },
  { id: 'heavy-cream', name: 'Heavy Cream', category: 'dairy-eggs', price: 3.49, unit: 'carton', brand: 'Meadow Fresh', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'cottage-cheese', name: 'Cottage Cheese', category: 'dairy-eggs', price: 3.89, unit: 'tub', brand: 'Olympus Dairy', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Greek Yogurt'] },

  // ---- Meat & Seafood ----
  { id: 'chicken-breast', name: 'Chicken Breast', category: 'meat-seafood', price: 7.99, unit: 'lb', brand: 'Prairie Poultry', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Turkey Slices'] },
  { id: 'ground-beef', name: 'Ground Beef', category: 'meat-seafood', price: 6.49, unit: 'lb', brand: 'Ranch Reserve', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Ground Turkey'] },
  { id: 'ground-turkey', name: 'Ground Turkey', category: 'meat-seafood', price: 5.99, unit: 'lb', brand: 'Prairie Poultry', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Ground Beef'] },
  { id: 'salmon-fillet', name: 'Salmon Fillet', category: 'meat-seafood', price: 11.99, unit: 'lb', brand: 'North Catch', isOrganic: false, inStock: true, season: ['spring', 'summer'], substitutes: ['Tuna Steaks'] },
  { id: 'shrimp', name: 'Shrimp', category: 'meat-seafood', price: 9.99, unit: 'lb', brand: 'North Catch', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'turkey-slices', name: 'Turkey Slices', category: 'meat-seafood', price: 5.49, unit: 'pack', brand: 'Deli Prime', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Chicken Breast'] },
  { id: 'pork-chops', name: 'Pork Chops', category: 'meat-seafood', price: 6.99, unit: 'lb', brand: 'Ranch Reserve', isOrganic: false, inStock: false, season: ['fall', 'winter'], substitutes: ['Chicken Breast'] },
  { id: 'bacon', name: 'Bacon', category: 'meat-seafood', price: 6.29, unit: 'pack', brand: 'Smokehouse Co.', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'tuna-steaks', name: 'Tuna Steaks', category: 'meat-seafood', price: 10.49, unit: 'lb', brand: 'North Catch', isOrganic: false, inStock: true, season: ['summer'], substitutes: ['Salmon Fillet'] },

  // ---- Bakery & Bread ----
  { id: 'whole-wheat-bread', name: 'Whole Wheat Bread', category: 'bakery', price: 3.49, unit: 'loaf', brand: 'Hearth & Grain', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Sourdough Loaf'] },
  { id: 'sourdough-loaf', name: 'Sourdough Loaf', category: 'bakery', price: 4.99, unit: 'loaf', brand: 'Hearth & Grain', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Whole Wheat Bread'] },
  { id: 'bagels', name: 'Bagels', category: 'bakery', price: 3.99, unit: 'pack', brand: 'City Bakehouse', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Hamburger Buns'] },
  { id: 'butter-croissants', name: 'Butter Croissants', category: 'bakery', price: 5.49, unit: 'pack', brand: 'Petit Four', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'flour-tortillas', name: 'Flour Tortillas', category: 'bakery', price: 2.99, unit: 'pack', brand: 'Casa Blanca', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'hamburger-buns', name: 'Hamburger Buns', category: 'bakery', price: 3.29, unit: 'pack', brand: 'City Bakehouse', isOrganic: false, inStock: true, season: ['summer'], substitutes: ['Bagels'] },
  { id: 'french-baguette', name: 'French Baguette', category: 'bakery', price: 2.79, unit: 'loaf', brand: 'Petit Four', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Sourdough Loaf'] },
  { id: 'blueberry-muffins', name: 'Blueberry Muffins', category: 'bakery', price: 4.79, unit: 'pack', brand: 'City Bakehouse', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'rye-bread', name: 'Rye Bread', category: 'bakery', price: 3.79, unit: 'loaf', brand: 'Hearth & Grain', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Whole Wheat Bread'] },

  // ---- Pantry Staples ----
  { id: 'spaghetti-pasta', name: 'Spaghetti Pasta', category: 'pantry', price: 1.99, unit: 'box', brand: 'Bella Italia', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Quinoa'] },
  { id: 'basmati-rice', name: 'Basmati Rice', category: 'pantry', price: 6.99, unit: 'bag', brand: 'Golden Harvest', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Quinoa'] },
  { id: 'extra-virgin-olive-oil', name: 'Extra Virgin Olive Oil', category: 'pantry', price: 9.49, unit: 'bottle', brand: 'Oliveto', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'pantry', price: 3.99, unit: 'jar', brand: 'NutHouse', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'all-purpose-flour', name: 'All-Purpose Flour', category: 'pantry', price: 3.49, unit: 'bag', brand: 'Mill & Main', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'canned-black-beans', name: 'Canned Black Beans', category: 'pantry', price: 1.29, unit: 'can', brand: 'Casa Blanca', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'wildflower-honey', name: 'Wildflower Honey', category: 'pantry', price: 6.49, unit: 'jar', brand: 'Meadow Bee', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'soy-sauce', name: 'Soy Sauce', category: 'pantry', price: 2.99, unit: 'bottle', brand: 'Umami Works', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'quinoa', name: 'Quinoa', category: 'pantry', price: 5.99, unit: 'box', brand: 'Golden Harvest', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Basmati Rice'] },
  { id: 'tomato-sauce', name: 'Tomato Sauce', category: 'pantry', price: 1.79, unit: 'jar', brand: 'Bella Italia', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },

  // ---- Frozen Foods ----
  { id: 'frozen-pizza', name: 'Frozen Pizza', category: 'frozen', price: 5.99, unit: 'box', brand: 'FireStone', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'vanilla-ice-cream', name: 'Vanilla Ice Cream', category: 'frozen', price: 4.99, unit: 'tub', brand: 'Churn & Co.', isOrganic: false, inStock: false, season: ['summer'], substitutes: ['Frozen Mixed Berries'] },
  { id: 'frozen-peas', name: 'Frozen Peas', category: 'frozen', price: 2.49, unit: 'bag', brand: 'Arctic Garden', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Frozen Broccoli'] },
  { id: 'fish-sticks', name: 'Fish Sticks', category: 'frozen', price: 4.49, unit: 'box', brand: 'North Catch', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'frozen-mixed-berries', name: 'Frozen Mixed Berries', category: 'frozen', price: 5.49, unit: 'bag', brand: 'Arctic Garden', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Strawberries'] },
  { id: 'dumplings', name: 'Dumplings', category: 'frozen', price: 5.29, unit: 'pack', brand: 'Umami Works', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'waffles', name: 'Waffles', category: 'frozen', price: 3.29, unit: 'box', brand: 'Morning Crate', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'frozen-broccoli', name: 'Frozen Broccoli', category: 'frozen', price: 2.29, unit: 'bag', brand: 'Arctic Garden', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Frozen Peas'] },
  { id: 'burritos', name: 'Burritos', category: 'frozen', price: 5.79, unit: 'box', brand: 'Casa Blanca', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },

  // ---- Snacks & Sweets ----
  { id: 'potato-chips', name: 'Potato Chips', category: 'snacks', price: 3.49, unit: 'bag', brand: 'Crunch Lab', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Pretzels', 'Popcorn'] },
  { id: 'dark-chocolate', name: 'Dark Chocolate', category: 'snacks', price: 3.99, unit: 'bar', brand: 'Cacao Noir', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'granola-bars', name: 'Granola Bars', category: 'snacks', price: 4.29, unit: 'box', brand: 'Trail Crate', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Trail Mix'] },
  { id: 'pretzels', name: 'Pretzels', category: 'snacks', price: 2.99, unit: 'bag', brand: 'Crunch Lab', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Potato Chips'] },
  { id: 'cookies', name: 'Cookies', category: 'snacks', price: 3.79, unit: 'pack', brand: 'Sweet Oven', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'trail-mix', name: 'Trail Mix', category: 'snacks', price: 5.49, unit: 'bag', brand: 'Trail Crate', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Granola Bars'] },
  { id: 'gummy-bears', name: 'Gummy Bears', category: 'snacks', price: 2.49, unit: 'bag', brand: 'Sweet Oven', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'popcorn', name: 'Popcorn', category: 'snacks', price: 3.29, unit: 'box', brand: 'Crunch Lab', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Potato Chips'] },
  { id: 'salsa', name: 'Salsa', category: 'snacks', price: 3.19, unit: 'jar', brand: 'Casa Blanca', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },

  // ---- Beverages ----
  { id: 'orange-juice', name: 'Orange Juice', category: 'beverages', price: 4.29, unit: 'bottle', brand: 'Citrus Grove', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Lemonade'] },
  { id: 'coffee-beans', name: 'Coffee Beans', category: 'beverages', price: 11.99, unit: 'bag', brand: 'Roast House', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Green Tea'] },
  { id: 'green-tea', name: 'Green Tea', category: 'beverages', price: 4.49, unit: 'box', brand: 'Leaf & Steep', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Coffee Beans'] },
  { id: 'sparkling-water', name: 'Sparkling Water', category: 'beverages', price: 3.99, unit: 'pack', brand: 'Fizz Peak', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'cola', name: 'Cola', category: 'beverages', price: 4.99, unit: 'pack', brand: 'Fizz Peak', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Sparkling Water'] },
  { id: 'coconut-water', name: 'Coconut Water', category: 'beverages', price: 3.49, unit: 'bottle', brand: 'Island Press', isOrganic: true, inStock: true, season: ['summer'], substitutes: [] },
  { id: 'lemonade', name: 'Lemonade', category: 'beverages', price: 3.79, unit: 'bottle', brand: 'Citrus Grove', isOrganic: false, inStock: true, season: ['summer'], substitutes: ['Orange Juice'] },
  { id: 'energy-drink', name: 'Energy Drink', category: 'beverages', price: 2.99, unit: 'can', brand: 'Volt Labs', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Coffee Beans'] },
  { id: 'kombucha', name: 'Kombucha', category: 'beverages', price: 4.29, unit: 'bottle', brand: 'Fermentary', isOrganic: true, inStock: false, season: ['all'], substitutes: ['Sparkling Water'] },

  // ---- Personal Care ----
  { id: 'shampoo', name: 'Shampoo', category: 'personal-care', price: 6.99, unit: 'bottle', brand: 'Botanica', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Body Wash'] },
  { id: 'toothpaste', name: 'Toothpaste', category: 'personal-care', price: 3.49, unit: 'tube', brand: 'BrightSmile', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'body-wash', name: 'Body Wash', category: 'personal-care', price: 5.99, unit: 'bottle', brand: 'Botanica', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Hand Soap'] },
  { id: 'hand-soap', name: 'Hand Soap', category: 'personal-care', price: 2.99, unit: 'bottle', brand: 'Botanica', isOrganic: true, inStock: true, season: ['all'], substitutes: ['Body Wash'] },
  { id: 'deodorant', name: 'Deodorant', category: 'personal-care', price: 4.99, unit: 'stick', brand: 'Fresh Peak', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'face-moisturizer', name: 'Face Moisturizer', category: 'personal-care', price: 12.99, unit: 'jar', brand: 'Botanica', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'sunscreen', name: 'Sunscreen', category: 'personal-care', price: 8.99, unit: 'tube', brand: 'SunGuard', isOrganic: false, inStock: true, season: ['summer'], substitutes: [] },
  { id: 'razors', name: 'Razors', category: 'personal-care', price: 9.49, unit: 'pack', brand: 'SharpCo', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },

  // ---- Household Essentials ----
  { id: 'paper-towels', name: 'Paper Towels', category: 'household', price: 7.99, unit: 'roll', brand: 'HomeSoft', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'dish-soap', name: 'Dish Soap', category: 'household', price: 3.49, unit: 'bottle', brand: 'SudsCo', isOrganic: false, inStock: true, season: ['all'], substitutes: ['All-Purpose Cleaner'] },
  { id: 'laundry-detergent', name: 'Laundry Detergent', category: 'household', price: 11.49, unit: 'bottle', brand: 'HomeSoft', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'trash-bags', name: 'Trash Bags', category: 'household', price: 8.49, unit: 'box', brand: 'ToughSack', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'all-purpose-cleaner', name: 'All-Purpose Cleaner', category: 'household', price: 4.29, unit: 'bottle', brand: 'SudsCo', isOrganic: false, inStock: true, season: ['all'], substitutes: ['Dish Soap'] },
  { id: 'sponges', name: 'Sponges', category: 'household', price: 2.99, unit: 'pack', brand: 'SudsCo', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'aluminum-foil', name: 'Aluminum Foil', category: 'household', price: 4.49, unit: 'roll', brand: 'WrapRight', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'light-bulbs', name: 'Light Bulbs', category: 'household', price: 6.99, unit: 'pack', brand: 'LumenWorks', isOrganic: false, inStock: false, season: ['all'], substitutes: [] },

  // ---- Baby Care ----
  { id: 'baby-diapers', name: 'Baby Diapers', category: 'baby', price: 12.99, unit: 'pack', brand: 'Little Cloud', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'baby-wipes', name: 'Baby Wipes', category: 'baby', price: 4.99, unit: 'pack', brand: 'Little Cloud', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'baby-formula', name: 'Baby Formula', category: 'baby', price: 18.99, unit: 'can', brand: 'NurtureLab', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'baby-shampoo', name: 'Baby Shampoo', category: 'baby', price: 5.49, unit: 'bottle', brand: 'Little Cloud', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'baby-food-puree', name: 'Baby Food Puree', category: 'baby', price: 2.49, unit: 'jar', brand: 'NurtureLab', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'diaper-rash-cream', name: 'Diaper Rash Cream', category: 'baby', price: 6.99, unit: 'tube', brand: 'Little Cloud', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'baby-lotion', name: 'Baby Lotion', category: 'baby', price: 5.99, unit: 'bottle', brand: 'Little Cloud', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },

  // ---- Pet Supplies ----
  { id: 'dog-kibble', name: 'Dog Kibble', category: 'pet', price: 16.99, unit: 'bag', brand: 'WildBite', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'cat-food', name: 'Cat Food', category: 'pet', price: 12.49, unit: 'bag', brand: 'WildBite', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'cat-litter', name: 'Cat Litter', category: 'pet', price: 10.99, unit: 'box', brand: 'TidyPaws', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'dog-treats', name: 'Dog Treats', category: 'pet', price: 5.99, unit: 'bag', brand: 'WildBite', isOrganic: true, inStock: true, season: ['all'], substitutes: [] },
  { id: 'pet-shampoo', name: 'Pet Shampoo', category: 'pet', price: 7.49, unit: 'bottle', brand: 'TidyPaws', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'fish-flakes', name: 'Fish Flakes', category: 'pet', price: 3.99, unit: 'jar', brand: 'AquaLife', isOrganic: false, inStock: true, season: ['all'], substitutes: [] },
  { id: 'bird-seed', name: 'Bird Seed', category: 'pet', price: 6.49, unit: 'bag', brand: 'AquaLife', isOrganic: false, inStock: false, season: ['all'], substitutes: [] },
];

/* ---------------------------------------------------------------------------
 * CROSS-LANGUAGE ALIASES — regional terms mapped to canonical English terms
 * Keys are pre-normalized (lowercase, accents stripped). Devanagari is kept.
 * -------------------------------------------------------------------------*/

const ALIASES = {
  es: {
    leche: 'milk', pan: 'bread', huevos: 'eggs', huevo: 'eggs', manzanas: 'apples', manzana: 'apples',
    arroz: 'rice', queso: 'cheese', pollo: 'chicken', mantequilla: 'butter', yogur: 'yogurt',
    cafe: 'coffee', cebolla: 'onion', cebollas: 'onion', tomate: 'tomatoes', tomates: 'tomatoes',
    fresas: 'strawberries', jugo: 'juice', agua: 'water', chocolate: 'chocolate', galletas: 'cookies',
    pasta: 'pasta', salmon: 'salmon', helado: 'ice cream', aceite: 'olive oil', miel: 'honey',
    te: 'tea', avena: 'oat milk', tocino: 'bacon', camarones: 'shrimp', espinaca: 'spinach',
    zanahorias: 'carrots', limones: 'lemons', aguacate: 'avocados', aguacates: 'avocados',
  },
  fr: {
    lait: 'milk', pain: 'bread', oeufs: 'eggs', oeuf: 'eggs', pommes: 'apples', pomme: 'apples',
    riz: 'rice', fromage: 'cheese', poulet: 'chicken', beurre: 'butter', yaourt: 'yogurt',
    cafe: 'coffee', oignon: 'onion', oignons: 'onion', tomates: 'tomatoes', tomate: 'tomatoes',
    fraises: 'strawberries', jus: 'juice', eau: 'water', chocolat: 'chocolate', biscuits: 'cookies',
    pates: 'pasta', saumon: 'salmon', glace: 'ice cream', huile: 'olive oil', miel: 'honey',
    the: 'tea', 'lait davoine': 'oat milk', bacon: 'bacon', crevettes: 'shrimp', epinards: 'spinach',
    carottes: 'carrots', citrons: 'lemons', avocat: 'avocados', avocats: 'avocados',
  },
  hi: {
    doodh: 'milk', dudh: 'milk', 'दूध': 'milk', pyaz: 'onion', pyaaz: 'onion', 'प्याज़': 'onion', 'प्याज': 'onion',
    seb: 'apples', 'सेब': 'apples', ande: 'eggs', anda: 'eggs', 'अंडे': 'eggs',
    palak: 'spinach', 'पालक': 'spinach', tamatar: 'tomatoes', 'टमाटर': 'tomatoes',
    chai: 'tea', 'चाय': 'tea', chawal: 'rice', 'चावल': 'rice', makkhan: 'butter', 'मक्खन': 'butter',
    dahi: 'yogurt', 'दही': 'yogurt', atta: 'flour', 'आटा': 'flour', kela: 'bananas', 'केला': 'bananas',
    gajar: 'carrots', 'गाजर': 'carrots', nimbu: 'lemons', 'नींबू': 'lemons',
    biscuit: 'cookies', coffee: 'coffee', 'कॉफ़ी': 'coffee', chocolate: 'chocolate', 'चॉकलेट': 'chocolate',
    avocados: 'avocados', shimla: 'capsicum',
  },
  de: {
    milch: 'milk', brot: 'bread', eier: 'eggs', ei: 'eggs', apfel: 'apples', apfeln: 'apples',
    reis: 'rice', kase: 'cheese', haehnchen: 'chicken', huhn: 'chicken', butter: 'butter',
    joghurt: 'yogurt', kaffee: 'coffee', zwiebeln: 'onion', zwiebel: 'onion', tomaten: 'tomatoes',
    erdbeeren: 'strawberries', saft: 'juice', wasser: 'water', schokolade: 'chocolate', kekse: 'cookies',
    nudeln: 'pasta', lachs: 'salmon', eis: 'ice cream', oel: 'olive oil', honig: 'honey',
    tee: 'tea', hafermilch: 'oat milk', speck: 'bacon', garnelen: 'shrimp', spinat: 'spinach',
    karotten: 'carrots', zitronen: 'lemons', avocado: 'avocados', avocados: 'avocados',
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
  outer: for (const action of ['clear', 'search', 'remove', 'add']) {
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
    if (aliasTable[token]) return aliasTable[token];
    if (STOPWORDS.has(token) || NUMBER_WORDS[token] !== undefined || UNIT_LOOKUP[token]) return null;
    return token;
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

const lexiconScore = (normText, short) => {
  const tokens = normText.split(' ');
  let score = 0;
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
  for (const term of Object.keys(ALIASES[short] || {})) {
    if (tokens.includes(term)) score += 3;
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
  if (best.short && best.score >= 3) return languageMeta(best.short, 'lexicon');
  return languageMeta(fallbackShort, 'fallback');
}

/* ---------------------------------------------------------------------------
 * CATALOG SEARCH & SUBSTITUTES
 * -------------------------------------------------------------------------*/

const singular = (word) => {
  const n = normalize(word);
  if (n.endsWith('ies') && n.length > 4) return `${n.slice(0, -3)}y`;
  if (n.endsWith('s') && !n.endsWith('ss') && n.length > 3) return n.slice(0, -1);
  return n;
};

const tokenize = (query) =>
  String(query || '')
    .toLowerCase()
    .split(/[\s.,;:!?¿¡'"’“”()\[\]]+/)
    .filter(Boolean);

export function searchCatalog(rawQuery, { maxPrice = null } = {}) {
  const query = normalize(rawQuery);
  const organicOnly = /\borganic\b|\bbio\b|\borganica\b|\borganico\b/.test(query);
  const tokens = tokenize(query).filter((t) => !['organic', 'bio', 'organica', 'organico'].includes(t));

  const scored = CATALOG.map((item) => {
    if (organicOnly && !item.isOrganic) return null;
    if (maxPrice !== null && item.price > maxPrice) return null;

    const haystackTokens = [...tokenize(item.name), ...tokenize(item.brand), tokenize(DEPARTMENT_INDEX[item.category]?.label || '')];
    const hay = haystackTokens.map(normalize);
    let score = 0;
    for (const rawToken of tokens) {
      const t = normalize(rawToken);
      if (!t) continue;
      const hits = hay.some(
        (h) => h === t || h === singular(t) || singular(h) === t || h.startsWith(t) || h.startsWith(singular(t)),
      );
      if (hits) score += hay.some((h) => h === t) ? 6 : 3;
    }
    if (score === 0) return null;
    return { ...item, score };
  }).filter(Boolean);

  return scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).map(({ score, ...item }) => item);
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
    cleared: [() => 'Fresh start — the list is cleared!', () => 'All wiped clean!'],
    notFound: [() => 'Hmm, I couldn’t find that one — try a different name?', () => 'Sorry, that didn’t match anything in the store.'],
  },
  es: {
    add: [(name) => `¡Listo, agregué ${name}!`, (name) => `¡Anotado! ${name} está en la lista.`],
    addRestock: [(name) => `¡Entendido! Agregué ${name} antes de que te quedes sin nada.`, (name) => `¡Voy! Reponiendo ${name}.`],
    addMulti: [() => '¡Hecho, agregué todo!', () => '¡Genial, todo en la lista!'],
    remove: [(name) => `¡Puf! Quité ${name} de la lista.`, (name) => `${name} fuera de la lista.`],
    cleared: [() => '¡Lista vaciada!', () => '¡Todo limpio!'],
    notFound: [() => 'No encontré eso, ¿puedes repetirlo?', () => 'Eso no está en la tienda.'],
  },
  fr: {
    add: [(name) => `C'est bon, j'ai ajouté ${name} !`, (name) => `${name} est sur la liste !`],
    addRestock: [(name) => `Bien joué, j'ai ajouté ${name} avant la panne sèche !`, (name) => `Je m'en occupe, je rajoute ${name}.`],
    addMulti: [() => 'Voilà, tout est ajouté !', () => 'Parfait, tout est sur la liste.'],
    remove: [(name) => `Pouf ! J'ai retiré ${name} de la liste.`, (name) => `${name}, c'est enlevé !`],
    cleared: [() => 'La liste est vidée !', () => 'Tout est nettoyé !'],
    notFound: [() => 'Je n’ai pas trouvé ça, tu peux reformuler ?', () => 'Ça n’existe pas en magasin.'],
  },
  hi: {
    add: [(name) => `Ho gaya, ${name} list mein add kar diya!`, (name) => `${name} list par hai, badhiya choice!`],
    addRestock: [(name) => `Samajh gaya, khatam hone se pehle ${name} add kar diya!`, (name) => `Ho gaya, ${name} dobara le aayenge.`],
    addMulti: [() => 'Ho gaya, sab kuch add kar diya!', () => 'Badhiya, sab list par daal diya!'],
    remove: [(name) => `Poof! ${name} list se hata diya.`, (name) => `${name} hata diya, done!`],
    cleared: [() => 'List ekdum saaf ho gayi!', () => 'Sab hata diya, fresh start!'],
    notFound: [() => 'Yeh item nahi mila, doosra naam try karein?', () => 'Maaf kijiye, woh store mein nahi hai.'],
  },
  de: {
    add: [(name) => `Alles klar, ${name} ist auf der Liste!`, (name) => `Erledigt, ${name} hinzugefügt!`],
    addRestock: [(name) => `Verstanden, ${name} hinzugefügt, bevor alles leer ist!`, (name) => `Ich kümmere mich darum — ${name} kommt auf die Liste.`],
    addMulti: [() => 'Fertig, alles hinzugefügt!', () => 'Super, alles landet auf deiner Liste.'],
    remove: [(name) => `Puff! ${name} von der Liste entfernt.`, (name) => `${name} ist raus aus der Liste!`],
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

export function useSpeechRecognition({ lang, onResult, onError, onStateChange }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
  const supported = Boolean(SpeechRecognition);

  const stop = useCallback(() => {
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
    try {
      recognitionRef.current?.abort();
    } catch {
      /* nothing to abort */
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript.trim()) onResult?.(transcript.trim());
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      onStateChange?.('error');
      onError?.({ type: event.error || 'unknown', message: event.error });
    };
    recognition.onend = () => {
      setIsListening(false);
      onStateChange?.((prev) => (prev === 'processing' ? 'processing' : 'idle'));
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
      onStateChange?.('listening');
    } catch {
      onError?.({ type: 'start-failed', message: 'Could not start the microphone.' });
    }
  }, [supported, lang, onResult, onError, onStateChange]);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  useEffect(() => () => {
    try {
      recognitionRef.current?.abort();
    } catch {
      /* cleanup best-effort */
    }
  }, []);

  return { supported, isListening, start, stop, toggle };
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
      {toast.langBadge && (
        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold">
          {toast.langBadge}
        </span>
      )}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-full p-1 opacity-60 transition hover:opacity-100"
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
    <div className="animate-pulse rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="h-4 w-2/3 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
    </div>
  );
}

function EmptyListState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
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
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-600"
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
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-600"
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
    <div className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg animate-fade-in-down">
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
            className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
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
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3 text-amber-800 ring-1 ring-amber-100">
          <span className="flex items-center gap-2 text-xs font-medium">
            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
            Substitute available: <span className="font-semibold">{substitute.name}</span> ({formatPrice(substitute.price)})
          </span>
          <button
            type="button"
            onClick={() => onAddSubstitute(substitute)}
            className="shrink-0 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-700"
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
          <section key={dept.id} className="space-y-3">
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
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
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
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
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
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg animate-fade-in-down">
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
  return (
    <button
      type="button"
      onClick={() => onPick(item)}
      className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-blue-50 p-3 text-left text-sm font-medium text-blue-800 ring-1 ring-blue-100 transition hover:bg-blue-100 active:scale-[0.98]"
    >
      <Plus className="h-3.5 w-3.5 text-blue-500" />
      <span>
        {item.name}
        {label && <span className="block text-[10px] font-normal text-blue-500">{label}</span>}
      </span>
    </button>
  );
}

function SuggestionsPanel({ list, onPick }) {
  const listIds = useMemo(() => new Set(list.map((entry) => entry.id)), [list]);
  const season = currentSeason();

  const historyPicks = useMemo(() => {
    const categories = new Set(list.map((entry) => entry.category));
    if (categories.size === 0) return [];
    return CATALOG.filter((item) => categories.has(item.category) && !listIds.has(item.id) && item.inStock).slice(0, 3);
  }, [list, listIds]);

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

  if (historyPicks.length + seasonalPicks.length + substitutePicks.length === 0) return null;

  const sections = [
    { icon: History, title: 'Based on your list', items: historyPicks, label: 'frequently bought together' },
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
        <div key={title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Icon className="h-3.5 w-3.5 text-blue-500" />
            {title}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {items.map((item) => (
              <SuggestionChip key={`${title}-${item.id}`} item={item} label={label} onPick={onPick} />
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

      <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-4 shadow-xl shadow-blue-900/10 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Globe className="h-3 w-3" />
            {langLabel}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            {listening && <span className="flex gap-0.5">
              <span className="h-2.5 w-0.5 animate-pulse rounded bg-rose-500" />
              <span className="h-3.5 w-0.5 animate-pulse rounded bg-rose-500 [animation-delay:150ms]" />
              <span className="h-2 w-0.5 animate-pulse rounded bg-rose-500 [animation-delay:300ms]" />
            </span>}
            {statusText}
          </span>
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

function Header({ listening, supported, selectedLang, onSelectLang, view, onChangeView, itemCount }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
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
        </div>

        <div className="ml-auto flex items-center gap-2">
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
  const [lastDetected, setLastDetected] = usePersistentState('vc.detected.v1', 'en');
  const [view, setView] = useState('list');
  const [booting, setBooting] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [voiceState, setVoiceState] = useState('idle');
  const [manualText, setManualText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

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

  const pushToast = useCallback((toast) => {
    const id = uid();
    setToasts((prev) => [...prev, { id, type: 'info', ...toast }]);
    setTimeout(() => setToasts((prev) => prev.filter((entry) => entry.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

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
    (product, quantity = 1, unit = null, { lang = null, phraseCategory = 'add', silent = false } = {}) => {
      dispatch({ type: 'ADD', product, quantity, unit });
      if (silent || !lang) return;
      const sub = findSubstitute(product);
      const subNote = sub ? ` If it’s sold out, try ${sub.name}.` : '';
      pushToast({
        type: 'success',
        title: `Added ${product.name}`,
        message: `${quantity} × ${unit || product.unit} · ${formatPrice(product.price)} each${subNote}`,
        langBadge: `${lang.flag} ${lang.label}`,
      });
      tts.speak(pickPhrase(lang.short, phraseCategory, product.name, quantity), lang.code);
    },
    [pushToast, tts],
  );

  const handleCommand = useCallback(
    (rawText) => {
      const trimmed = String(rawText || '').trim();
      if (!trimmed) return;
      setVoiceState('processing');

      const fallbackShort = selectedLang !== 'auto' ? selectedLang : lastDetected || browserShort;
      const lang =
        selectedLang === 'auto' ? detectLanguage(trimmed, fallbackShort) : languageMeta(selectedLang, 'manual');
      if (selectedLang === 'auto' && lang.source !== 'fallback' && lang.short !== lastDetected) {
        setLastDetected(lang.short);
      }

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
              langBadge: `${lang.flag} ${lang.label}`,
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
          pushToast({ type: 'info', title: `Removed ${target.name}`, message: 'Taken off your list.', langBadge: `${lang.flag} ${lang.label}` });
          tts.speak(pickPhrase(lang.short, 'remove', target.name), lang.code);
          finish();
          return;
        }

        case 'SEARCH': {
          const results = searchCatalog(intent.itemName, { maxPrice: intent.maxPrice });
          setSearchQuery(intent.itemName || trimmed);
          setSearchMaxPrice(intent.maxPrice);
          setSearchResults(results);
          setView('search');
          finish();
          return;
        }

        case 'CLEAR': {
          dispatch({ type: 'CLEAR' });
          setView('list');
          pushToast({ type: 'info', title: 'List cleared', message: 'Every item was removed.', langBadge: `${lang.flag} ${lang.label}` });
          tts.speak(pickPhrase(lang.short, 'cleared'), lang.code);
          finish();
          return;
        }

        default:
          notFound();
      }
    },
    [addProduct, browserShort, lastDetected, list, pushToast, selectedLang, setLastDetected, tts],
  );

  const { supported: recognitionSupported, isListening, toggle: toggleMic } = useSpeechRecognition({
    lang: recognitionLang,
    onResult: handleCommand,
    onError: handleSpeechError,
    onStateChange: (state) => {
      if (typeof state === 'function') return;
      setVoiceState((prev) => (state === 'idle' && prev === 'processing' ? prev : state));
    },
  });

  const substitutesByEntry = useMemo(() => {
    const map = {};
    for (const entry of list) {
      const product = CATALOG.find((item) => item.id === entry.productId);
      const sub = findSubstitute(product);
      if (sub && !list.some((other) => other.id === sub.id)) map[entry.id] = sub;
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
    ? 'Listening…'
    : voiceState === 'processing'
      ? 'Processing…'
      : recognitionSupported
        ? 'Tap the mic or type'
        : 'Voice offline — type below';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <Header
        listening={isListening}
        supported={recognitionSupported || tts.supported}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        view={view}
        onChangeView={setView}
        itemCount={list.length}
      />

      <main className="mx-auto max-w-3xl space-y-6 px-4 pb-64 pt-6">
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
            <SuggestionsPanel list={list} onPick={handleAddFromCatalog} />
          </>
        ) : (
          <SearchView
            results={searchResults}
            query={searchQuery}
            maxPrice={searchMaxPrice}
            onAdd={handleAddFromCatalog}
            booting={false}
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
      />

      <footer className="pointer-events-none fixed bottom-1 left-1/2 z-40 -translate-x-1/2 text-[10px] text-slate-400">
        Voice Cart · {CATALOG.length} items · {DEPARTMENTS.length} departments · en / es / fr / hi / de
      </footer>
    </div>
  );
}
