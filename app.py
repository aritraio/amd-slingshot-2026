"""NutriScan — AI-Powered Food & Health Application."""
import uuid
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session
from config import Config

app = Flask(__name__)
app.secret_key = Config.SECRET_KEY

# ─── In-Memory Storage (per-session) ───────────────────────────────────────────
# In production, replace with Firestore / Cloud SQL
_store = {}


def _get_session_id():
    """Get or create a session ID."""
    if "sid" not in session:
        session["sid"] = str(uuid.uuid4())
    return session["sid"]


def _get_user_data():
    """Get the data store for the current session."""
    sid = _get_session_id()
    if sid not in _store:
        _store[sid] = {
            "meals": [],
            "goals": {
                "calories": 2000,
                "protein": 150,
                "carbs": 250,
                "fat": 65,
            },
        }
    return _store[sid]


# ─── Page Routes ────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the single-page application."""
    return render_template("index.html")


# ─── API Routes ─────────────────────────────────────────────────────────────────

@app.route("/api/log-meal", methods=["POST"])
def log_meal():
    """Log a meal to the user's daily diary."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No meal data provided"}), 400

    user_data = _get_user_data()

    meal = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "foods": data.get("foods", []),
        "total_calories": data.get("total_calories", 0),
        "total_protein": data.get("total_protein", 0),
        "total_carbs": data.get("total_carbs", 0),
        "total_fat": data.get("total_fat", 0),
        "total_fiber": data.get("total_fiber", 0),
        "meal_score": data.get("meal_score", 5),
        "health_notes": data.get("health_notes", ""),
    }

    user_data["meals"].append(meal)
    return jsonify({"success": True, "meal": meal})


@app.route("/api/meals", methods=["GET"])
def get_meals():
    """Get all logged meals for the current session."""
    user_data = _get_user_data()
    
    # Filter to today's meals
    today = datetime.now().date().isoformat()
    today_meals = [
        m for m in user_data["meals"]
        if m["timestamp"].startswith(today)
    ]
    
    return jsonify({"meals": today_meals})


@app.route("/api/daily-summary", methods=["GET"])
def daily_summary():
    """Get aggregated daily nutrition summary."""
    user_data = _get_user_data()
    goals = user_data["goals"]
    
    today = datetime.now().date().isoformat()
    today_meals = [
        m for m in user_data["meals"]
        if m["timestamp"].startswith(today)
    ]

    totals = {
        "calories": sum(m.get("total_calories", 0) for m in today_meals),
        "protein": sum(m.get("total_protein", 0) for m in today_meals),
        "carbs": sum(m.get("total_carbs", 0) for m in today_meals),
        "fat": sum(m.get("total_fat", 0) for m in today_meals),
        "fiber": sum(m.get("total_fiber", 0) for m in today_meals),
        "meal_count": len(today_meals),
    }

    # Calculate percentages against goals
    progress = {
        "calories": min(100, round(totals["calories"] / goals["calories"] * 100)) if goals["calories"] else 0,
        "protein": min(100, round(totals["protein"] / goals["protein"] * 100)) if goals["protein"] else 0,
        "carbs": min(100, round(totals["carbs"] / goals["carbs"] * 100)) if goals["carbs"] else 0,
        "fat": min(100, round(totals["fat"] / goals["fat"] * 100)) if goals["fat"] else 0,
    }

    # Average meal score
    scores = [m.get("meal_score", 5) for m in today_meals]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0

    return jsonify({
        "totals": totals,
        "goals": goals,
        "progress": progress,
        "avg_meal_score": avg_score,
    })


@app.route("/api/set-goals", methods=["POST"])
def set_goals():
    """Set daily nutrition goals."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No goals provided"}), 400

    user_data = _get_user_data()
    user_data["goals"].update({
        "calories": int(data.get("calories", 2000)),
        "protein": int(data.get("protein", 150)),
        "carbs": int(data.get("carbs", 250)),
        "fat": int(data.get("fat", 65)),
    })

    return jsonify({"success": True, "goals": user_data["goals"]})


@app.route("/api/goals", methods=["GET"])
def get_goals():
    """Get current nutrition goals."""
    user_data = _get_user_data()
    return jsonify(user_data["goals"])


# ─── Main ────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
