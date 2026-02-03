// WEATHER-BUSTER 9000 XXX - Background Service Worker
// Handles weather data fetching, caching, and background polling

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
const ALARM_NAME = 'weather-refresh';
const ALARM_INTERVAL = 15; // minutes
const GEOLOCATION_RETRIES = 3;
const GEOLOCATION_RETRY_DELAY = 500; // ms

// Default settings
const DEFAULT_SETTINGS = {
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

// Weather code mapping to descriptions and conditions
const WEATHER_CODES = {
  0: { description: 'Clear sky', condition: 'clear' },
  1: { description: 'Mainly clear', condition: 'clear' },
  2: { description: 'Partly cloudy', condition: 'cloudy' },
  3: { description: 'Overcast', condition: 'cloudy' },
  45: { description: 'Foggy', condition: 'fog' },
  48: { description: 'Depositing rime fog', condition: 'fog' },
  51: { description: 'Light drizzle', condition: 'drizzle' },
  53: { description: 'Moderate drizzle', condition: 'drizzle' },
  55: { description: 'Dense drizzle', condition: 'drizzle' },
  56: { description: 'Light freezing drizzle', condition: 'drizzle' },
  57: { description: 'Dense freezing drizzle', condition: 'drizzle' },
  61: { description: 'Slight rain', condition: 'rain' },
  63: { description: 'Moderate rain', condition: 'rain' },
  65: { description: 'Heavy rain', condition: 'rain' },
  66: { description: 'Light freezing rain', condition: 'rain' },
  67: { description: 'Heavy freezing rain', condition: 'rain' },
  71: { description: 'Slight snow', condition: 'snow' },
  73: { description: 'Moderate snow', condition: 'snow' },
  75: { description: 'Heavy snow', condition: 'snow' },
  77: { description: 'Snow grains', condition: 'snow' },
  80: { description: 'Slight rain showers', condition: 'rain' },
  81: { description: 'Moderate rain showers', condition: 'rain' },
  82: { description: 'Violent rain showers', condition: 'rain' },
  85: { description: 'Slight snow showers', condition: 'snow' },
  86: { description: 'Heavy snow showers', condition: 'snow' },
  95: { description: 'Thunderstorm', condition: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', condition: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', condition: 'thunderstorm' }
};

// Initialize extension
browser.runtime.onInstalled.addListener(async () => {
  console.log('WEATHER-BUSTER 9000 XXX installed');
  await initializeSettings();
  await setupAlarm();
  await refreshWeatherData();
});

// Handle startup
browser.runtime.onStartup.addListener(async () => {
  console.log('WEATHER-BUSTER 9000 XXX started');
  await setupAlarm();
  await refreshWeatherData();
});

// Initialize default settings
async function initializeSettings() {
  const stored = await browser.storage.local.get('settings');
  if (!stored.settings) {
    await browser.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
}

// Setup background alarm for periodic refresh
async function setupAlarm() {
  await browser.alarms.clear(ALARM_NAME);
  browser.alarms.create(ALARM_NAME, {
    periodInMinutes: ALARM_INTERVAL
  });
}

// Listen for alarm
browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('Alarm triggered: refreshing weather data');
    await refreshWeatherData();
  }
});

// Listen for messages from popup/options
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_WEATHER') {
    getWeatherData().then(sendResponse);
    return true; // Keep channel open for async response
  }
  if (message.type === 'REFRESH_WEATHER') {
    refreshWeatherData().then(sendResponse);
    return true;
  }
  if (message.type === 'SEARCH_CITY') {
    searchCityWeather(message.city).then(sendResponse);
    return true;
  }
  if (message.type === 'GET_SETTINGS') {
    browser.storage.local.get('settings').then(result => {
      sendResponse(result.settings || DEFAULT_SETTINGS);
    });
    return true;
  }
  if (message.type === 'SAVE_SETTINGS') {
    browser.storage.local.set({ settings: message.settings }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Get cached weather data or fetch new
async function getWeatherData() {
  const cached = await browser.storage.local.get('weatherCache');

  if (cached.weatherCache) {
    const { data, timestamp } = cached.weatherCache;
    const age = Date.now() - timestamp;

    if (age < CACHE_TTL) {
      console.log('Returning cached weather data');
      return { success: true, data, fromCache: true };
    }
  }

  return await refreshWeatherData();
}

// Force refresh weather data
async function refreshWeatherData() {
  try {
    const location = await getLocation();
    if (!location.success) {
      return { success: false, error: location.error };
    }

    const weather = await fetchWeatherData(location.data);
    if (!weather.success) {
      return { success: false, error: weather.error };
    }

    const weatherData = {
      ...weather.data,
      location: location.data
    };

    // Cache the data
    await browser.storage.local.set({
      weatherCache: {
        data: weatherData,
        timestamp: Date.now()
      }
    });

    console.log('Weather data refreshed and cached');
    return { success: true, data: weatherData, fromCache: false };
  } catch (error) {
    console.error('Error refreshing weather data:', error);
    return { success: false, error: error.message };
  }
}

// Search weather by city name
async function searchCityWeather(cityName) {
  try {
    // Use Open-Meteo geocoding API to find city
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geocodeResponse = await fetch(geocodeUrl);

    if (!geocodeResponse.ok) {
      throw new Error('Geocoding API failed');
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      return { success: false, error: `City "${cityName}" not found` };
    }

    const result = geocodeData.results[0];
    const location = {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.admin1
        ? `${result.name}, ${result.admin1}, ${result.country}`
        : `${result.name}, ${result.country}`,
      source: 'search'
    };

    const weather = await fetchWeatherData(location);
    if (!weather.success) {
      return { success: false, error: weather.error };
    }

    const weatherData = {
      ...weather.data,
      location: location
    };

    // Cache the data
    await browser.storage.local.set({
      weatherCache: {
        data: weatherData,
        timestamp: Date.now()
      }
    });

    console.log('Weather data fetched for city:', cityName);
    return { success: true, data: weatherData, fromCache: false };
  } catch (error) {
    console.error('Error searching city:', error);
    return { success: false, error: error.message };
  }
}

// Get user location with retry logic for Firefox MV3 bug
async function getLocation() {
  // Try browser geolocation first with retries
  for (let attempt = 1; attempt <= GEOLOCATION_RETRIES; attempt++) {
    try {
      console.log(`Geolocation attempt ${attempt}/${GEOLOCATION_RETRIES}`);

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get location name
      const locationName = await reverseGeocode(latitude, longitude);

      console.log('Geolocation successful:', locationName);

      return {
        success: true,
        data: {
          latitude,
          longitude,
          name: locationName,
          source: 'geolocation'
        }
      };
    } catch (geoError) {
      console.log(`Geolocation attempt ${attempt} failed:`, geoError.message);

      if (attempt < GEOLOCATION_RETRIES) {
        // Wait before retrying (helps with Firefox MV3 timing issues)
        await new Promise(resolve => setTimeout(resolve, GEOLOCATION_RETRY_DELAY));
      }
    }
  }

  console.log('All geolocation attempts failed, falling back to IP');

  // Fallback to IP-based location
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('IP location API failed');

    const data = await response.json();

    return {
      success: true,
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        name: `${data.city}, ${data.country_name}`,
        source: 'ip'
      }
    };
  } catch (ipError) {
    console.error('IP location failed:', ipError);
    return {
      success: false,
      error: 'Unable to determine location. Please check your permissions or try manual search.'
    };
  }
}

// Reverse geocode coordinates to location name
async function reverseGeocode(latitude, longitude) {
  // Try Open-Meteo geocoding (using nearby search)
  try {
    // Open-Meteo doesn't have true reverse geocoding, so we'll use ipapi.co for this
    const response = await fetch(`https://ipapi.co/json/`);
    if (response.ok) {
      const data = await response.json();
      // Check if coordinates are close enough
      const latDiff = Math.abs(data.latitude - latitude);
      const lonDiff = Math.abs(data.longitude - longitude);

      if (latDiff < 0.5 && lonDiff < 0.5) {
        return `${data.city}, ${data.country_name}`;
      }
    }
  } catch (error) {
    console.log('ipapi.co reverse geocode failed:', error);
  }

  // Try Nominatim as backup (OpenStreetMap)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'WEATHER-BUSTER-9000-XXX/1.0'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const address = data.address;

      // Build a nice location name
      const city = address.city || address.town || address.village || address.municipality || address.county;
      const country = address.country;

      if (city && country) {
        return `${city}, ${country}`;
      } else if (data.display_name) {
        // Fallback to first two parts of display_name
        const parts = data.display_name.split(',').map(s => s.trim());
        return parts.slice(0, 2).join(', ');
      }
    }
  } catch (error) {
    console.log('Nominatim reverse geocode failed:', error);
  }

  return 'Current Location';
}

// Fetch weather data from Open-Meteo API
async function fetchWeatherData(location) {
  try {
    const { latitude, longitude } = location;

    // Build API URL with all parameters we might need
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'uv_index',
        'is_day',
        'visibility',
        'dew_point_2m'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'uv_index_max'
      ].join(','),
      timezone: 'auto',
      forecast_days: '1'
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();

    // Parse and structure the weather data
    const current = data.current;
    const weatherCode = current.weather_code;
    const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Unknown', condition: 'clear' };

    return {
      success: true,
      data: {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        precipitationProbability: data.daily?.precipitation_probability_max?.[0] || 0,
        weatherCode,
        weatherDescription: weatherInfo.description,
        weatherCondition: weatherInfo.condition,
        cloudCover: current.cloud_cover,
        pressure: current.pressure_msl,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        windGusts: current.wind_gusts_10m,
        uvIndex: current.uv_index,
        visibility: current.visibility,
        dewPoint: current.dew_point_2m,
        isDay: current.is_day === 1,
        units: {
          temperature: data.current_units.temperature_2m,
          windSpeed: data.current_units.wind_speed_10m,
          visibility: data.current_units.visibility,
          pressure: data.current_units.pressure_msl
        },
        timezone: data.timezone,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Weather fetch failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
