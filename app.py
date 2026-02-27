from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

model = None
model_path = "models/calorie_model.pkl"
data_path = "data/fitness_data.csv"

if os.path.exists(model_path):
    model = joblib.load(model_path)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        age = int(data.get("age", 25))
        weight = float(data.get("weight", 70))
        height = float(data.get("height", 175))
        activity = float(data.get("activity", 1.2))

        if model:
            prediction = model.predict([[age, weight, height, activity]])
            calories = round(prediction[0], 2)
        else:
            calories = round(10 * weight + 6.25 * height - 5 * age + 5, 2)
        
        return jsonify({"daily_calories": calories})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    try:
        user_data = request.json
        goal = user_data.get("goal", "").strip().lower()
        budget = user_data.get("budget", "").strip().lower()
        culture = user_data.get("cultural_habits", "Indian").strip().lower()

        if not os.path.exists(data_path):
            return jsonify({"error": "Fitness data not found"}), 404

        df = pd.read_csv(data_path)
        
        # Robust filtering logic
        # 1. Exact match for all three
        mask = (
            (df['goal'].str.contains(goal, case=False, na=False)) &
            (df['budget'].str.contains(budget, case=False, na=False)) &
            (df['culture'].str.contains(culture, case=False, na=False))
        )
        filtered_df = df[mask]

        # 2. Match goal and budget
        if filtered_df.empty:
            mask = (
                (df['goal'].str.contains(goal, case=False, na=False)) &
                (df['budget'].str.contains(budget, case=False, na=False))
            )
            filtered_df = df[mask]

        # 3. Match only goal
        if filtered_df.empty:
            filtered_df = df[df['goal'].str.contains(goal, case=False, na=False)]
            
        # 4. Fallback: return first row if everything fails
        if filtered_df.empty:
            filtered_df = df.iloc[[0]]

        result = filtered_df.iloc[0].to_dict()
        
        # Prepare response
        return jsonify({
            "status": "success",
            "data": {
                "workout_plan": result.get("workout_plan", "General workout suggested."),
                "diet_plan": result.get("diet_plan", "Balanced diet suggested."),
                "tips": [tip.strip() for tip in str(result.get("tips", "")).split("; ") if tip.strip()],
                "matched_criteria": {
                    "goal": goal,
                    "budget": budget,
                    "culture": culture
                },
                "advice": f"This '{goal}' plan is tailored for your '{budget}' budget and '{culture}' habits."
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    