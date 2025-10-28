import serial
import json
import joblib
import numpy as np
import time

# Load the trained model and scaler
model = joblib.load('water_quality_model.pkl')
scaler = joblib.load('water_quality_scaler.pkl')

def read_serial_data():
    # Configure the serial port
    ser = serial.Serial(
        port='COM3',  # Change this to your Arduino port
        baudrate=115200,
        timeout=1
    )
    
    try:
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                # Parse TDS and Turbidity values from the serial output
                if "TDS Value:" in line and "Turbidity Value:" in line:
                    parts = line.split('|')
                    tds = float(parts[0].split(':')[1].strip())
                    turbidity = float(parts[1].split(':')[1].strip())
                    return tds, turbidity
    except Exception as e:
        print(f"Error reading serial: {e}")
        return None, None
    finally:
        ser.close()

def predict_water_quality(tds, turbidity):
    # Prepare the input data
    features = np.array([[tds, turbidity]])
    features_scaled = scaler.transform(features)
    
    # Make prediction
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0][1]
    
    return {
        'prediction': prediction,
        'probability': probability,
        'status': get_status(tds, turbidity, prediction, probability)
    }

def get_status(tds, turbidity, prediction, probability):
    if prediction == 0:
        if probability < 0.3:
            return "NORMAL"
        else:
            return "SUSPICIOUS ACTIVITY"
    else:
        if probability > 0.8:
            return "ILLEGAL DUMPING DETECTED!"
        else:
            return "SUSPICIOUS ACTIVITY"

def main():
    print("Starting water quality monitoring...")
    while True:
        tds, turbidity = read_serial_data()
        if tds is not None and turbidity is not None:
            result = predict_water_quality(tds, turbidity)
            
            print("\n=== Water Quality Analysis ===")
            print(f"TDS: {tds:.1f}")
            print(f"Turbidity: {turbidity:.1f}")
            print(f"Status: {result['status']}")
            print(f"Confidence: {result['probability']:.2f}")
            print("============================\n")
            
            # Write results to a file for the web interface
            with open('latest_prediction.json', 'w') as f:
                json.dump({
                    'timestamp': time.time(),
                    'tds': tds,
                    'turbidity': turbidity,
                    'status': result['status'],
                    'confidence': result['probability']
                }, f)
        
        time.sleep(1)  # Wait for 1 second before next reading

if __name__ == "__main__":
    main() 