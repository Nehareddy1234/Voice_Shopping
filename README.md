# Voice Command Shopping Assistant

> A hands-free grocery list manager with multilingual NLP, client-side semantic search, and smart suggestions.

**Live Demo**: [https://voice-shopping-iota.vercel.app](https://voice-shopping-iota.vercel.app) *(or your deployed Vercel deployment URL)*

---

## 📸 Screenshots

<!-- Place screenshots in public/screenshots/ or docs/ -->
- **Voice Bar & Waveform**: Real-time microphone listening with multilingual indicator and continuous mode. *(Placeholder: `docs/screenshots/voice-bar.png`)*
- **Smart Suggestions Panel**: Personalized recency/frequency history picks, seasonal produce, and sale items. *(Placeholder: `docs/screenshots/smart-suggestions.png`)*
- **Search & Categorized List**: Real-time catalog filtering with price bounds, out-of-stock substitute recommendations, and 12-department grouping. *(Placeholder: `docs/screenshots/catalog-search.png`)*

---

## ✨ Features

### 1. 🎙️ Voice Input
- **Real-Time Multilingual Recognition**: Browser-native Web Speech API supporting English (`en-US`), Spanish (`es-ES`), French (`fr-FR`), German (`de-DE`), and Hindi / Hinglish (`hi-IN`).
- **Zero-Config Language Auto-Detection**: Instant script and lexical scoring identifies the spoken language without manual language toggling.
- **Continuous Listening Mode**: Hands-free mode with speech synthesis auto-pause and delayed mic restart.
- **Multi-Locale Retry Chain**: Dynamically retries recognition across alternative language models when initial confidence is low.

### 2. 💡 Smart Suggestions
- **Recency & Frequency History Scoring**: Locally tracks purchase history with custom decay scoring to surface personalized reorder suggestions.
- **Seasonal Produce Highlights**: Surfaces in-season fresh produce tailored to the current month.
- **Promotional Deals & Sales**: Displays active discounted items with strikethrough original prices (~15% discount).
- **Stock-Gated Healthy Substitutes**: Contextual substitute suggestions displayed exclusively when items are out of stock.

### 3. 📋 List Management
- **Full Action Suite**: Voice-driven `ADD`, `REMOVE`, `UPDATE` (quantity modify), `TOGGLE` (check off), and `CLEAR`.
- **Automatic Department Grouping**: Automatically categorizes items across 12 grocery departments with subtotal pricing.
- **Persistent Storage**: Instant client-side list and history state preservation via `localStorage`.

### 4. 🔍 Voice-Activated Search
- **Constraint & Attribute Filtering**: Filters by size (e.g. `500ml`, `1 lb`), organic certification, brand name, and price caps (e.g. *"find olive oil under $10"*).
- **Dual-Path Ranking**: Direct SKU and category boost scoring ensures exact produce items rank above secondary snacks or juices.

### 5. 🎨 UI / UX
- **Minimalist Floating Voice Bar**: Dynamic waveform audio pulse, quick-action demo command chips, and language status badge.
- **Audio & Visual Feedback**: Contextual non-repeating TTS audio confirmations alongside toast notifications.
- **Responsive Layout**: Designed for mobile and desktop screens.

---

## 🧠 Architecture & How It Works

The application uses a **two-tier matching architecture** that combines deterministic heuristic NLP with client-side embedding fallback:

```
User Voice / Text Utterance
          │
          ▼
1. Multi-Command Splitting (detect conjunction boundaries: "and", "then", "y", "und")
          │
          ├─► Separate Action Clauses (e.g., "add milk" + "remove eggs")
          │
          ▼
2. Heuristic Rule-Based NLP Pipeline (<1ms)
   ├─► Action Verb Parsing (ADD / REMOVE / UPDATE / SEARCH / CLEAR)
   ├─► Quantity & Unit Extraction ("2 cartons", "half dozen", "teen kilo")
   ├─► Multilingual Synonym & Alias Map (leche → milk, seb → apples)
   ├─► Singular/Plural Normalization Engine (mangoes → mango, tomatoes → tomato)
   └─► Exact & Fuzzy Catalog Scoring
          │
   ┌──────┴──────────────────────────────┐
   │ High-Confidence Match Found?        │
   │                                     │
  YES                                   NO
   │                                     │
   ▼                                     ▼
Dispatch Action               3. Client-Side Semantic Embedding Fallback
                              ├─► Model: Xenova/bge-small-en-v1.5 (Quantized ONNX, ~33.8 MB)
                              ├─► Runtime: @xenova/transformers (WASM, lazy-loaded on-demand)
                              ├─► Vector Space: 384-dimensional normalized embeddings
                              ├─► Precomputed Index: 918 catalog embeddings (3.24 MB JSON)
                              └─► Cosine Similarity Match (Threshold ≥ 0.60)
                                         │
                                         ▼
                              Dispatch Action ("Smart Match")
```

### Key Technical Subsystems

1. **Multi-Command Parsing**:
   - Splits compound utterances on conjunctions (`"and"`, `"then"`, `"plus"`, `"aur"`, `"und"`, `"y luego"`).
   - If a clause contains an action verb, it spawns an independent command; if verbless, it groups items under the previous action (distinguishing *"add milk and eggs"* $\rightarrow$ 1 action from *"add milk and remove eggs"* $\rightarrow$ 2 actions).
   - Enforces a 5-command safety cap and handles partial failures gracefully.

2. **Catalog Composition (918 Canonical Items)**:
   - **Produce**: 133 items
   - **Pantry**: 95 items
   - **Dairy & Eggs**: 85 items
   - **Meat & Seafood**: 85 items
   - **Snacks**: 80 items
   - **Beverages**: 80 items
   - **Bakery**: 75 items
   - **Frozen**: 75 items
   - **Personal Care**: 60 items
   - **Household**: 50 items
   - **Baby**: 50 items
   - **Pet Care**: 50 items

---

## 🛠️ Tech Stack

- **Framework**: React 18 (`useReducer`, `useMemo`, `useCallback`, `useRef`)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Client-Side Embeddings**: `@xenova/transformers` (WASM / ONNX Runtime)
- **Web APIs**: Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`), Web Audio API, `localStorage`
- **Verification Runner**: ESBuild + Node.js

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js 18+ and npm

### Installation & Execution

```bash
# 1. Clone repository
git clone https://github.com/Nehareddy1234/Voice_Shopping.git
cd Voice_Shopping

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run the automated logic verification suite (150+ unit/integration tests)
npm run test:logic

# 5. Build for production
npm run build

# 6. Preview production build locally
npm run preview
```

---

## 📚 Data Sources & Attribution

The 918-item catalog combines three open datasets:

1. **[USDA FoodData Central (FDC)](https://fdc.nal.usda.gov/)**:
   - *Data*: Foundation Foods & SR Legacy datasets (raw produce, grains, meat, seafood).
   - *License*: Public Domain / U.S. Government Work.
2. **[Barabasi Lab GroceryDB](https://github.com/Barabasi-Lab/GroceryDB)**:
   - *Data*: Supermarket packaged goods across major U.S. retailers (Target, Walmart, Whole Foods).
   - *License*: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
3. **[Open Food Facts](https://world.openfoodfacts.org/)**:
   - *Data*: International and specialty grocery items, organic packaged foods.
   - *License*: Open Database License (ODbL) / Database Contents License (DbCL).

---

## ⚠️ Known Limitations

1. **Browser Web Speech API Support**: Native speech recognition relies on browser support (`webkitSpeechRecognition`), which works best in Google Chrome, Microsoft Edge, and Safari.
2. **Microphone Permissions**: Voice recognition requires explicit HTTPS or `localhost` microphone permissions. If denied, the application falls back to manual text input.
3. **Semantic Fallback Scope**: Semantic embedding inference uses an English-optimized model (`bge-small-en-v1.5`). Multilingual inputs primarily match through the extensive multilingual alias and translation lexicon.
4. **Estimated Pricing**: Item prices are representative supermarket benchmarks created for demo consistency.

---

## 📝 Approach & Technical Reflection

Voice commerce presents a fundamental tension between **latency** and **semantic flexibility**. Full cloud LLM pipelines introduce 1–3 second roundtrip latencies and API costs, while basic keyword matching fails on natural, conversational speech (e.g., *"that citrus fruit"* or *"snack for my dog"*).

Our solution implements a **deterministic-first, ML-fallback architecture**:
1. Over 95% of standard shopping utterances (verbs, quantities, multilingual names, and aliases) resolve in $<1\text{ms}$ on-device via regular expressions, singularization rules, and token intersection scoring.
2. When rule-based scoring yields no confident match, the application lazily loads an on-device embedding model (`bge-small-en-v1.5` via WebAssembly/ONNX) to compute cosine similarity against 918 pre-embedded catalog vectors without any backend server requirements.
3. For chained inputs, a pre-pass split engine separates multi-intent commands (e.g., *"add milk and remove eggs"*) while preserving multi-item single actions (*"add milk and eggs"*), providing isolated execution with partial-failure reporting.

**Future Improvements**: With more time, we would implement WebGPU-accelerated embeddings for lower inference latency and add quantized multilingual embeddings (e.g., MiniLM-L12-multilingual) for cross-lingual semantic search.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).