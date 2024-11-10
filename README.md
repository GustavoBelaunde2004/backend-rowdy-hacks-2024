# Personalized Health Tracker – Backend

## Overview  
This repository contains the backend for the **Personalized Health Tracker** app. The backend handles **data management**, **API endpoints**, and integrates a **TensorFlow machine learning model** to provide personalized health recommendations based on user input.

---

## Features  
- **Secure User Data Management**: Store health metrics securely using MongoDB.  
- **Machine Learning Integration**: Use a TensorFlow model (`stress_model.pkl`) to analyze stress levels and trends.  
- **API Endpoints**: Provide services for data storage, analysis, and recommendation generation.  

---

## Tech Stack  
- **Backend Framework**: Node.js (Express.js)  
- **Machine Learning**: TensorFlow (Python)  
- **Database**: MongoDB  
- **Environment Configuration**: `.env` for managing sensitive variables  

---

## Folder Structure  

```plaintext
backend/
├── config/                   # Configuration for database connections
├── models/                   # MongoDB schema for user health data
├── python-tensorflow/        # Python code for running the TensorFlow model
│   ├── stress_model.pkl      # Pre-trained TensorFlow model
│   └── model.py              # Script to serve predictions
├── routes/                   # API routes for handling requests
│   ├── analyze.js            # Routes for analyzing user data
│   ├── recommendations.js    # Routes for generating recommendations
│   └── data.js               # Routes for storing user data
├── .gitignore                # Git ignore rules
├── package-lock.json         # Auto-generated dependency tree
├── package.json              # Project metadata and dependencies
├── server.js                 # Main server entry point
└── README.md                 # Documentation
```

## Prerequisites
- Node.js
- Python 3.x
- MongoDB

## Installation
Step 1: Clone the Repository
```plaintext
git clone https://github.com/backend-repo-url.git
cd backend
```
Step 2: Install Node.js Dependencies
```plaintext
npm install
```
Step 3: Set Up Environment Variables
Create a .env file in the root directory and add the following:
```plaintext
MONGO_URI=your_mongo_connection_string
ML_MODEL_URL=http://localhost:5000  # URL for the TensorFlow model server
PORT=3000
```
Step 4: Start the Backend Server
```plaintext
npm start
```
Step 5: Set Up the ML Model Server
Navigate to the python-tensorflow folder:
```plaintext
cd python-tensorflow
```
Install Python dependencies:
```plaintext
pip install -r requirements.txt
```
Run the ML model server:
```plaintext
python model.py
```

## API Endpoints
| Endpoint                | Method | Description                             |
|-------------------------|--------|-----------------------------------------|
| `/api/data`             | POST   | Stores user health data.                |
| `/api/analyze`          | GET    | Analyzes stored health data.            |
| `/api/recommendations`  | GET    | Provides personalized recommendations.  |

## Future Enhancements
- Add support for advanced health trend predictions using more complex ML models.
- Integrate wearable device data (e.g., Fitbit, Apple Health).

## Contributors
- Gustavo Belaunde - Backend development, ML integration
- John Stoklas 
- Theodore Chan 
