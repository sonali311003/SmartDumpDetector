// Initialize map and variables
let map;
let lastUpdate = new Date();

// Define Bangalore lakes data
const bangaloreLakes = [
    {
        name: "BMSIT&M Campus",
        coordinates: [13.1355, 77.5720],
        area: "Campus Area",
        isMainStation: true
    },
    {
        name: "Bellandur Lake",
        coordinates: [12.9374, 77.6800],
        area: "361.40 hectares"
    },
    {
        name: "Varthur Lake",
        coordinates: [12.9417, 77.7172],
        area: "180.40 hectares"
    },
    {
        name: "Ulsoor Lake",
        coordinates: [12.9825, 77.6203],
        area: "50 hectares"
    },
    {
        name: "Hebbal Lake",
        coordinates: [13.0508, 77.5939],
        area: "75 hectares"
    },
    {
        name: "Nagavara Lake",
        coordinates: [13.0486, 77.6079],
        area: "60 hectares"
    },
    {
        name: "Sankey Tank",
        coordinates: [13.0152, 77.5724],
        area: "15 hectares"
    },
    {
        name: "Madiwala Lake",
        coordinates: [12.9226, 77.6174],
        area: "114.3 hectares"
    },
    {
        name: "Agara Lake",
        coordinates: [12.9239, 77.6375],
        area: "21.5 hectares"
    },
    {
        name: "Kaikondrahalli Lake",
        coordinates: [12.9137, 77.6741],
        area: "48 hectares"
    },
    {
        name: "Jakkur Lake",
        coordinates: [13.0708, 77.6221],
        area: "160 hectares"
    },
    {
        name: "Puttenahalli Lake",
        coordinates: [12.8913, 77.5800],
        area: "13 hectares"
    },
    {
        name: "Rachenahalli Lake",
        coordinates: [13.0624, 77.6203],
        area: "90 hectares"
    },
    {
        name: "Avalahalli Lake",
        coordinates: [13.0274, 77.5149],
        area: "47.5 hectares"
    },
    {
        name: "Yelahanka Lake",
        coordinates: [13.1066, 77.5947],
        area: "110.6 hectares"
    },
    {
        name: "Allalasandra Lake",
        coordinates: [13.0629, 77.5947],
        area: "27.5 hectares"
    },
    {
        name: "Attur Lake",
        coordinates: [13.0972, 77.5942],
        area: "25.3 hectares"
    },
    {
        name: "Kogilu Lake",
        coordinates: [13.1089, 77.6199],
        area: "32.4 hectares"
    },
    {
        name: "Venkatala Lake",
        coordinates: [13.1153, 77.6033],
        area: "18.7 hectares"
    },
    {
        name: "Puttenahalli Lake (Yelahanka)",
        coordinates: [13.0986, 77.5939],
        area: "15.5 hectares"
    },
    {
        name: "Doddabommasandra Lake",
        coordinates: [13.0771, 77.5892],
        area: "50.5 hectares"
    },
    {
        name: "Shivanahalli Lake",
        coordinates: [13.0283, 77.5150],
        area: "32.4 hectares"
    },
    {
        name: "Chikkabanavara Lake",
        coordinates: [13.0833, 77.5167],
        area: "45.2 hectares"
    },
    {
        name: "Dasarahalli Lake",
        coordinates: [13.0464, 77.5120],
        area: "28.7 hectares"
    },
    {
        name: "T G Halli Reservoir",
        coordinates: [12.9886, 77.3333],
        area: "1,750 hectares"
    }
];

// Store markers in a Map for easy access
const markerMap = new Map();

// Initialize map
function initMap() {
    console.log('Initializing map...');
    
    // Center the map on BMSIT&M
    map = L.map('map').setView([13.1355, 77.5720], 14);  // Zoomed in to BMSIT

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each location
    bangaloreLakes.forEach(location => {
        // Create custom icon for BMSIT
        const icon = location.isMainStation ? 
            L.divIcon({
                className: 'custom-pin-marker main-station-marker',
                html: `
                    <div class="pin-wrapper">
                        <div class="pin">
                            <div class="pin-head"></div>
                            <div class="pin-tail"></div>
                        </div>
                    </div>
                `,
                iconSize: [40, 56],
                iconAnchor: [20, 56],
                popupAnchor: [0, -56]
            }) : 
            // Regular icon for other locations
            L.divIcon({
                className: 'custom-pin-marker',
                html: `
                    <div class="pin-wrapper">
                        <div class="pin">
                            <div class="pin-head"></div>
                            <div class="pin-tail"></div>
                        </div>
                    </div>
                `
            });

        const marker = L.marker(location.coordinates, { icon })
            .addTo(map)
            .bindPopup(createLakePopup(location));
        
        // Store marker reference
        markerMap.set(location.name, marker);

        // Auto-open BMSIT popup
        if (location.isMainStation) {
            marker.openPopup();
        }
    });
}

// Create lake popup content
function createLakePopup(lake) {
    return `
        <div class="lake-popup">
            <h3>${lake.name}</h3>
            <p>Area: ${lake.area}</p>
            <div class="sensor-readings">
                <p>Temperature: <span id="${lake.name.replace(/\s+/g, '-')}-temp">--</span>°C</p>
                <p>TDS: <span id="${lake.name.replace(/\s+/g, '-')}-tds">--</span> ppm</p>
                <p>Turbidity: <span id="${lake.name.replace(/\s+/g, '-')}-turbidity">--</span> NTU</p>
            </div>
        </div>
    `;
}

// Update sensor readings
function updateSensorReadings() {
    // Simulate sensor data (or get real data from your sensors)
    const temperature = (Math.random() * 10 + 25).toFixed(1);
    const tds = Math.floor(Math.random() * 200 + 300);
    const turbidity = (Math.random() * 5 + 2).toFixed(1);

    // Update dashboard values
    document.getElementById('temperature').textContent = `${temperature} °C`;
    document.getElementById('tds').textContent = `${tds} ppm`;
    document.getElementById('turbidity').textContent = `${turbidity} NTU`;

    // Update BMSIT marker popup with real-time data
    bangaloreLakes.forEach(location => {
        if (location.isMainStation) {
            const popupContent = `
                <div class="lake-popup main-station">
                    <div class="popup-header">
                        <h3>${location.name}</h3>
                        <span class="station-badge">Main Monitoring Station</span>
                    </div>
                    <div class="sensor-readings">
                        <div class="reading-item">
                            <i class="fas fa-thermometer-half"></i>
                            <span>Temperature: ${temperature}°C</span>
                        </div>
                        <div class="reading-item">
                            <i class="fas fa-tint"></i>
                            <span>TDS: ${tds} ppm</span>
                        </div>
                        <div class="reading-item">
                            <i class="fas fa-water"></i>
                            <span>Turbidity: ${turbidity} NTU</span>
                        </div>
                        <div class="reading-timestamp">
                            Last Updated: ${new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            `;
            
            // Update the popup if it's open
            const marker = markerMap.get(location.name);
            if (marker && marker.getPopup()) {
                marker.setPopupContent(popupContent);
            }
        }
    });

    // Update status indicators
    updateStatus('temp-status', temperature, 30, 35);
    updateStatus('tds-status', tds, 400, 500);
    updateStatus('turbidity-status', turbidity, 5, 7);

    // Update timestamp
    lastUpdate = new Date();
    document.getElementById('timestamp').textContent = `Last Updated: ${lastUpdate.toLocaleTimeString()}`;

    // Check for illegal dumping
    checkIllegalDumping(temperature, tds, turbidity);
}

// Update status indicators
function updateStatus(elementId, value, warningThreshold, criticalThreshold) {
    const element = document.getElementById(elementId);
    element.className = 'sensor-status';
    
    if (value > criticalThreshold) {
        element.classList.add('status-critical');
        element.textContent = 'Critical';
    } else if (value > warningThreshold) {
        element.classList.add('status-warning');
        element.textContent = 'Warning';
    } else {
        element.classList.add('status-normal');
        element.textContent = 'Normal';
    }
}

// Enhanced illegal dumping detection function
function checkIllegalDumping(temp, tds, turbidity) {
    const detectionStatus = document.getElementById('detectionStatus');
    const detectionDetails = document.getElementById('detectionDetails');
    const alertActions = document.getElementById('alertActions');

    if (tds > 500 || turbidity > 7 || temp > 35) {
        detectionStatus.className = 'status-indicator critical';
        detectionStatus.textContent = '🚨 ILLEGAL DUMPING DETECTED!';
        
        // Update detection details with specific information
        detectionDetails.innerHTML = `
            <div class="detection-info">
                <div class="parameter ${tds > 500 ? 'critical' : ''}">
                    <span>TDS: ${tds} ppm</span>
                    ${tds > 500 ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                </div>
                <div class="parameter ${turbidity > 7 ? 'critical' : ''}">
                    <span>Turbidity: ${turbidity} NTU</span>
                    ${turbidity > 7 ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                </div>
                <div class="parameter ${temp > 35 ? 'critical' : ''}">
                    <span>Temperature: ${temp}°C</span>
                    ${temp > 35 ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                </div>
            </div>
        `;

        // Show emergency contact options
        alertActions.innerHTML = `
            <div class="alert-actions-container">
                <div class="emergency-contacts">
                    <h3>Emergency Contacts</h3>
                    <div class="contact-buttons">
                        <button onclick="contactAuthorities('police')" class="contact-btn police">
                            <i class="fas fa-phone"></i> Police Control Room
                            <span>100</span>
                        </button>
                        <button onclick="contactAuthorities('pollution')" class="contact-btn pollution">
                            <i class="fas fa-phone"></i> Pollution Control Board
                            <span>080-25589112/113</span>
                        </button>
                        <button onclick="contactAuthorities('municipal')" class="contact-btn municipal">
                            <i class="fas fa-phone"></i> BBMP Control Room
                            <span>080-22660000</span>
                        </button>
                    </div>
                </div>
                <div class="alert-actions">
                    <button onclick="sendSMSAlert()" class="action-btn sms">
                        <i class="fas fa-sms"></i> Send SMS Alert
                    </button>
                    <button onclick="reportIncident()" class="action-btn report">
                        <i class="fas fa-file-alt"></i> Report Incident
                    </button>
                </div>
            </div>
        `;

        // Add to alert history with enhanced details
        addAlert({
            type: 'critical',
            message: `Illegal dumping detected! Critical levels: ${
                [
                    tds > 500 ? 'TDS' : null,
                    turbidity > 7 ? 'Turbidity' : null,
                    temp > 35 ? 'Temperature' : null
                ].filter(Boolean).join(', ')
            }`,
            timestamp: new Date().toLocaleTimeString()
        });

        // Trigger alert sound
        playAlertSound();
    } else if (tds > 400 || turbidity > 5 || temp > 30) {
        detectionStatus.className = 'status-indicator warning';
        detectionStatus.textContent = '⚠️ Suspicious Activity Detected';
        alertActions.innerHTML = ''; // Clear emergency contacts
    } else {
        detectionStatus.className = 'status-indicator normal';
        detectionStatus.textContent = '✅ No Illegal Dumping Detected';
        alertActions.innerHTML = ''; // Clear emergency contacts
    }
}

// Function to play alert sound
function playAlertSound() {
    const audio = new Audio('alert.mp3'); // Make sure to add an alert.mp3 file
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Function to handle contacting authorities
function contactAuthorities(type) {
    const numbers = {
        'police': '100',
        'pollution': '080-25589112',
        'municipal': '080-22660000'
    };
    window.location.href = `tel:${numbers[type]}`;
}

// Function to send SMS alert
function sendSMSAlert() {
    const message = encodeURIComponent(
        `ALERT: Illegal dumping detected at monitoring station. ` +
        `Time: ${new Date().toLocaleTimeString()}. ` +
        `Immediate action required.`
    );
    // You can replace this with your SMS gateway integration
    alert('SMS Alert System Triggered\nAuthorities have been notified.');
}

// Function to report incident
function reportIncident() {
    // Create incident report form
    const reportForm = document.createElement('div');
    reportForm.className = 'report-form';
    reportForm.innerHTML = `
        <h3>Incident Report</h3>
        <form id="incidentReportForm">
            <input type="text" placeholder="Location Details" required>
            <textarea placeholder="Additional Details" required></textarea>
            <button type="submit">Submit Report</button>
        </form>
    `;
    
    // Show form in a modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.appendChild(reportForm);
    document.body.appendChild(modal);
}

// Add alert to history
function addAlert(alert) {
    const alertList = document.getElementById('alertList');
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${alert.type}`;
    alertElement.innerHTML = `
        <div class="alert-content">
            <div class="alert-message">${alert.message}</div>
            <div class="alert-time">${alert.timestamp}</div>
        </div>
    `;
    alertList.insertBefore(alertElement, alertList.firstChild);
}

// Initialize dashboard
function initializeDashboard() {
    initMap();
    updateSensorReadings();
    // Update readings every 5 seconds
    setInterval(updateSensorReadings, 4000);
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing dashboard...');
    initializeDashboard();
});

function openWhatsApp() {
    const message = encodeURIComponent(
        "I want to report illegal dumping at: [Your location]"
    );
    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
}

// Function to update sensor readings and status
function updateSensorData() {
    console.log("Fetching new sensor data..."); // Debug log
    
    fetch('latest_reading.json?' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            console.log("Received data:", data); // Debug log
            
            // Update TDS and Turbidity
            document.getElementById('tdsValue').textContent = data.tds.toFixed(1);
            document.getElementById('turbidityValue').textContent = data.turbidity.toFixed(1);
            
            // Update Status
            const statusElement = document.getElementById('status');
            if (statusElement) {
                console.log("Updating status to:", data.status); // Debug log
                statusElement.textContent = data.status;
                
                // Update status class
                statusElement.className = 'status-text';
                if (data.status === "ILLEGAL DUMPING DETECTED!") {
                    statusElement.classList.add('danger');
                } else if (data.status === "Suspicious Activity") {
                    statusElement.classList.add('warning');
                } else {
                    statusElement.classList.add('normal');
                }
            }
            
            // Update timestamp
            const lastUpdateElement = document.getElementById('lastUpdate');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = `Last Updated: ${data.timestamp}`;
            }
        })
        .catch(error => {
            console.error('Error fetching sensor data:', error);
        });
}

// Update every 500ms
setInterval(updateSensorData, 400);

// Initial update
updateSensorData();

// Debug log to confirm script is loaded
console.log("Script loaded successfully"); 

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll to top button
function initScrollToTop() {
    const scrollBtn = document.createElement('div');
    scrollBtn.classList.add('scroll-top');
    scrollBtn.innerHTML = '↑';
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize navigation features
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNavLink();
    initScrollToTop();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 

function updateAlertHistory() {
    fetch('alert_history.json?' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const alertContainer = document.getElementById('alertHistory');
            if (!alertContainer) return;

            // Clear existing alerts
            alertContainer.innerHTML = '';
            
            // Add each alert to the container
            data.alerts.forEach(alert => {
                const alertElement = document.createElement('div');
                alertElement.className = 'alert-item';
                alertElement.innerHTML = `
                    <div class="alert-content">
                        <span class="alert-status">${alert.status}</span>
                        <span class="alert-time">${alert.timestamp}</span>
                        <div class="alert-details">
                            TDS: ${alert.tds.toFixed(1)} ppm | 
                            Turbidity: ${alert.turbidity.toFixed(1)} NTU
                        </div>
                    </div>
                `;
                alertContainer.appendChild(alertElement);
            });
        })
        .catch(error => console.error('Error loading alerts:', error));
}

// Add this to your existing updateSensorData interval
setInterval(() => {
    updateSensorData();
    updateAlertHistory();
}, 500); 