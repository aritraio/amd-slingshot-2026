"""Configuration for NutriScan application."""
import os


class Config:
    """Application configuration from environment variables."""
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
    PORT = int(os.environ.get("PORT", 8080))
    DEBUG = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    SECRET_KEY = os.environ.get("SECRET_KEY", "nutriscan-dev-key-change-in-prod")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    GEMINI_MODEL_FALLBACK = "gemini-2.0-flash-lite"
