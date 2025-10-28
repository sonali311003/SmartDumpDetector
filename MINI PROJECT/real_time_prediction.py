import serial
import json
import joblib
import time
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model and scaler
model = joblib.load('water_quality_model.pkl')
scaler = joblib.load('water_quality_scaler.pkl')

def get_prediction_status(prediction, probability):
    if prediction == 0:
        if probability < 0.3:
            return {
                'status': 'Normal',
                'message': 'Water conditions are normal',
                'alert_level': 'normal'
            }
        else:
            return {
                'status': 'Suspicious Activity',
                'message': 'Unusual water conditions detected',
                'alert_level': 'warning'
            }
    else:
        return {
            'status': 'ILLEGAL DUMPING DETECTED!',
            'message': 'Critical water contamination detected',
            'alert_level': 'danger'
        }

@app.route('/api/sensor-data')
def get_sensor_data():
    try:
        # Configure this to match your Arduino's settings
        ser = serial.Serial('COM3', 9600, timeout=1)
        
        if ser.in_waiting:
            line = ser.readline().decode('utf-8').strip()
            # Modify this parsing based on your Arduino's output format
            values = line.split()
            tds = float(values[0])
            turbidity = float(values[1])
            
            # Make prediction
            features = [[tds, turbidity]]
            features_scaled = scaler.transform(features)
            prediction = model.predict(features_scaled)[0]
            probability = model.predict_proba(features_scaled)[0][1]
            
            # Get status details
            status_info = get_prediction_status(prediction, probability)
            
            response = {
                'tds': tds,
                'turbidity': turbidity,
                'prediction': {
                    'is_dumping': bool(prediction),
                    'confidence': float(probability),
                    'status': status_info['status'],
                    'message': status_info['message'],
                    'alert_level': status_info['alert_level']
                },
                'timestamp': time.time()
            }
            
            ser.close()
            return jsonify(response)
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'error': 'Failed to read sensor data',
            'message': str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000) 