# ✅ NutriScan — TODO Tracker

> **Hackathon: AMD Slingshot 2026** | **Time Budget: 60 min** | **Status: 🟡 Planning**

---

## 🟢 Phase 1: Backend Core (15 min)

### Setup
- [ ] Create `requirements.txt` — Flask, gunicorn, google-genai, Pillow
- [ ] Create `config.py` — env-based config (GOOGLE_API_KEY, PORT)

### AI Service
- [ ] Create `gemini_service.py`
  - [ ] `analyze_food_image(image_base64)` → structured nutrition JSON
  - [ ] `get_healthier_alternatives(food_items)` → healthier swap suggestions
  - [ ] `get_meal_plan_suggestion(goals, history)` → next meal recommendation

### API Server
- [ ] Create `app.py`
  - [ ] `POST /api/analyze` — food image → nutrition analysis
  - [ ] `POST /api/log-meal` — save meal to session
  - [ ] `GET /api/meals` — retrieve meal history
  - [ ] `GET /api/daily-summary` — aggregated daily totals
  - [ ] `POST /api/recommend` — healthier alternatives
  - [ ] `POST /api/set-goals` — set calorie/macro targets
  - [ ] `GET /api/goals` — get current targets
- [ ] Smoke test: `python app.py` → test `/api/analyze`

---

## 🔵 Phase 2: Frontend UI (25 min)

### Design System
- [ ] Create `static/css/style.css`
  - [ ] CSS custom properties (colors, fonts, spacing)
  - [ ] Dark mode base (#0a0f1c background)
  - [ ] Glassmorphism card components (backdrop-filter)
  - [ ] Animated tab navigation bar
  - [ ] Circular progress rings (SVG/CSS)
  - [ ] Food result cards with nutrition chips
  - [ ] Loading skeleton animations
  - [ ] Mobile-first responsive layout
  - [ ] Micro-animations (hover, transitions)

### HTML Structure
- [ ] Create `templates/index.html`
  - [ ] Meta tags, Google Fonts (Inter), favicon
  - [ ] Tab bar: Scan | Log | Dashboard | Profile
  - [ ] Scan view: camera preview, upload btn, results area
  - [ ] Log view: meal timeline, daily total summary
  - [ ] Dashboard view: calorie bar, macro chart, meal list
  - [ ] Profile view: goal settings form, about section

### JavaScript Modules
- [ ] Create `static/js/app.js`
  - [ ] SPA tab router
  - [ ] Global state (meals[], goals{}, currentAnalysis)
  - [ ] API client (fetch wrapper)
  - [ ] Init & event listeners
- [ ] Create `static/js/camera.js`
  - [ ] getUserMedia camera access
  - [ ] Canvas photo capture
  - [ ] File upload (drag & drop + file picker)
  - [ ] Image → base64 conversion
  - [ ] Submit to /api/analyze
  - [ ] Render analysis results
- [ ] Create `static/js/dashboard.js`
  - [ ] Calorie progress bar (animated)
  - [ ] Macro donut chart (Canvas 2D)
  - [ ] Meal timeline renderer
  - [ ] Daily summary cards
- [ ] Create `static/js/recommendations.js`
  - [ ] Healthier alternative cards
  - [ ] Before/after comparison
  - [ ] "Try this instead" UI

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
- [ ] Create `Dockerfile` (python:3.11-slim, gunicorn)
- [ ] Create `.dockerignore`
- [ ] Create `.gcloudignore`

### Deploy to Cloud Run
- [ ] Create `deploy.sh` script
- [ ] Enable Cloud Run + Artifact Registry APIs
- [ ] Build & push container image
- [ ] Deploy with `gcloud run deploy`
- [ ] Set `GOOGLE_API_KEY` env var on Cloud Run
- [ ] Verify live URL works

### Documentation
- [ ] Create `README.md`
  - [ ] Project overview & features
  - [ ] Screenshots / demo
  - [ ] Local setup instructions
  - [ ] GCP deployment instructions
  - [ ] API reference
  - [ ] Tech stack & architecture
- [ ] Git commit & push

---

## 📊 Progress Summary

| Phase | Status | Items | Completed |
|-------|--------|-------|-----------|
| Backend Core | ⬜ Not Started | 14 | 0/14 |
| Frontend UI | ⬜ Not Started | 26 | 0/26 |
| Integration | ⬜ Not Started | 10 | 0/10 |
| Deployment | ⬜ Not Started | 11 | 0/11 |
| **Total** | **⬜ Not Started** | **61** | **0/61** |

---

## 🏁 Success Criteria

| Criterion | Required | Status |
|-----------|----------|--------|
| Gemini AI analyzes food images | ✅ Yes | ⬜ |
| Nutritional info displayed (cal/protein/carb/fat) | ✅ Yes | ⬜ |
| Meal logging works | ✅ Yes | ⬜ |
| Daily dashboard with progress tracking | ✅ Yes | ⬜ |
| Healthier alternatives recommended | ✅ Yes | ⬜ |
| Beautiful, polished dark-mode UI | ✅ Yes | ⬜ |
| Deployed on GCP Cloud Run | ✅ Yes | ⬜ |
| README documentation | ✅ Yes | ⬜ |
