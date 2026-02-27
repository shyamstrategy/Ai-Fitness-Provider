import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
import os

# -----------------------------
# STEP 1: Load Data from CSV
# -----------------------------

data_path = "data/calorie_data.csv"

if not os.path.exists(data_path):
    print(f"❌ Error: {data_path} not found!")
    exit(1)

df = pd.read_csv(data_path)


# -----------------------------
# STEP 2: Train Model
# -----------------------------

X = df[["age", "weight", "height", "activity"]]
y = df["daily_calories"]

model = LinearRegression()
model.fit(X, y)

# -----------------------------
# STEP 3: Save Model
# -----------------------------

if not os.path.exists("models"):
    os.makedirs("models")

joblib.dump(model, "models/calorie_model.pkl")

print("✅ Model trained and saved successfully!")