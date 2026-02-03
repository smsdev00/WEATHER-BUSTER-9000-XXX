// Weather Verbose - Options Page Script
// Handles settings management and UI interactions

// DOM elements
const elements = {
  metricBtn: document.getElementById('metricBtn'),
  imperialBtn: document.getElementById('imperialBtn'),
  showTemperature: document.getElementById('showTemperature'),
  showHumidity: document.getElementById('showHumidity'),
  showWindSpeed: document.getElementById('showWindSpeed'),
  showUvIndex: document.getElementById('showUvIndex'),
  showApparentTemp: document.getElementById('showApparentTemp'),
  showPrecipitation: document.getElementById('showPrecipitation'),
  showVisibility: document.getElementById('showVisibility'),
  showCloudCover: document.getElementById('showCloudCover'),
  showPressure: document.getElementById('showPressure'),
  showDewPoint: document.getElementById('showDewPoint'),
  saveNotification: document.getElementById('saveNotification')
};

// Current settings
let currentSettings = null;

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  updateUI();
  setupEventListeners();
});

// Load settings from storage
async function loadSettings() {
  try {
    const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
    currentSettings = response;
  } catch (error) {
    console.error('Failed to load settings:', error);
    // Use defaults
    currentSettings = {
      units: 'metric',
      showApparentTemp: false,
      showPrecipitation: false,
      showVisibility: false,
      showCloudCover: false,
      showPressure: false,
      showDewPoint: false,
      showHumidity: true,
      showWindSpeed: true,
      showTemperature: true,
      showUvIndex: true
    };
  }
}

// Update UI to reflect current settings
function updateUI() {
  // Unit buttons
  if (currentSettings.units === 'metric') {
    elements.metricBtn.classList.add('active');
    elements.imperialBtn.classList.remove('active');
  } else {
    elements.metricBtn.classList.remove('active');
    elements.imperialBtn.classList.add('active');
  }

  // Toggles
  elements.showTemperature.checked = currentSettings.showTemperature;
  elements.showHumidity.checked = currentSettings.showHumidity;
  elements.showWindSpeed.checked = currentSettings.showWindSpeed;
  elements.showUvIndex.checked = currentSettings.showUvIndex;
  elements.showApparentTemp.checked = currentSettings.showApparentTemp;
  elements.showPrecipitation.checked = currentSettings.showPrecipitation;
  elements.showVisibility.checked = currentSettings.showVisibility;
  elements.showCloudCover.checked = currentSettings.showCloudCover;
  elements.showPressure.checked = currentSettings.showPressure;
  elements.showDewPoint.checked = currentSettings.showDewPoint;
}

// Setup event listeners
function setupEventListeners() {
  // Unit buttons
  elements.metricBtn.addEventListener('click', () => {
    currentSettings.units = 'metric';
    updateUI();
    saveSettings();
  });

  elements.imperialBtn.addEventListener('click', () => {
    currentSettings.units = 'imperial';
    updateUI();
    saveSettings();
  });

  // Toggle switches
  const toggleMap = {
    showHumidity: 'showHumidity',
    showWindSpeed: 'showWindSpeed',
    showUvIndex: 'showUvIndex',
    showApparentTemp: 'showApparentTemp',
    showPrecipitation: 'showPrecipitation',
    showVisibility: 'showVisibility',
    showCloudCover: 'showCloudCover',
    showPressure: 'showPressure',
    showDewPoint: 'showDewPoint'
  };

  Object.entries(toggleMap).forEach(([elementId, settingKey]) => {
    elements[elementId].addEventListener('change', (e) => {
      currentSettings[settingKey] = e.target.checked;
      saveSettings();
    });
  });
}

// Save settings to storage
async function saveSettings() {
  try {
    await browser.runtime.sendMessage({
      type: 'SAVE_SETTINGS',
      settings: currentSettings
    });
    showSaveNotification();
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Show save notification
let notificationTimeout = null;

function showSaveNotification() {
  // Clear existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  // Show notification
  elements.saveNotification.classList.add('show');

  // Hide after 2 seconds
  notificationTimeout = setTimeout(() => {
    elements.saveNotification.classList.remove('show');
  }, 2000);
}
