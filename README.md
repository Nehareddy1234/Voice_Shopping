# 🛒 Voice Cart — Multilingual Voice Shopping Assistant

A mobile-first, voice-driven grocery and shopping list web application built with React 18, Vite, and Tailwind CSS. Features real-time multilingual speech recognition across 5 languages, client-side heuristic natural language understanding, smart product suggestions, continuous listening mode, restock tracking, and optional Gemini LLM parsing.

---

## 🌟 Key Features

### 🎙️ Multilingual Voice Engine & Continuous Mode
- **5 Supported Languages & Dialects**: English (`en-US`), Spanish (`es-ES`), French (`fr-FR`), German (`de-DE`), and Hindi / Hinglish (`hi-IN`).
- **Zero-Friction Auto-Detection**: Automatically detects input language and script without requiring manual language switching.
- **Continuous Listening**: Toggleable continuous listening mode with smart auto-restart delays to support hands-free grocery list building while audio confirmations play.
- **Microphone Fallback Retries**: Multi-locale retry chain dynamically switches recognition locale if confidence is low.
- **Speech Synthesis (TTS)**: Contextual audio confirmations in the speaker's language with non-repeating dynamic phrases.

### 🧠 Dual-Path NLP & Search Intelligence
- **High-Speed On-Device Parsing**: Heuristic token-matching parser extracts `ADD`, `REMOVE`, `UPDATE`, `SEARCH`, and `CLEAR` intents in under 1ms.
- **Natural Language Parsing**:
  - Quantities (digits `"2"`, words `"five"`, hindi words `"teen"`, or fractional units `"dozen"` $\rightarrow$ 12).
  - Multi-item single utterance splitting (`"add apples and two cartons of milk"`).
  - Quantity modifications (`"change milk to 3"` or `"update eggs to 6"`).
  - Restock indicators (`"we are out of oat milk"`).
  - Price constraints and filters (`"search organic apples under $5"`).
- **Optional Gemini LLM Integration**: Opt-in Gemini API key support for unstructured conversational queries, auto-translating colloquial phrasing into canonical catalog entries with localized replies.

### 📦 Dynamic Catalog & Smart Suggestions
- **918 Canonical Grocery Items across 12 Departments**: Deep coverage of fresh produce, heirloom varietals, whole grains, raw meats & seafood, packaged goods, dairy, bakery, beverages, household, baby, and pet care.
- **Multi-Source Hybrid Ingestion**: Synthesized from USDA FoodData Central, Barabasi Lab GroceryDB, and Open Food Facts.
- **Recency & Frequency History Scoring**: Locally tracks purchase history with custom scoring to surface personalized reorder suggestions.
- **Seasonal & Sale-Aware Recommendations**: Highlights current seasonal produce and active promotional discounts (~15% on sale) with strikethrough original prices.
- **Stock-Gated Smart Substitutes**: Suggests healthy and relevant alternative swaps when list items are out of stock.

---

## 🛠️ Tech Stack

- **Framework**: React 18 (Hooks, `useReducer`, `useMemo`, `useCallback`, `useRef`)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3 with custom glassmorphism and animation tokens
- **Icons**: Lucide React
- **Web APIs**: Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`), Web Audio API, `localStorage`
- **Verification Harness**: ESBuild + Node.js (130+ automated logical assertions)

---

## 📚 Data Sources & Attribution

The catalog is built from three open and public datasets deduplicated with singular-based NLP matching:

1. **USDA FoodData Central (FDC)**:
   - *Source*: U.S. Department of Agriculture, Agricultural Research Service (Foundation Foods & SR Legacy datasets).
   - *Focus*: Raw produce, heirloom fruits, vegetables, cuts of meat, seafood, whole grains, and basic pantry staples.
   - *License*: Public Domain / U.S. Government Work.
2. **Barabasi Lab GroceryDB**:
   - *Source*: Center for Complex Network Research, Northeastern University ([GitHub / Kaggle](https://github.com/Barabasi-Lab/GroceryDB)).
   - *Focus*: Supermarket packaged goods across major U.S. retailers (Target, Walmart, Whole Foods), household, personal care, baby, and snacks.
   - *License*: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
3. **Open Food Facts (OFF)**:
   - *Source*: Open Food Facts contributors ([openfoodfacts.org](https://world.openfoodfacts.org/)).
   - *Focus*: International and specialty grocery items, organic packaged goods, and allergen/label data.
   - *License*: Open Database License (ODbL 1.0).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed.

### Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repository-url>
   cd Voice_Shopping
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```

3. **Run the test suite:**
   ```bash
   npm run test:logic
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧠 Semantic Search Fallback & Embeddings Generation

The application implements a fast **two-tier matching architecture**:
1. **Primary Path (Heuristic NLP)**: Evaluates in $<1\text{ms}$ using deterministic token matching, multilingual alias maps, plural normalization, and fuzzy scoring.
2. **Fallback Path (Client-Side Semantic Search)**: Triggered only when rule-based matching yields no confident result (e.g. indirect descriptions like *"that citrus fruit"* $\rightarrow$ *Oranges*, *"snack for my dog"* $\rightarrow$ *Dog Kibble*, *"organic salad greens"* $\rightarrow$ *Spring Mix Greens*).
   - **Inference Engine**: `@xenova/transformers` (WASM / ONNX runtime).
   - **Model**: `Xenova/bge-small-en-v1.5` quantized (`~33.8 MB` ONNX weights), lazy-loaded on first fallback invocation with live download progress.
   - **Zero Runtime Computation for Catalog**: Catalog embeddings (384-dimensional normalized vectors) are strictly precomputed at build time.

### 📦 Regenerating Catalog Embeddings

Whenever catalog items, descriptions, or aliases are modified, regenerate the precomputed embedding vectors before building:

```bash
# Generate precomputed vector embeddings for all catalog items
node scripts/generate-catalog-embeddings.js
```

This generates `src/assets/catalog-embeddings.json` and `public/catalog-embeddings.json` containing 384-dimensional normalized vector representations for every catalog entry.

---

## 🧪 Verification & Testing

The project includes an automated test runner (`scripts/verify-logic.jsx`) validating:
- Catalog schema integrity (918 items, unique IDs, sizing, sale prices, stock statuses across all 12 departments).
- Multilingual intent extraction for `ADD`, `REMOVE`, `UPDATE`, `SEARCH`, and `CLEAR` across English, Spanish, French, Hindi/Hinglish, and German.
- **Multi-Intent Command Splitting & Partial Failure**: Validates that compound action utterances (e.g. *"add milk and remove eggs"*, *"search for toothpaste under 5 and add bananas"*) split into distinct action clauses across 5 languages, capping at 5 sub-commands and executing valid operations even when individual clauses fail.
- **Client-Side Semantic Embedding Fallback**: Validates that indirect descriptive utterances bypassing rule matching resolve accurately to target catalog items above the cosine similarity threshold ($\ge 0.60$).
- LLM prompt generation, sanitization, and graceful fallback behaviors.