/* Fill-in information from Blynk Device Info here */
#define BLYNK_TEMPLATE_ID           "TMPL3mrTZQ4RD"
#define BLYNK_TEMPLATE_NAME         "Quickstart Template"
#define BLYNK_AUTH_TOKEN            "Qbj9yJXzhBoqTJfOGXzcx7nkgfv1ZLXg"

/* Comment this out to disable prints and save space */
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

// Your WiFi credentials
char ssid[] = "welkin";
char pass[] = "lazy2707";

// Define GPIO pins
#define TDS_PIN 34        // GPIO pin for TDS sensor
#define TURBIDITY_PIN 33  // GPIO pin for Turbidity sensor
#define INDICATOR_LED 13  // GPIO pin for LED indicator

// Variables to store sensor values
int tdsValue = 0;
int turbidityValue = 0;
char serialmonitor;
BlynkTimer timer;

// Function to read sensor data and send it to Blynk
void sendSensorData() {
  // Read analog values from sensors
  tdsValue = analogRead(TDS_PIN);
  turbidityValue = analogRead(TURBIDITY_PIN);
  serialmonitor = digitalRead(TURBIDITY_PIN);

  // Check and display turbidity levels on Serial Monitor
  if (turbidityValue < 0) {
    Serial.println("Negative Turbidity Value Detected");
    turbidityValue = -turbidityValue;
  }

  // Print values to Serial Monitor
  Serial.print("TDS Value: ");
  Serial.print(tdsValue);
  Serial.print(" | Turbidity Value: ");
  Serial.println(turbidityValue);

  // Turbidity level categorization and LED indicator
  if (turbidityValue < 15) {
    Serial.println("Turbidity Status: CLEAR");
    digitalWrite(INDICATOR_LED, LOW);
  } else if ((turbidityValue >= 15) && (turbidityValue < 25)) {
    Serial.println("Turbidity Status: FAIRLY CLEAR");
    digitalWrite(INDICATOR_LED, HIGH);
  } else {
    Serial.println("Turbidity Status: DIRTY");
    digitalWrite(INDICATOR_LED, HIGH);
  }

  // Send values to Blynk Virtual Pins
  Blynk.virtualWrite(V0, tdsValue);       // Send TDS value to Virtual Pin V0
  Blynk.virtualWrite(V1, turbidityValue); // Send Turbidity value to Virtual Pin V1
  Blynk.virtualWrite(V2, serialmonitor); 
}

void setup() {
  // Debug console
  Serial.begin(115200);

  // Initialize Blynk
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);


  // Setup a function to send sensor data every second
  timer.setInterval(4000L, sendSensorData);
}

void loop() {
  Blynk.run();
  timer.run();
}