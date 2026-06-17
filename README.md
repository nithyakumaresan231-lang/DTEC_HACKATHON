# Tamil Dialogue & Sentence Builder

An interactive, production-ready educational web application designed to help students learn Tamil grammar, sentence construction, and dialogue formation. It features a rule-based NLP grammar engine, a context-aware homophonic spell corrector, and an AI dialogue generator powered by the Google Gemini API.

---

## 🚀 Key Features

1. **Tamil Sentence Builder**: Construct grammatically correct sentences by choosing subjects, verbs, objects, and tenses. Nouns are automatically declined (accusative vs. dative) and verbs conjugated with appropriate suffix mappings.
2. **Grammar Engine Breakdown**: Displays a color-coded structural map of the generated sentences (Subject, object case marker, verb stem, personal endings, and Sandhi consonant doubling rules).
3. **AI Tamil Dialogue Generator**: Generates natural, context-rich dialogues in Tamil with side-by-side English translations based on user-selected scenarios, topics, and tones. Powered by the **Google Gemini API** (with a built-in mock fallback for offline/no-key usage).
4. **Tamil Spell Corrector (Bonus)**: Implements a two-pass weighted Levenshtein distance spell checker tailored to Tamil homophones (Mayangoligal: `ண`/`ன`, `ர`/`ற`, `ல`/`ள`/`ழ`) and missing Sandhi consonant doubling triggers.

---

## 📂 Project Directory Structure

```
tamil-dialogue-builder/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── grammar_rules.py        # Grammar tables, pronoun suffixes, sandhi mappings
│   │   ├── models/
│   │   │   ├── request_models.py       # Pydantic validation schemas for requests
│   │   │   └── response_models.py      # Pydantic schemas for responses
│   │   ├── routes/
│   │   │   ├── dialogue.py             # Route for AI dialogues (Gemini)
│   │   │   └── sentence.py             # Routes for builders, explanations, spell checkers
│   │   ├── services/
│   │   │   ├── gemini_service.py       # Gemini API client with fallback dialogues
│   │   │   ├── grammar_engine.py       # Conjugation, declension, sandhi processing
│   │   │   └── spell_checker.py        # Weighted Levenshtein spell corrector
│   │   └── main.py                     # FastAPI entry point, CORS settings
│   ├── run.py                          # Top-level runner
│   ├── requirements.txt                # Python backend dependencies
│   ├── .env.example                    # Env template for API keys
│   └── test_grammar.py                 # Backend linguistic test script
├── frontend/
│   ├── src/
│   │   ├── components/                 # Reusable React components (Navbar, Results, Toggle)
│   │   ├── pages/                      # Application pages (Home, Sentence, Dialogue, About)
│   │   ├── services/
│   │   │   └── api.js                  # Axios client mapping API paths
│   │   ├── App.jsx                     # Route settings
│   │   ├── index.css                   # Global styles + Tailwind CSS v4 variables
│   │   └── main.jsx                    # React bootstrapping entry point
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.js                  # Vite configuration incorporating Tailwind CSS v4
│   ├── vercel.json                     # Vercel SPA routing fallback config
│   └── .env.example                    # Env template for frontend API endpoints
└── README.md                           # Main installation & run instructions
```

---

## 🛠️ Local Installation & Run Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **NPM 9+**

---

### Step 1: Set up and Run the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your Google Gemini API key:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
5. Run the validation test suite to verify the grammar logic:
   ```bash
   python test_grammar.py
   ```
6. Start the FastAPI development server:
   ```bash
   python run.py
   ```
   The backend server will start on **`http://localhost:8000`**. You can view the interactive API docs at `http://localhost:8000/docs`.

---

### Step 2: Set up and Run the Frontend

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - In `.env`, check that the API URL points to your local backend:
     ```env
     VITE_API_URL=http://localhost:8000/api
     ```
4. Start the React development server:
   ```bash
   npm run dev
   ```
   The application will start on **`http://localhost:5173`**. Open this link in your browser to interact with the platform.

---

## 🚀 Deployment Guide

### Backend Deployment (Render)
1. Sign in to [Render](https://render.com) and click **New > Web Service**.
2. Connect your Git repository.
3. Configure settings:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables under **Environment**:
   - `GEMINI_API_KEY`: *Your Gemini API Key*
   - `PYTHON_VERSION`: `3.10.x` or higher
5. Click **Deploy**. Render will provide a public URL (e.g. `https://tamil-nlp-backend.onrender.com`).

### Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your repository.
3. Configure build settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: *Your Render public backend URL (e.g., `https://tamil-nlp-backend.onrender.com/api`)*
5. Click **Deploy**. Vercel will automatically manage routing configurations (defined in our `vercel.json` SPA file) and compile the project with Tailwind CSS v4.
