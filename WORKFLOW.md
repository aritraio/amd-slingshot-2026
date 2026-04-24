# 🔄 NutriScan — Development Workflow

> AI-Powered Food & Health Application | Built for AMD Slingshot 2026

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   USER DEVICE                    │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ 📸 Camera  │  │ 📊 Dash  │  │ 🤖 AI Tips  │ │
│  │  Capture   │  │  Charts  │  │  & Recs     │ │
│  └─────┬──────┘  └────┬─────┘  └──────┬──────┘ │
│        │              │               │         │
│  ┌─────┴──────────────┴───────────────┴──────┐  │
│  │          SPA Controller (app.js)          │  │
│  └─────────────────┬─────────────────────────┘  │
└────────────────────┼────────────────────────────┘
                     │ REST API (JSON)
┌────────────────────┼────────────────────────────┐
│  GCP Cloud Run     │                            │
│  ┌─────────────────┴─────────────────────────┐  │
│  │           Flask API Server                │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ │  │
│  │  │ /analyze │ │ /log-meal│ │ /recommend│ │  │
│  │  └────┬─────┘ └────┬─────┘ └─────┬─────┘ │  │
│  │       │            │              │       │  │
│  │  ┌────┴────────────┴──────────────┴────┐  │  │
│  │  │       Gemini AI Service             │  │  │
│  │  │  (Food Recognition + Nutrition Est) │  │  │
│  │  └────────────────┬────────────────────┘  │  │
│  │                   │                       │  │
│  │  ┌────────────────┴────────────────────┐  │  │
│  │  │    In-Memory Session Storage        │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                     │
                     ▼
         Google Gemini 2.0 Flash API
```

---

## 📁 Project Structure

```
amd-slingshot-2026/
│
├── app.py                    # Flask server + API routes
├── config.py                 # Environment configuration
├── gemini_service.py         # Gemini AI integration
├── requirements.txt          # Python dependencies
├── Dockerfile                # Container definition
├── deploy.sh                 # GCP deployment script
├── .dockerignore             # Docker ignore
├── .gcloudignore             # GCloud ignore
├── README.md                 # Documentation
├── WORKFLOW.md               # This file
├── TODO.md                   # Task tracking
│
├── templates/
│   └── index.html            # SPA shell (single page)
│
└── static/
    ├── css/
    │   └── style.css         # Complete design system
    ├── js/
    │   ├── app.js            # SPA router + state management
    │   ├── camera.js         # Camera/upload handler
    │   ├── dashboard.js      # Charts + progress visualization
    │   └── recommendations.js # AI recommendations UI
    └── images/
        └── (generated assets)
```

---

## 🚀 Sprint Timeline (60 Minutes)

### Phase 1: Backend Foundation (15 min)
```
START ──► config.py ──► gemini_service.py ──► app.py ──► Test API
  │                                                         │
  └── requirements.txt                                      │
                                                            ▼
                                                   Backend Ready ✅
```

**What happens:**
1. Set up Python environment and dependencies
2. Build the Gemini AI service for food image analysis
3. Create Flask API with all endpoints
4. Quick smoke test to verify backend works

### Phase 2: Frontend UI (25 min)
```
Backend Ready ──► style.css ──► index.html ──► app.js ──► camera.js
                                                  │
                                          dashboard.js
                                                  │
                                       recommendations.js
                                                  │
                                                  ▼
                                          Frontend Ready ✅
```

**What happens:**
1. Design system with dark mode, glassmorphism, animations
2. HTML shell with 4-tab SPA structure
3. JavaScript modules for each feature
4. Wire up frontend to backend API

### Phase 3: Integration & Testing (10 min)
```
Frontend Ready ──► Full E2E Test ──► Bug Fixes ──► UI Polish
                        │                              │
                   Test Camera Flow              Smooth Animations
                   Test Meal Logging             Error Handling
                   Test Dashboard                Loading States
                        │                              │
                        ▼                              ▼
                                 App Ready ✅
```

### Phase 4: GCP Deployment (10 min)
```
App Ready ──► Dockerfile ──► docker build ──► Push to Artifact Registry
                                                      │
                                              gcloud run deploy
                                                      │
                                                      ▼
                                               LIVE URL 🌐 ✅
```

---

## 🛠️ Development Commands

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variable
export GOOGLE_API_KEY="your-gemini-api-key"

# Run development server
python app.py

# App available at http://localhost:8080
```

### Docker Build & Test
```bash
# Build image
docker build -t nutriscan .

# Run container
docker run -p 8080:8080 -e GOOGLE_API_KEY="your-key" nutriscan

# Test at http://localhost:8080
```

### GCP Deployment
```bash
# One-click deploy
chmod +x deploy.sh
./deploy.sh

# Or manual steps:
# 1. Set project
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com

# 3. Build & deploy
gcloud run deploy nutriscan \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_API_KEY=your-key
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `GET` | `/` | Serve the web app | — |
| `POST` | `/api/analyze` | Analyze food image | `{ "image": "base64..." }` |
| `POST` | `/api/log-meal` | Log a meal | `{ "foods": [...], "totals": {...} }` |
| `GET` | `/api/meals` | Get meal history | — |
| `GET` | `/api/daily-summary` | Get daily nutrition summary | — |
| `POST` | `/api/recommend` | Get healthier alternatives | `{ "foods": [...] }` |
| `POST` | `/api/set-goals` | Set nutrition goals | `{ "calories": 2000, ... }` |
| `GET` | `/api/goals` | Get current goals | — |

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0f1c` | Main background |
| `--bg-card` | `rgba(255,255,255,0.05)` | Glassmorphic cards |
| `--color-primary` | `#00d67e` | Primary actions, success |
| `--color-accent` | `#ffb347` | Accents, warnings |
| `--color-danger` | `#ff6b6b` | Over-limit indicators |
| `--color-info` | `#6c9fff` | Info elements |
| `--font-family` | `'Inter', sans-serif` | All text |
| `--radius` | `16px` | Card border radius |
| `--glass-blur` | `20px` | Backdrop blur amount |

---

## 🤖 Gemini Prompt Strategy

### Food Analysis Prompt
```
Analyze this food image. Identify each food item visible.
For each item, estimate:
- Name, portion size, calories, protein (g), carbs (g), fat (g), fiber (g)

Return ONLY valid JSON in this format:
{
  "foods": [...],
  "meal_score": 1-10,
  "health_notes": "...",
  "total_calories": N,
  "total_protein": N,
  "total_carbs": N,
  "total_fat": N
}
```

### Healthier Alternatives Prompt
```
Given these food items: [list], suggest healthier alternatives
that are similar in taste/satisfaction but with better nutrition.
Return JSON with before/after comparisons.
```

---

## ✅ Definition of Done

- [ ] Food image analysis works end-to-end
- [ ] Meal logging persists in session
- [ ] Dashboard shows accurate daily totals
- [ ] AI recommendations display correctly
- [ ] Dark mode UI with animations
- [ ] Responsive on mobile
- [ ] Deployed on GCP Cloud Run
- [ ] README documentation complete
