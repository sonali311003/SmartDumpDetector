import serial
import serial.tools.list_ports
import json
import joblib
import time
import os

def find_arduino_port():
    """Find the correct COM port for Arduino"""
    ports = list(serial.tools.list_ports.comports())
    print("Available ports:")
    for port in ports:
        print(f"- {port.device}: {port.description}")
        if 'COM3' in port.device:  # Directly check for COM3
            return port.device
    return None

def read_and_predict():
    try:
        # Load the trained model and scaler
        model = joblib.load('water_quality_model.pkl')
        scaler = joblib.load('water_quality_scaler.pkl')
        
        arduino_port = find_arduino_port()
        if not arduino_port:
            print("Arduino not found!")
            return
        
        print(f"Connecting to Arduino on {arduino_port}")
        arduino = serial.Serial(port=arduino_port, baudrate=115200, timeout=4.0)  
        print("Connected to Arduino")
        time.sleep(2)
        
        alerts = []

        def save_alert(tds, turbidity, status, timestamp):
            alert = {
                'tds': tds,
                'turbidity': turbidity,
                'status': status,
                'timestamp': timestamp
            }
            alerts.append(alert)
            
            # Save alerts to a JSON file
            with open('alert_history.json', 'w') as f:
                json.dump({'alerts': alerts}, f, indent=2)
        
        while True:
            if arduino.in_waiting:
                try:
                    line = arduino.readline().decode('utf-8').strip()
                    print("\n--- New Reading ---")
                    print("Raw data:", line)
                    
                    if 'TDS Value:' in line and 'Turbidity Value:' in line:
                        # Parse Arduino data
                        parts = line.split('|')
                        tds = float(parts[0].split(':')[1].strip())
                        turbidity = float(parts[1].split(':')[1].strip())
                        
                        # Make prediction
                        features = [[tds, turbidity]]
                        features_scaled = scaler.transform(features)
                        prediction = model.predict(features_scaled)[0]
                        probability = model.predict_proba(features_scaled)[0][1]
                        
                        # Determine status
                        if prediction == 0:
                            status = "Normal" if probability < 0.3 else "Suspicious Activity"
                        else:
                            status = "ILLEGAL DUMPING DETECTED!"
                        
                        # Create result dictionary
                        result = {
                            'tds': tds,
                            'turbidity': turbidity,
                            'status': status,
                            'confidence': probability,
                            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
                        }
                        
                        print("Current Values:")
                        print(f"TDS: {tds:.1f} ppm")
                        print(f"Turbidity: {turbidity:.1f} NTU")
                        print(f"Status: {status}")
                        print(f"Confidence: {probability:.2f}")
                        
                        # Save to file
                        with open('latest_reading.json', 'w') as f:
                            json.dump(result, f, indent=2)
                            f.flush()  # Force write to disk
                            os.fsync(f.fileno())  # Ensure it's written
                        print("Data saved to latest_reading.json")
                        
                        if prediction == 1 or status == "ILLEGAL DUMPING DETECTED!":
                            save_alert(tds, turbidity, status, time.strftime('%Y-%m-%d %H:%M:%S'))
                        
                except Exception as e:
                    print(f"Error processing data: {e}")
                    continue
            
            time.sleep(0.1)
    except Exception as e:
        print(f"Error with serial connection: {e}")
        print("Please check if the correct COM port is being used")
        
    finally:
        if 'arduino' in locals():
            arduino.close()
            print("Serial connection closed")

if __name__ == "__main__":
    print("Starting water quality monitoring...")
    print(f"Current working directory: {os.getcwd()}")
    
    # Check if model files exist
    if not os.path.exists('water_quality_model.pkl'):
        print("Error: water_quality_model.pkl not found!")
        print("Please run train_model.py first")
        exit(1)
    
    while True:
        try:
            read_and_predict()
        except KeyboardInterrupt:
            print("\nProgram terminated by user")
            break
        except Exception as e:
            print(f"Error occurred: {e}")
            print("Retrying in 5 seconds...")
            time.sleep(5)