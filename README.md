# WEATHER-BUSTER 9000 XXX

> *Now with offensive capabilities. We don't talk about it...*

A retro-aggressive Firefox weather extension featuring a stunning glassmorphism UI, draggable statistics grid, and real-time weather data powered by the Open-Meteo API.

![Firefox Extension](https://img.shields.io/badge/Firefox-Manifest%20V3-FF7139?logo=firefox-browser)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Core Functionality
- **Real-time Weather Data** - Current conditions fetched from Open-Meteo API
- **Automatic Location Detection** - Uses browser geolocation with IP fallback
- **Manual City Search** - Search any city worldwide when geolocation fails
- **Smart Caching** - 15-minute cache to reduce API calls and improve performance
- **Background Updates** - Automatic refresh via browser alarms

### Customizable Display
| Primary Stats | Additional Stats |
|--------------|------------------|
| Temperature | Apparent Temperature ("Feels like") |
| Humidity | Precipitation Probability |
| Wind Speed | Visibility |
| UV Index | Cloud Cover |
|  | Atmospheric Pressure |
|  | Dew Point |

All stats can be toggled on/off individually in the settings panel.

### User Interface
- **Glassmorphism Design** - Modern frosted glass aesthetic
- **Draggable Grid** - Rearrange stat cards to your preference (unlock to drag, double-click lock to reset)
- **Dynamic Weather Icons** - SVG icons that change based on conditions (clear, cloudy, rain, snow, fog, thunderstorm)
- **Day/Night Themes** - Visual adaptation based on current time
- **Metric/Imperial Units** - Toggle between °C/km/h and °F/mph

## Installation

### From Source

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/firefox-weather-verbose.git
   ```

2. Open Firefox and navigate to `about:debugging`

3. Click "This Firefox" in the left sidebar

4. Click "Load Temporary Add-on..."

5. Navigate to the extension folder and select `manifest.json`

### Permanent Installation

1. Package the extension as a `.zip` file (excluding `.git` and any dev files)
2. Rename to `.xpi`
3. Sign the extension via [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
4. Install the signed `.xpi` file

## Usage

### Basic Operation

1. **Click the extension icon** in your Firefox toolbar to open the popup
2. **Grant location permission** when prompted (or use manual search)
3. **View current weather** for your location

### Customizing the Display

1. Click the **settings icon** (sliders) in the popup header
2. Select your preferred **unit system** (Metric or Imperial)
3. Toggle **individual stats** on/off under Display Options
4. Changes are saved automatically

### Rearranging Stats

1. Click the **lock icon** to unlock the grid
2. **Drag and drop** stat cards to rearrange
3. Click the lock icon again to save your layout
4. **Double-click** the lock icon to reset to default order

### Manual City Search

If automatic location detection fails:
1. A search field will appear
2. Enter any city name (e.g., "London", "Tokyo", "New York")
3. Press Enter or click Search

## Project Structure

```
firefox-weather-verbose/
├── manifest.json           # Extension manifest (MV3)
├── background/
│   └── background.js       # Service worker for data fetching & caching
├── popup/
│   ├── popup.html          # Main popup interface
│   ├── popup.js            # Popup logic, drag & drop, UI updates
│   └── popup.css           # Glassmorphism styles
├── options/
│   ├── options.html        # Settings page
│   ├── options.js          # Settings logic
│   └── options.css         # Settings styles
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## API Reference

### Open-Meteo (Weather Data)
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **Documentation**: [open-meteo.com](https://open-meteo.com/en/docs)
- **Rate Limits**: Free tier, no API key required

### Fallback Services
- **IP Geolocation**: `https://ipapi.co/json/` (when browser geolocation fails)
- **Reverse Geocoding**: `https://nominatim.openstreetmap.org/reverse` (OpenStreetMap)

## Weather Codes

The extension interprets WMO weather codes:

| Code Range | Condition |
|------------|-----------|
| 0-1 | Clear |
| 2-3 | Cloudy |
| 45-48 | Fog |
| 51-57 | Drizzle |
| 61-67 | Rain |
| 71-77 | Snow |
| 80-86 | Showers |
| 95-99 | Thunderstorm |

## Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Save settings and cache weather data |
| `geolocation` | Detect user location for local weather |
| `alarms` | Schedule background weather updates |

### Host Permissions
- `api.open-meteo.com` - Weather data
- `geocoding-api.open-meteo.com` - City search
- `ipapi.co` - IP-based location fallback
- `nominatim.openstreetmap.org` - Reverse geocoding

## Browser Compatibility

- **Firefox**: 109.0+ (Manifest V3 required)
- Other Chromium browsers may work with minor manifest modifications

## Development

### Requirements
- Firefox 109+
- No build tools required (vanilla JS/CSS)

### Local Development
1. Load as temporary add-on in `about:debugging`
2. Make changes to source files
3. Click "Reload" in `about:debugging` to see changes

### Debugging
- Open Browser Console (`Ctrl+Shift+J`) for background script logs
- Right-click popup → "Inspect" for popup console

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Known Issues

- Firefox MV3 geolocation may require multiple attempts (handled with retry logic)
- Some corporate networks block IP geolocation services

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Geocoding by [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)
- Icons inspired by [Lucide](https://lucide.dev/)

---

*WEATHER-BUSTER 9000 XXX - Because checking the weather should feel dangerous.*
