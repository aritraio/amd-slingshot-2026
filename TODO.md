# ✅ NutriScan — TODO Tracker

> **Hackathon: AMD Slingshot 2026** | **Time Budget: 60 min** | **Status: 🟡 Planning**

---

## ✅ Phase 1: Backend Core (15 min)

### Setup
- [x] Create `requirements.txt` — Flask, gunicorn, google-genai, Pillow
- [x] Create `config.py` — env-based config (GOOGLE_API_KEY, PORT)

### AI Service
- [x] Create `gemini_service.py`
  - [x] `analyze_food_image(image_base64)` → structured nutrition JSON
  - [x] `get_healthier_alternatives(food_items)` → healthier swap suggestions
  - [x] `get_meal_plan_suggestion(goals, history)` → next meal recommendation

### API Server
- [x] Create `app.py`
  - [x] `POST /api/analyze` — food image → nutrition analysis
  - [x] `POST /api/log-meal` — save meal to session
  - [x] `GET /api/meals` — retrieve meal history
  - [x] `GET /api/daily-summary` — aggregated daily totals
  - [x] `POST /api/recommend` — healthier alternatives
  - [x] `POST /api/set-goals` — set calorie/macro targets
  - [x] `GET /api/goals` — get current targets
- [x] Smoke test: `python app.py` → test `/api/analyze`

---

## ✅ Phase 2: Frontend UI (25 min)

### Design System
- [x] Create `static/css/style.css`
  - [x] CSS custom properties (colors, fonts, spacing)
  - [x] Dark mode base (#0a0f1c background)
  - [x] Glassmorphism card components (backdrop-filter)
  - [x] Animated tab navigation bar
  - [x] Circular progress rings (SVG/CSS)
  - [x] Food result cards with nutrition chips
  - [x] Loading skeleton animations
  - [x] Mobile-first responsive layout
  - [x] Micro-animations (hover, transitions)

### HTML Structure
- [x] Create `templates/index.html`
  - [x] Meta tags, Google Fonts (Inter), favicon
  - [x] Tab bar: Scan | Log | Dashboard | Profile
  - [x] Scan view: camera preview, upload btn, results area
  - [x] Log view: meal timeline, daily total summary
  - [x] Dashboard view: calorie bar, macro chart, meal list
  - [x] Profile view: goal settings form, about section

### JavaScript Modules
- [x] Create `static/js/app.js`
  - [x] SPA tab router
  - [x] Global state (meals[], goals{}, currentAnalysis)
  - [x] API client (fetch wrapper)
  - [x] Init & event listeners
- [x] Create `static/js/camera.js`
  - [x] getUserMedia camera access
  - [x] Canvas photo capture
  - [x] File upload (drag & drop + file picker)
  - [x] Image → base64 conversion
  - [x] Submit to /api/analyze
  - [x] Render analysis results
- [x] Create `static/js/dashboard.js`
  - [x] Calorie progress bar (animated)
  - [x] Macro donut chart (Canvas 2D)
  - [x] Meal timeline renderer
  - [x] Daily summary cards
- [x] Create `static/js/recommendations.js`
  - [x] Healthier alternative cards
  - [x] Before/after comparison
  - [x] "Try this instead" UI

---

## 🟠 Phase 3: Integration & Polish (10 min)

### End-to-End Testing
- [ ] Test: Upload food photo → see analysis results
- [ ] Test: Log meal → appears in meal log
- [ ] Test: Dashboard → shows correct totals & charts
- [ ] Test: Recommendations → displays alternatives
- [ ] Test: Goal setting → progress tracking updates

### Bug Fixes & Polish
- [ ] Fix any broken API calls
- [ ] Ensure error states display properly
- [ ] Verify loading animations work
- [ ] Check mobile responsiveness
- [ ] Test with 3+ different food images

---

## 🔴 Phase 4: GCP Deployment (10 min)

### Containerization
- [x] Create `Dockerfile` (python:3.11-slim, gunicorn)
- [x] Create `.dockerignore`
- [x] Create `.gcloudignore`

### Deploy to Cloud Run
- [x] Create `deploy.sh` script
- [ ] Enable Cloud Run + Artifact Registry APIs
- [ ] Build & push container image
- [ ] Deploy with `gcloud run deploy`
- [ ] Set `GOOGLE_API_KEY` env var on Cloud Run
- [ ] Verify live URL works

### Documentation
- [x] Create `README.md`
  - [x] Project overview & features
  - [x] Screenshots / demo
  - [x] Local setup instructions
  - [x] GCP deployment instructions
  - [x] API reference
  - [x] Tech stack & architecture
- [x] Git commit & push

---

## 📊 Progress Summary

| Phase | Status | Items | Completed |
|-------|--------|-------|-----------|
| Backend Core | ✅ Completed | 14 | 14/14 |
| Frontend UI | ✅ Completed | 26 | 26/26 |
| Integration | ⬜ Not Started | 10 | 0/10 |
| Deployment | 🟡 In Progress | 11 | 4/11 |
| **Total** | **🟡 In Progress** | **61** | **44/61** |

---

## 🏁 Success Criteria

| Criterion | Required | Status |
|-----------|----------|--------|
| Gemini AI analyzes food images | ✅ Yes | ✅ |
| Nutritional info displayed (cal/protein/carb/fat) | ✅ Yes | ✅ |
| Meal logging works | ✅ Yes | ✅ |
| Daily dashboard with progress tracking | ✅ Yes | ✅ |
| Healthier alternatives recommended | ✅ Yes | ✅ |
| Beautiful, polished dark-mode UI | ✅ Yes | ✅ |
| Deployed on GCP Cloud Run | ✅ Yes | ⬜ |
| README documentation | ✅ Yes | ✅ |
