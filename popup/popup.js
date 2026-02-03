// WEATHER-BUSTER 9000 XXX - Popup Script
// Handles UI updates, drag & drop, and user interactions

// ===== WEATHER ICONS =====
const WEATHER_ICONS = {
  clear_day: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
    <g stroke="#fbbf24" stroke-width="3" stroke-linecap="round">
      <line x1="50" y1="10" x2="50" y2="22"/>
      <line x1="50" y1="78" x2="50" y2="90"/>
      <line x1="10" y1="50" x2="22" y2="50"/>
      <line x1="78" y1="50" x2="90" y2="50"/>
      <line x1="21.7" y1="21.7" x2="30.2" y2="30.2"/>
      <line x1="69.8" y1="69.8" x2="78.3" y2="78.3"/>
      <line x1="21.7" y1="78.3" x2="30.2" y2="69.8"/>
      <line x1="69.8" y1="30.2" x2="78.3" y2="21.7"/>
    </g>
  </svg>`,
  clear_night: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 20c-22 0-40 18-40 40s18 40 40 40c5 0 10-1 14-3-20-8-34-28-34-51 0-8 2-15 5-21-5-3-11-5-17-5h32z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="75" cy="30" r="2" fill="#fbbf24"/>
    <circle cx="85" cy="45" r="1.5" fill="#fbbf24"/>
    <circle cx="70" cy="55" r="1" fill="#fbbf24"/>
  </svg>`,
  cloudy: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 70H30c-11 0-20-9-20-20s9-20 20-20c1 0 2 0 3 0C36 20 46 12 58 12c15 0 27 12 27 27 0 1 0 2 0 3 8 2 14 9 14 18 0 10-8 18-18 18h-6z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
  </svg>`,
  rain: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 55H30c-11 0-20-9-20-20s9-20 20-20c1 0 2 0 3 0C36 5 46-3 58-3c15 0 27 12 27 27 0 1 0 2 0 3 8 2 14 9 14 18 0 10-8 18-18 18h-6z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <g stroke="#60a5fa" stroke-width="2" stroke-linecap="round">
      <line x1="30" y1="65" x2="25" y2="80"/>
      <line x1="45" y1="65" x2="40" y2="85"/>
      <line x1="60" y1="65" x2="55" y2="80"/>
      <line x1="75" y1="65" x2="70" y2="85"/>
    </g>
  </svg>`,
  drizzle: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 55H30c-11 0-20-9-20-20s9-20 20-20c1 0 2 0 3 0C36 5 46-3 58-3c15 0 27 12 27 27 0 1 0 2 0 3 8 2 14 9 14 18 0 10-8 18-18 18h-6z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <g fill="#60a5fa">
      <circle cx="30" cy="70" r="2"/>
      <circle cx="45" cy="75" r="2"/>
      <circle cx="60" cy="68" r="2"/>
      <circle cx="75" cy="73" r="2"/>
      <circle cx="37" cy="82" r="2"/>
      <circle cx="67" cy="80" r="2"/>
    </g>
  </svg>`,
  snow: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 55H30c-11 0-20-9-20-20s9-20 20-20c1 0 2 0 3 0C36 5 46-3 58-3c15 0 27 12 27 27 0 1 0 2 0 3 8 2 14 9 14 18 0 10-8 18-18 18h-6z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <g fill="#e2e8f0">
      <circle cx="30" cy="70" r="3"/>
      <circle cx="50" cy="75" r="3"/>
      <circle cx="70" cy="68" r="3"/>
      <circle cx="40" cy="85" r="3"/>
      <circle cx="60" cy="88" r="3"/>
    </g>
  </svg>`,
  fog: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="round">
      <line x1="15" y1="35" x2="85" y2="35"/>
      <line x1="20" y1="50" x2="80" y2="50"/>
      <line x1="15" y1="65" x2="85" y2="65"/>
      <line x1="25" y1="80" x2="75" y2="80"/>
    </g>
  </svg>`,
  thunderstorm: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 50H30c-11 0-20-9-20-20s9-20 20-20c1 0 2 0 3 0C36 0 46-8 58-8c15 0 27 12 27 27 0 1 0 2 0 3 8 2 14 9 14 18 0 10-8 18-18 18h-6z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
    <path d="M55 55l-10 20h12l-8 20 18-25h-12l8-15h-8z" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    <g stroke="#60a5fa" stroke-width="2" stroke-linecap="round">
      <line x1="25" y1="60" x2="20" y2="75"/>
      <line x1="75" y1="58" x2="70" y2="73"/>
    </g>
  </svg>`
};

// ===== DOM ELEMENTS =====
const elements = {
  container: document.getElementById('container'),
  loadingState: document.getElementById('loadingState'),
  errorState: document.getElementById('errorState'),
  errorMessage: document.getElementById('errorMessage'),
  retryBtn: document.getElementById('retryBtn'),
  manualSearch: document.getElementById('manualSearch'),
  manualSearchInput: document.getElementById('manualSearchInput'),
  manualSearchBtn: document.getElementById('manualSearchBtn'),
  weatherContent: document.getElementById('weatherContent'),
  locationName: document.getElementById('locationName'),
  lockBtn: document.getElementById('lockBtn'),
  lockIcon: document.getElementById('lockIcon'),
  unlockIcon: document.getElementById('unlockIcon'),
  refreshBtn: document.getElementById('refreshBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  weatherIconWrapper: document.getElementById('weatherIconWrapper'),
  temperatureValue: document.getElementById('temperatureValue'),
  temperatureUnit: document.getElementById('temperatureUnit'),
  weatherDescription: document.getElementById('weatherDescription'),
  apparentTemp: document.getElementById('apparentTemp'),
  statsGrid: document.getElementById('statsGrid'),
  // Stat values
  tempValue: document.getElementById('tempValue'),
  humidityValue: document.getElementById('humidityValue'),
  windValue: document.getElementById('windValue'),
  uvValue: document.getElementById('uvValue'),
  precipValue: document.getElementById('precipValue'),
  visibilityValue: document.getElementById('visibilityValue'),
  cloudValue: document.getElementById('cloudValue'),
  pressureValue: document.getElementById('pressureValue'),
  dewPointValue: document.getElementById('dewPointValue'),
  lastUpdated: document.getElementById('lastUpdated'),
  cacheIndicator: document.getElementById('cacheIndicator')
};

// ===== STATE =====
let currentSettings = null;
let isGridLocked = true;
let retryCount = 0;
const MAX_RETRIES = 2;

// ===== DRAG & DROP MODULE (Mouse Events Based) =====
const DragDropModule = {
  draggedCard: null,
  draggedCardRect: null,
  placeholder: null,
  initialX: 0,
  initialY: 0,
  currentX: 0,
  currentY: 0,
  offsetX: 0,
  offsetY: 0,

  init() {
    this.cards = Array.from(elements.statsGrid.querySelectorAll('.stat-card'));
    this.bindEvents();
  },

  bindEvents() {
    // Remove old listeners if any
    this.cards.forEach(card => {
      card.removeEventListener('mousedown', this.handleMouseDown);
    });

    // Add new listeners
    this.cards.forEach(card => {
      card.addEventListener('mousedown', this.handleMouseDown.bind(this));
    });

    // Global listeners for move and up
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  },

  enable() {
    this.cards.forEach(card => {
      card.classList.add('draggable');
    });
  },

  disable() {
    this.cards.forEach(card => {
      card.classList.remove('draggable', 'dragging');
    });
  },

  handleMouseDown(e) {
    if (isGridLocked) return;

    const card = e.target.closest('.stat-card');
    if (!card) return;

    e.preventDefault();

    this.draggedCard = card;
    this.draggedCardRect = card.getBoundingClientRect();

    // Calculate offset from mouse to card top-left
    this.offsetX = e.clientX - this.draggedCardRect.left;
    this.offsetY = e.clientY - this.draggedCardRect.top;

    // Store initial position
    this.initialX = e.clientX;
    this.initialY = e.clientY;

    // Create placeholder
    this.placeholder = document.createElement('div');
    this.placeholder.className = 'stat-card placeholder';
    this.placeholder.style.width = this.draggedCardRect.width + 'px';
    this.placeholder.style.height = this.draggedCardRect.height + 'px';

    // Set card to fixed position for dragging
    card.classList.add('dragging');
    card.style.position = 'fixed';
    card.style.width = this.draggedCardRect.width + 'px';
    card.style.height = this.draggedCardRect.height + 'px';
    card.style.left = this.draggedCardRect.left + 'px';
    card.style.top = this.draggedCardRect.top + 'px';
    card.style.zIndex = '1000';

    // Insert placeholder
    card.parentNode.insertBefore(this.placeholder, card);
  },

  handleMouseMove(e) {
    if (!this.draggedCard || isGridLocked) return;

    e.preventDefault();

    // Update position
    this.currentX = e.clientX - this.offsetX;
    this.currentY = e.clientY - this.offsetY;

    this.draggedCard.style.left = this.currentX + 'px';
    this.draggedCard.style.top = this.currentY + 'px';

    // Find the card we're hovering over
    const hoveredCard = this.getHoveredCard(e.clientX, e.clientY);

    if (hoveredCard && hoveredCard !== this.draggedCard && hoveredCard !== this.placeholder) {
      // Move placeholder to new position
      const hoveredRect = hoveredCard.getBoundingClientRect();
      const hoveredIndex = this.cards.indexOf(hoveredCard);
      const placeholderIndex = Array.from(elements.statsGrid.children).indexOf(this.placeholder);

      if (hoveredIndex !== placeholderIndex) {
        // Determine if we should insert before or after
        const centerY = hoveredRect.top + hoveredRect.height / 2;
        const centerX = hoveredRect.left + hoveredRect.width / 2;

        if (e.clientY < centerY || (e.clientY >= centerY && e.clientX < centerX)) {
          hoveredCard.parentNode.insertBefore(this.placeholder, hoveredCard);
        } else {
          hoveredCard.parentNode.insertBefore(this.placeholder, hoveredCard.nextSibling);
        }
      }
    }
  },

  handleMouseUp(e) {
    if (!this.draggedCard) return;

    // Reset card styles
    this.draggedCard.classList.remove('dragging');
    this.draggedCard.style.position = '';
    this.draggedCard.style.width = '';
    this.draggedCard.style.height = '';
    this.draggedCard.style.left = '';
    this.draggedCard.style.top = '';
    this.draggedCard.style.zIndex = '';

    // Replace placeholder with dragged card
    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.insertBefore(this.draggedCard, this.placeholder);
      this.placeholder.parentNode.removeChild(this.placeholder);
    }

    // Save the new order
    this.saveOrder();

    // Update cards array
    this.cards = Array.from(elements.statsGrid.querySelectorAll('.stat-card'));

    // Reset state
    this.draggedCard = null;
    this.placeholder = null;
  },

  getHoveredCard(x, y) {
    for (const card of this.cards) {
      if (card === this.draggedCard) continue;

      const rect = card.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return card;
      }
    }
    return null;
  },

  saveOrder() {
    const order = Array.from(elements.statsGrid.querySelectorAll('.stat-card'))
      .map(card => card.dataset.stat);
    browser.storage.local.set({ gridOrder: order });
    console.log('Grid order saved:', order);
  },

  async loadOrder() {
    try {
      const stored = await browser.storage.local.get('gridOrder');
      if (stored.gridOrder && Array.isArray(stored.gridOrder)) {
        const order = stored.gridOrder;
        const cardsByType = {};

        // Map cards by their stat type
        this.cards.forEach(card => {
          cardsByType[card.dataset.stat] = card;
        });

        // Reorder based on saved order
        order.forEach(statType => {
          if (cardsByType[statType]) {
            elements.statsGrid.appendChild(cardsByType[statType]);
          }
        });

        // Update cards array
        this.cards = Array.from(elements.statsGrid.querySelectorAll('.stat-card'));

        console.log('Grid order loaded:', order);
      }
    } catch (error) {
      console.error('Failed to load grid order:', error);
    }
  },

  async resetOrder() {
    const defaultOrder = [
      'temperature', 'humidity', 'wind', 'uv',
      'precipitation', 'visibility', 'cloud', 'pressure', 'dewpoint'
    ];

    const cardsByType = {};
    this.cards.forEach(card => {
      cardsByType[card.dataset.stat] = card;
    });

    defaultOrder.forEach(statType => {
      if (cardsByType[statType]) {
        elements.statsGrid.appendChild(cardsByType[statType]);
      }
    });

    // Clear saved order
    await browser.storage.local.remove('gridOrder');

    // Update cards array
    this.cards = Array.from(elements.statsGrid.querySelectorAll('.stat-card'));

    console.log('Grid order reset to default');
  }
};

// ===== LOCK/UNLOCK FUNCTIONALITY =====
function toggleLock() {
  isGridLocked = !isGridLocked;

  if (isGridLocked) {
    // Locked state
    elements.lockIcon.classList.remove('hidden');
    elements.unlockIcon.classList.add('hidden');
    elements.lockBtn.classList.remove('unlocked');
    elements.container.classList.remove('unlocked');
    DragDropModule.disable();
  } else {
    // Unlocked state - warning mode
    elements.lockIcon.classList.add('hidden');
    elements.unlockIcon.classList.remove('hidden');
    elements.lockBtn.classList.add('unlocked');
    elements.container.classList.add('unlocked');
    DragDropModule.enable();
  }
}

// Double-click to reset grid order
function handleLockDoubleClick(e) {
  e.preventDefault();
  e.stopPropagation();
  DragDropModule.resetOrder();
  // Ensure we're in locked state after reset
  if (!isGridLocked) {
    toggleLock();
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  DragDropModule.init();
  await DragDropModule.loadOrder();
  await loadWeatherData();
  setupEventListeners();
});

// ===== SETTINGS =====
async function loadSettings() {
  try {
    const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
    currentSettings = response;
  } catch (error) {
    console.error('Failed to load settings:', error);
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

// ===== WEATHER DATA LOADING =====
async function loadWeatherData() {
  showLoading();

  try {
    const response = await browser.runtime.sendMessage({ type: 'GET_WEATHER' });

    if (response.success) {
      retryCount = 0;
      updateUI(response.data, response.fromCache);
      showWeather();
    } else {
      handleLoadError(response.error || 'Failed to load weather data');
    }
  } catch (error) {
    console.error('Error loading weather:', error);
    handleLoadError('Unable to connect to weather service');
  }
}

// Handle load errors with automatic retry
async function handleLoadError(message) {
  retryCount++;

  if (retryCount <= MAX_RETRIES) {
    console.log(`Retry attempt ${retryCount}/${MAX_RETRIES}...`);
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    return loadWeatherData();
  }

  // Max retries exceeded - show error with manual search option
  showError(message);
  elements.manualSearch.classList.remove('hidden');
}

// Refresh weather data
async function refreshWeather() {
  elements.refreshBtn.classList.add('refreshing');
  retryCount = 0;

  try {
    const response = await browser.runtime.sendMessage({ type: 'REFRESH_WEATHER' });

    if (response.success) {
      updateUI(response.data, false);
      showWeather();
    } else {
      handleLoadError(response.error || 'Failed to refresh weather data');
    }
  } catch (error) {
    console.error('Error refreshing weather:', error);
    handleLoadError('Unable to refresh weather data');
  } finally {
    elements.refreshBtn.classList.remove('refreshing');
  }
}

// Manual city search
async function searchByCity() {
  const city = elements.manualSearchInput.value.trim();
  if (!city) return;

  showLoading();

  try {
    const response = await browser.runtime.sendMessage({
      type: 'SEARCH_CITY',
      city: city
    });

    if (response.success) {
      updateUI(response.data, false);
      showWeather();
      elements.manualSearch.classList.add('hidden');
      elements.manualSearchInput.value = '';
    } else {
      showError(response.error || 'City not found');
      elements.manualSearch.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error searching city:', error);
    showError('Unable to search for city');
    elements.manualSearch.classList.remove('hidden');
  }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  elements.refreshBtn.addEventListener('click', refreshWeather);
  elements.retryBtn.addEventListener('click', () => {
    retryCount = 0;
    elements.manualSearch.classList.add('hidden');
    loadWeatherData();
  });
  elements.settingsBtn.addEventListener('click', () => {
    browser.runtime.openOptionsPage();
  });

  // Lock button - single click to toggle, double click to reset
  elements.lockBtn.addEventListener('click', toggleLock);
  elements.lockBtn.addEventListener('dblclick', handleLockDoubleClick);

  // Manual search
  elements.manualSearchBtn.addEventListener('click', searchByCity);
  elements.manualSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchByCity();
    }
  });
}

// ===== UI STATE MANAGEMENT =====
function showLoading() {
  elements.loadingState.classList.remove('hidden');
  elements.errorState.classList.add('hidden');
  elements.weatherContent.classList.add('hidden');
}

function showError(message) {
  elements.loadingState.classList.add('hidden');
  elements.errorState.classList.remove('hidden');
  elements.weatherContent.classList.add('hidden');
  elements.errorMessage.textContent = message;
}

function showWeather() {
  elements.loadingState.classList.add('hidden');
  elements.errorState.classList.add('hidden');
  elements.weatherContent.classList.remove('hidden');
}

// ===== UI UPDATE =====
function updateUI(data, fromCache) {
  const isMetric = currentSettings.units === 'metric';

  // Update container background based on weather condition
  elements.container.dataset.condition = data.weatherCondition;
  elements.container.dataset.day = data.isDay.toString();

  // Update location
  elements.locationName.textContent = data.location?.name || 'Unknown Location';

  // Update weather icon
  const iconKey = getWeatherIconKey(data.weatherCondition, data.isDay);
  elements.weatherIconWrapper.innerHTML = WEATHER_ICONS[iconKey] || WEATHER_ICONS.cloudy;

  // Update main temperature display
  const temp = isMetric ? data.temperature : celsiusToFahrenheit(data.temperature);
  elements.temperatureValue.textContent = Math.round(temp);
  elements.temperatureUnit.textContent = isMetric ? '°C' : '°F';

  // Update weather description
  elements.weatherDescription.textContent = data.weatherDescription;

  // Update apparent temperature
  if (currentSettings.showApparentTemp) {
    const apparentTemp = isMetric ? data.apparentTemperature : celsiusToFahrenheit(data.apparentTemperature);
    elements.apparentTemp.textContent = `Feels like ${Math.round(apparentTemp)}°`;
    elements.apparentTemp.classList.remove('hidden');
  } else {
    elements.apparentTemp.classList.add('hidden');
  }

  // Update stat cards
  // Temperature card
  elements.tempValue.textContent = `${Math.round(temp)}°`;

  // Humidity
  elements.humidityValue.textContent = `${Math.round(data.humidity)}%`;

  // Wind speed
  const windSpeed = isMetric ? data.windSpeed : kmhToMph(data.windSpeed);
  const windUnit = isMetric ? 'km/h' : 'mph';
  elements.windValue.textContent = `${Math.round(windSpeed)} ${windUnit}`;

  // UV Index
  elements.uvValue.textContent = formatUVIndex(data.uvIndex);

  // Precipitation
  elements.precipValue.textContent = `${data.precipitationProbability || 0}%`;

  // Visibility
  const visibility = isMetric ? data.visibility / 1000 : (data.visibility / 1000) * 0.621371;
  const visUnit = isMetric ? 'km' : 'mi';
  elements.visibilityValue.textContent = `${visibility.toFixed(1)} ${visUnit}`;

  // Cloud cover
  elements.cloudValue.textContent = `${data.cloudCover}%`;

  // Pressure
  elements.pressureValue.textContent = `${Math.round(data.pressure)} hPa`;

  // Dew point
  const dewPoint = isMetric ? data.dewPoint : celsiusToFahrenheit(data.dewPoint);
  elements.dewPointValue.textContent = `${Math.round(dewPoint)}°`;

  // Update last updated time
  const lastUpdated = new Date(data.lastUpdated);
  elements.lastUpdated.textContent = `Updated ${formatTime(lastUpdated)}`;

  // Show cache indicator if from cache
  if (fromCache) {
    elements.cacheIndicator.classList.remove('hidden');
  } else {
    elements.cacheIndicator.classList.add('hidden');
  }

  // Apply visibility settings to stat cards
  applyStatVisibility();
}

// ===== STAT CARD VISIBILITY =====
function applyStatVisibility() {
  const statToSettingMap = {
    'temperature': 'showTemperature',
    'humidity': 'showHumidity',
    'wind': 'showWindSpeed',
    'uv': 'showUvIndex',
    'precipitation': 'showPrecipitation',
    'visibility': 'showVisibility',
    'cloud': 'showCloudCover',
    'pressure': 'showPressure',
    'dewpoint': 'showDewPoint'
  };

  const statCards = elements.statsGrid.querySelectorAll('.stat-card');

  statCards.forEach(card => {
    const statType = card.dataset.stat;
    const settingKey = statToSettingMap[statType];

    if (settingKey && currentSettings[settingKey] === false) {
      card.classList.add('hidden');
    } else {
      card.classList.remove('hidden');
    }
  });
}

// ===== HELPER FUNCTIONS =====
function getWeatherIconKey(condition, isDay) {
  switch (condition) {
    case 'clear':
      return isDay ? 'clear_day' : 'clear_night';
    case 'cloudy':
      return 'cloudy';
    case 'rain':
      return 'rain';
    case 'drizzle':
      return 'drizzle';
    case 'snow':
      return 'snow';
    case 'fog':
      return 'fog';
    case 'thunderstorm':
      return 'thunderstorm';
    default:
      return 'cloudy';
  }
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function kmhToMph(kmh) {
  return kmh * 0.621371;
}

function formatUVIndex(uv) {
  if (uv === null || uv === undefined) return '--';
  return Math.round(uv).toString();
}

function formatTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
