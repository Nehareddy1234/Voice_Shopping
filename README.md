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
- **360 Canonical Grocery Items across 12 Departments**: Complete with brand metadata, sizing details, organic certification, inventory levels, sale pricing, and season markers.
- **Recency & Frequency History Scoring**: Locally tracks purchase history with custom scoring to surface personalized reorder suggestions.
- **Seasonal & Sale-Aware Recommendations**: Highlights current seasonal produce and active promotional discounts with strikethrough original prices.
- **Stock-Gated Smart Substitutes**: Suggests healthy and relevant alternative swaps when list items are out of stock.

---

## 🛠️ Tech Stack

- **Framework**: React 18 (Hooks, `useReducer`, `useMemo`, `useCallback`, `useRef`)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3 with custom glassmorphism and animation tokens
- **Icons**: Lucide React
- **Web APIs**: Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`), Web Audio API, `localStorage`
- **Verification Harness**: ESBuild + Node.js (100+ automated logical assertions)

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

## 🧪 Verification & Testing

The project includes an automated test runner (`scripts/verify-logic.jsx`) validating:
- Catalog schema integrity (105 items, unique IDs, sizing, sale prices, stock statuses).
- Multilingual intent extraction for `ADD`, `REMOVE`, `UPDATE`, `SEARCH`, and `CLEAR` across English, Spanish, French, Hindi/Hinglish, and German.
- Multi-item utterance parsing and restock phrasing.
- Catalog fuzzy search, organic filtering, and price caps.
- LLM prompt generation, sanitization, and graceful fallback behaviors.