from flask import Flask, request, jsonify
import joblib

# Load the trained model
model = joblib.load('C:\GUSTAVO\HACKATHON\\backend-rowdy-hacks-2024\stress_model.pkl')

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_stress():
    data = request.get_json()
    sleep = data['sleep']
    heart_rate = data['heartRate']
    steps = data['steps']

    # Make prediction
    prediction = model.predict([[sleep, heart_rate, steps]])[0]
    stress_levels = ["Low", "Mild", "Moderate", "High", "Very High"]
    stress_level = stress_levels[prediction]

    return jsonify({'stress_level': stress_level})

if __name__ == '__main__':
    app.run(port=5001)
