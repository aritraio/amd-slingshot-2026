"""Gemini AI service for food image analysis and nutritional estimation."""
import json
import base64
import re
import time
from google import genai
from google.genai import types
from config import Config

MAX_RETRIES = 2
RETRY_DELAY = 2


# Initialize Gemini client
if Config.GOOGLE_API_KEY:
    client = genai.Client(api_key=Config.GOOGLE_API_KEY)
else:
    client = None

FOOD_ANALYSIS_PROMPT = """You are a professional nutritionist AI. Analyze the food in this image carefully.

Identify EVERY food item visible in the image. For each item, estimate the portion size and provide detailed nutritional information.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no backticks, no explanation):
{
  "foods": [
    {
      "name": "Food item name",
      "portion": "Estimated portion (e.g., '1 cup', '200g', '1 medium slice')",
      "calories": 250,
      "protein": 12.5,
      "carbs": 30.0,
      "fat": 8.5,
      "fiber": 3.0
    }
  ],
  "meal_score": 7,
  "meal_score_label": "Good",
  "health_notes": "Brief health assessment of this meal",
  "suggestions": "One quick tip to make this meal healthier",
  "total_calories": 500,
  "total_protein": 25.0,
  "total_carbs": 60.0,
  "total_fat": 17.0,
  "total_fiber": 6.0
}

Rules:
- meal_score is 1-10 (1=very unhealthy, 10=extremely healthy)
- meal_score_label: 1-3="Poor", 4-5="Fair", 6-7="Good", 8-9="Great", 10="Excellent"
- All nutritional values should be realistic estimates
- Calories as integer, macros as floats with 1 decimal
- If no food is detected, return {"error": "No food detected in this image", "foods": []}
"""

HEALTHIER_ALTERNATIVES_PROMPT = """You are a professional nutritionist. Given these food items the user just ate:

{food_items}

Suggest healthier alternatives that are similar in taste/satisfaction but with better nutrition.

Respond with ONLY valid JSON (no markdown, no backticks):
{{
  "alternatives": [
    {{
      "original": "Original food name",
      "original_calories": 300,
      "suggestion": "Healthier alternative name",
      "suggestion_calories": 180,
      "reason": "Why this is better (brief)",
      "calories_saved": 120,
      "nutrition_benefit": "Higher protein, more fiber"
    }}
  ],
  "overall_tip": "One general tip for healthier eating habits"
}}
"""

MEAL_SUGGESTION_PROMPT = """You are a professional nutritionist. The user has the following daily nutrition goals and current intake:

Daily Goals: {goals}
Current Intake Today: {intake}
Remaining Budget: {remaining}

Based on what they've already eaten and their remaining nutritional budget, suggest a meal for their next eating occasion.

Respond with ONLY valid JSON (no markdown, no backticks):
{{
  "suggestion": {{
    "meal_name": "Suggested meal name",
    "description": "Brief appetizing description",
    "estimated_calories": 400,
    "estimated_protein": 30,
    "estimated_carbs": 45,
    "estimated_fat": 12,
    "ingredients": ["ingredient 1", "ingredient 2"],
    "why": "Why this meal fits their remaining budget"
  }}
}}
"""


def _extract_json(text):
    """Extract JSON from Gemini response, handling markdown code blocks and thinking output."""
    # Strip thinking blocks from 2.5-flash models
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    
    # Try to find JSON in code blocks first
    code_block_match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
    if code_block_match:
        text = code_block_match.group(1)
    
    # Try to parse the text directly
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON object in the text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
    return None


def _call_gemini(contents, temperature=0.5, max_tokens=2048):
    """Call Gemini with model fallback and retry logic."""
    if client is None:
        raise ValueError("Google API key is not configured. Please set GOOGLE_API_KEY environment variable.")
        
    models_to_try = [Config.GEMINI_MODEL, Config.GEMINI_MODEL_FALLBACK, "gemini-2.0-flash-lite"]
    last_error = None
    
    for model_name in models_to_try:
        for attempt in range(MAX_RETRIES + 1):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        temperature=temperature,
                        max_output_tokens=max_tokens,
                    ),
                )
                return response
            except Exception as e:
                last_error = e
                error_str = str(e)
                # If rate limited or unavailable, try next model immediately
                if "429" in error_str or "503" in error_str:
                    break
                # For other errors, retry same model
                if attempt < MAX_RETRIES:
                    time.sleep(RETRY_DELAY * (attempt + 1))
    raise last_error


def analyze_food_image(image_base64: str) -> dict:
    """
    Analyze a food image using Gemini Vision.
    
    Args:
        image_base64: Base64-encoded image string (may include data URI prefix)
        
    Returns:
        dict with food items, nutrition info, and health score
    """
    try:
        # Strip data URI prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]
        
        image_bytes = base64.b64decode(image_base64)
        
        response = _call_gemini(
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                        types.Part.from_text(text=FOOD_ANALYSIS_PROMPT),
                    ],
                )
            ],
            temperature=0.3,
        )
        
        result = _extract_json(response.text)
        if result is None:
            return {"error": "Failed to parse AI response", "raw": response.text}
        
        return result
        
    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}


def get_healthier_alternatives(food_items: list) -> dict:
    """
    Get healthier alternative suggestions for given food items.
    
    Args:
        food_items: List of food item dicts from analysis
        
    Returns:
        dict with healthier alternatives and tips
    """
    try:
        food_list = ", ".join([f"{f['name']} ({f['calories']} cal)" for f in food_items])
        prompt = HEALTHIER_ALTERNATIVES_PROMPT.format(food_items=food_list)
        
        response = _call_gemini(contents=prompt, temperature=0.5)
        
        result = _extract_json(response.text)
        if result is None:
            return {"error": "Failed to parse AI response"}
        
        return result
        
    except Exception as e:
        return {"error": f"Recommendation failed: {str(e)}"}


def get_meal_plan_suggestion(goals: dict, intake: dict) -> dict:
    """
    Get a meal suggestion based on remaining daily nutritional budget.
    
    Args:
        goals: Daily nutrition goals dict
        intake: Current daily intake dict
        
    Returns:
        dict with meal suggestion
    """
    try:
        remaining = {
            "calories": max(0, goals.get("calories", 2000) - intake.get("calories", 0)),
            "protein": max(0, goals.get("protein", 150) - intake.get("protein", 0)),
            "carbs": max(0, goals.get("carbs", 250) - intake.get("carbs", 0)),
            "fat": max(0, goals.get("fat", 65) - intake.get("fat", 0)),
        }
        
        prompt = MEAL_SUGGESTION_PROMPT.format(
            goals=json.dumps(goals),
            intake=json.dumps(intake),
            remaining=json.dumps(remaining),
        )
        
        response = _call_gemini(contents=prompt, temperature=0.7, max_tokens=1024)
        
        result = _extract_json(response.text)
        if result is None:
            return {"error": "Failed to parse AI response"}
        
        return result
        
    except Exception as e:
        return {"error": f"Suggestion failed: {str(e)}"}
