from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib

# New dataset for stress prediction: [sleep (hours), heartRate (bpm), steps, stressLevel (0=low, 4=very high)]
# Further expanded dataset for stress prediction: [sleep (hours), heartRate (bpm), steps, stressLevel (0=low, 4=very high)]
data = [
    [8.0, 60, 12000, 0],  # Good sleep, low heart rate, high steps -> Low stress
    [7.5, 65, 11000, 0],  # Good sleep, normal heart rate, high steps -> Low stress
    [6.5, 70, 9000, 1],   # Decent sleep, slightly higher heart rate, lower steps -> Mild stress
    [6.0, 75, 8500, 1],   # Average sleep, higher heart rate, low steps -> Mild stress
    [5.5, 80, 7000, 2],   # Poor sleep, higher heart rate, lower steps -> Moderate stress
    [5.0, 85, 6000, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.5, 90, 5000, 3],   # Very poor sleep, very high heart rate, low steps -> High stress
    [4.0, 95, 4000, 4],   # Extremely poor sleep, very high heart rate, very low steps -> Very high stress
    [7.0, 65, 9500, 1],   # Good sleep, normal heart rate, average steps -> Mild stress
    [6.0, 80, 8000, 2],   # Average sleep, high heart rate, lower steps -> Moderate stress
    [5.0, 85, 6000, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.0, 90, 4500, 4],   # Very poor sleep, very high heart rate, very low steps -> Very high stress
    [7.8, 60, 11500, 0],  # Good sleep, low heart rate, high steps -> Low stress
    [7.2, 68, 10000, 0],  # Decent sleep, normal heart rate, high steps -> Low stress
    [6.8, 70, 9000, 1],   # Decent sleep, slightly higher heart rate, lower steps -> Mild stress
    [5.8, 77, 7500, 2],   # Average sleep, higher heart rate, low steps -> Moderate stress
    [5.0, 82, 6500, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.2, 88, 5000, 3],   # Very poor sleep, very high heart rate, low steps -> High stress
    [4.0, 93, 4500, 4],   # Extremely poor sleep, very high heart rate, very low steps -> Very high stress
    [8.2, 58, 12500, 0],  # Great sleep, low heart rate, high steps -> Low stress
    [7.5, 65, 11000, 0],  # Good sleep, normal heart rate, high steps -> Low stress
    [7.0, 67, 10000, 1],  # Good sleep, normal heart rate, decent steps -> Mild stress
    [6.0, 80, 8500, 2],   # Average sleep, higher heart rate, low steps -> Moderate stress
    [5.0, 85, 6500, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.5, 90, 5000, 4],   # Very poor sleep, very high heart rate, very low steps -> Very high stress
    # Additional data to help improve model accuracy
    [8.5, 58, 13000, 0],  # Excellent sleep, low heart rate, high steps -> Low stress
    [8.0, 62, 12000, 0],  # Good sleep, low heart rate, high steps -> Low stress
    [7.0, 70, 10500, 1],  # Decent sleep, normal heart rate, decent steps -> Mild stress
    [6.5, 75, 9000, 1],   # Decent sleep, higher heart rate, lower steps -> Mild stress
    [6.0, 80, 8500, 2],   # Average sleep, high heart rate, lower steps -> Moderate stress
    [5.0, 88, 6500, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.5, 92, 5000, 4],   # Very poor sleep, very high heart rate, low steps -> Very high stress
    [4.0, 95, 4000, 4],   # Extremely poor sleep, very high heart rate, very low steps -> Very high stress
    [8.3, 60, 12500, 0],  # Great sleep, low heart rate, high steps -> Low stress
    [7.5, 66, 11000, 0],  # Good sleep, normal heart rate, high steps -> Low stress
    [6.2, 72, 9500, 1],   # Average sleep, normal heart rate, decent steps -> Mild stress
    [5.5, 85, 7000, 2],   # Poor sleep, high heart rate, low steps -> Moderate stress
    [4.8, 89, 6000, 3],   # Very poor sleep, high heart rate, low steps -> High stress
    [4.2, 92, 5500, 4],   # Extremely poor sleep, very high heart rate, low steps -> Very high stress
    [7.9, 64, 11000, 0],  # Decent sleep, low heart rate, high steps -> Low stress
    [6.8, 68, 10000, 1],  # Decent sleep, normal heart rate, decent steps -> Mild stress
    [5.7, 78, 8000, 2],   # Poor sleep, higher heart rate, low steps -> Moderate stress
    [5.2, 82, 6500, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.0, 90, 5000, 4],   # Very poor sleep, very high heart rate, very low steps -> Very high stress
    [8.0, 60, 12000, 0],   # Great sleep, low heart rate, high steps -> Low stress
    #adition
    [8.1, 60, 12500, 0],  # Excellent sleep, low heart rate, high steps -> Low stress
    [7.6, 63, 11500, 0],  # Good sleep, low heart rate, high steps -> Low stress
    [7.2, 68, 10000, 1],  # Decent sleep, normal heart rate, moderate steps -> Mild stress
    [6.5, 73, 9000, 1],   # Decent sleep, slightly higher heart rate, lower steps -> Mild stress
    [6.0, 78, 8500, 2],   # Average sleep, high heart rate, lower steps -> Moderate stress
    [5.5, 83, 7500, 2],   # Poor sleep, high heart rate, low steps -> Moderate stress
    [5.0, 88, 6000, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.5, 92, 5000, 4],   # Very poor sleep, very high heart rate, low steps -> Very high stress
    [4.0, 96, 4000, 4],   # Extremely poor sleep, very high heart rate, very low steps -> Very high stress
    [8.0, 62, 12000, 0],  # Great sleep, low heart rate, high steps -> Low stress
    [7.8, 64, 11000, 0],  # Good sleep, low heart rate, high steps -> Low stress
    [6.9, 70, 9500, 1],   # Average sleep, normal heart rate, moderate steps -> Mild stress
    [6.2, 75, 8500, 2],   # Average sleep, higher heart rate, lower steps -> Moderate stress
    [5.8, 82, 7000, 2],   # Poor sleep, high heart rate, low steps -> Moderate stress
    [5.2, 87, 6500, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.7, 90, 5500, 4],   # Very poor sleep, very high heart rate, low steps -> Very high stress
    [4.2, 95, 4500, 4],   # Extremely poor sleep, very high heart rate, very low steps -> Very high stress
    [7.9, 61, 12500, 0],  # Good sleep, low heart rate, high steps -> Low stress
    [6.8, 72, 10000, 1],  # Average sleep, normal heart rate, moderate steps -> Mild stress
    [6.0, 77, 9000, 1],   # Decent sleep, slightly higher heart rate, lower steps -> Mild stress
    [5.5, 82, 8000, 2],   # Poor sleep, high heart rate, low steps -> Moderate stress
    [4.8, 89, 6000, 3],   # Poor sleep, high heart rate, low steps -> High stress
    [4.0, 92, 5000, 4]    # Very poor sleep, very high heart rate, low steps -> Very high stress
]




# Split into features (X) and labels (y)
X = [row[:-1] for row in data]  # Features (sleep, heart rate, steps)
y = [row[-1] for row in data]   # Labels (stress level)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train a Random Forest classifier
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)

print(f'Accuracy: {accuracy * 100:.2f}%')
print('Confusion Matrix:')
print(conf_matrix)

# Save the model to a file for future use
joblib.dump(model, 'stress_model.pkl')

print('Model trained and saved!')
