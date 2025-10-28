import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

# Generate synthetic data
def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    # Normal ranges
    normal_tds = np.random.uniform(0, 500, n_samples // 2)  # Normal TDS range: 0-500 ppm
    normal_turbidity = np.random.uniform(0, 15, n_samples // 2)  # Clear water: 0-15 NTU
    
    # Abnormal ranges (illegal dumping)
    illegal_tds = np.random.uniform(500, 2000, n_samples // 2)  # High TDS
    illegal_turbidity = np.random.uniform(15, 100, n_samples // 2)  # Dirty water
    
    # Combine data
    tds = np.concatenate([normal_tds, illegal_tds])
    turbidity = np.concatenate([normal_turbidity, illegal_turbidity])
    
    # Create labels (0: normal, 1: illegal dumping)
    labels = np.concatenate([
        np.zeros(n_samples // 2),  # Normal conditions
        np.ones(n_samples // 2)    # Illegal dumping
    ])
    
    # Create DataFrame
    df = pd.DataFrame({
        'tds': tds,
        'turbidity': turbidity,
        'illegal_dumping': labels
    })
    
    return df

# Train the model
def train_model(df):
    # Prepare features and target
    X = df[['tds', 'turbidity']]
    y = df['illegal_dumping']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Print model accuracy
    train_accuracy = model.score(X_train_scaled, y_train)
    test_accuracy = model.score(X_test_scaled, y_test)
    print(f"Training Accuracy: {train_accuracy:.2f}")
    print(f"Testing Accuracy: {test_accuracy:.2f}")
    
    return model, scaler

if __name__ == "__main__":
    print("Generating synthetic data...")
    df = generate_synthetic_data()
    
    print("\nTraining model...")
    model, scaler = train_model(df)
    
    print("\nSaving model and scaler...")
    joblib.dump(model, 'water_quality_model.pkl')
    joblib.dump(scaler, 'water_quality_scaler.pkl')
    
    print("\nTesting some example cases:")
    test_cases = [
        (100, 5),    # Normal case
        (600, 25),   # Suspicious case
        (1500, 50),  # Clear illegal dumping
    ]
    
    for tds, turbidity in test_cases:
        features = np.array([[tds, turbidity]])
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0][1]
        
        status = "ILLEGAL DUMPING" if prediction == 1 else "Normal"
        print(f"\nTDS: {tds}, Turbidity: {turbidity}")
        print(f"Prediction: {status}")
        print(f"Confidence: {probability:.2f}") 
# Generate data and train model
df = generate_synthetic_data()
model, scaler = train_model(df)

# Save model and scaler
joblib.dump(model, 'water_quality_model.pkl')
joblib.dump(scaler, 'water_quality_scaler.pkl')

# Function to test predictions
def test_prediction(tds, turbidity):
    features = np.array([[tds, turbidity]])
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    probability = model.predict_proba(features_scaled)[0][1]
    
    return prediction[0], probability

# Test some example cases
test_cases = [
    (100, 5),    # Normal case
    (600, 25),   # Suspicious case
    (1500, 50),  # Clear illegal dumping
]

print("\nTest Predictions:")
for tds, turbidity in test_cases:
    pred, prob = test_prediction(tds, turbidity)
    status = "ILLEGAL DUMPING" if pred == 1 else "Normal"
    print(f"TDS: {tds}, Turbidity: {turbidity}")
    print(f"Prediction: {status}")
    print(f"Confidence: {prob:.2f}\n") 