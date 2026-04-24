# 🥗 NutriScan — AI-Powered Food & Health Tracker

> Snap a photo of your meal and get instant AI-powered nutritional analysis, health scores, and personalized recommendations for healthier eating.

![Built with](https://img.shields.io/badge/Built%20with-Gemini%202.0%20Flash-blue)
![Python](https://img.shields.io/badge/Python-3.11-green)
![Deploy](https://img.shields.io/badge/Deploy-GCP%20Cloud%20Run-orange)

---

## ✨ Features

- **📸 AI Food Scanning** — Take a photo of any meal, Gemini Vision identifies every food item and estimates nutrition
- **📊 Nutrition Dashboard** — Real-time daily tracking with animated progress rings for calories, protein, carbs, and fat
- **🎯 Goal Setting** — Set personalized daily nutrition targets and track progress
- **🔄 Healthier Alternatives** — Get AI-powered suggestions for healthier food swaps
- **🤖 Meal Suggestions** — Receive next-meal recommendations based on your remaining daily nutritional budget
- **📋 Meal Logging** — Automatically log analyzed meals and review your food diary
- **🌙 Beautiful Dark UI** — Glassmorphism design with smooth animations

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3 (Glassmorphism), Vanilla JavaScript |
| Backend | Python 3.11, Flask |
| AI Engine | Google Gemini 2.0 Flash (Multimodal) |
| Deployment | GCP Cloud Run, Docker |
| WSGI | Gunicorn |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- [Google AI API Key](https://aistudio.google.com/apikey)

### Local Development

```bash
# Clone the repo
git clone <repo-url>
cd amd-slingshot-2026

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
export GOOGLE_API_KEY="your-api-key-here"

# Run the app
python app.py

# Open http://localhost:8080
```

### Docker

```bash
docker build -t nutriscan .
docker run -p 8080:8080 -e GOOGLE_API_KEY="your-key" nutriscan
```

---

## ☁️ GCP Deployment

### One-Click Deploy

```bash
export GOOGLE_API_KEY="your-api-key"
export GCP_PROJECT_ID="your-project-id"  # optional if gcloud is configured
chmod +x deploy.sh
./deploy.sh
```

### Manual Deploy

```bash
gcloud run deploy nutriscan \
    --source . \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars GOOGLE_API_KEY=your-key
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serve the web app |
| `POST` | `/api/analyze` | Analyze food image (base64) |
| `POST` | `/api/log-meal` | Log a meal |
| `GET` | `/api/meals` | Get today's meals |
| `GET` | `/api/daily-summary` | Get nutrition summary |
| `POST` | `/api/recommend` | Get healthier alternatives |
| `GET` | `/api/suggest-meal` | Get AI meal suggestion |
| `POST` | `/api/set-goals` | Set nutrition goals |
| `GET` | `/api/goals` | Get current goals |

---

## 📁 Project Structure

```
├── app.py              # Flask server + API routes
├── config.py           # Environment configuration
├── gemini_service.py   # Gemini AI integration
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container definition
├── deploy.sh           # GCP deployment script
├── templates/
│   └── index.html      # SPA shell
└── static/
    ├── css/style.css   # Design system
    └── js/
        ├── app.js      # SPA router + state
        ├── camera.js   # Image capture
        ├── dashboard.js # Charts
        └── recommendations.js
```

---

## 🏗️ Built for AMD Slingshot 2026
