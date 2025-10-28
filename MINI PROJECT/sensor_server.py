from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import json

app = Flask(__name__)
CORS(app)

# Simulated water bodies data
WATER_BODIES = {
    "Bellandur Lake": {
        "location": {"lat": 12.9374, "lng": 77.6800},
        "type": "lake",
        "sensor_id": "BEL001"
    },
    "Varthur Lake": {
        "location": {"lat": 12.9417, "lng": 77.7172},
        "type": "lake",
        "sensor_id": "VAR001"
    },
    "Ulsoor Lake": {
        "location": {"lat": 12.9825, "lng": 77.6203},
        "type": "lake",
        "sensor_id": "ULS001"
    },
    "Hebbal Lake": {
        "location": {"lat": 13.0508, "lng": 77.5939},
        "type": "lake",
        "sensor_id": "HEB001"
    },
    "Vrishabhavathi River": {
        "location": {"lat": 12.9716, "lng": 77.5246},
        "type": "river",
        "sensor_id": "VRI001"
    }
}

# Configure email settings
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'username': 'your-email@gmail.com',
    'password': 'your-app-password',
    'from_email': 'your-email@gmail.com',
    'to_email': 'authority-email@example.com'
}

def get_simulated_readings(location_type):
    """Generate simulated sensor readings based on water body type"""
    if location_type == "lake":
        return {
            "temperature": round(random.uniform(24, 28), 1),
            "tds": round(random.uniform(150, 500)),
            "turbidity": round(random.uniform(5, 20), 1)
        }
    else:  # river
        return {
            "temperature": round(random.uniform(22, 26), 1),
            "tds": round(random.uniform(100, 300)),
            "turbidity": round(random.uniform(2, 15), 1)
        }

@app.route('/water-quality-data')
def get_water_quality_data():
    data = {}
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    
    for name, info in WATER_BODIES.items():
        readings = get_simulated_readings(info["type"])
        data[name] = {
            "location": info["location"],
            "type": info["type"],
            "sensor_id": info["sensor_id"],
            "readings": readings,
            "timestamp": timestamp
        }
    
    return jsonify(data)

@app.route('/api/notify-authorities', methods=['POST'])
def notify_authorities():
    data = request.json
    
    # Create email message
    msg = MIMEMultipart()
    msg['From'] = EMAIL_CONFIG['from_email']
    msg['To'] = EMAIL_CONFIG['to_email']
    msg['Subject'] = 'ALERT: Illegal Dumping Detected'
    
    body = f"""
    ILLEGAL DUMPING DETECTED
    
    Location: {data['location']}
    Time: {data['timestamp']}
    
    Sensor Readings:
    - Temperature: {data['readings']['temperature']}°C
    - TDS: {data['readings']['tds']} ppm
    - Turbidity: {data['readings']['turbidity']} NTU
    
    Please investigate immediately.
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        # Send email
        with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
            server.starttls()
            server.login(EMAIL_CONFIG['username'], EMAIL_CONFIG['password'])
            server.send_message(msg)
        
        return jsonify({'status': 'success', 'message': 'Authorities notified'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 