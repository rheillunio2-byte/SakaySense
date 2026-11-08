<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&height=220&color=0:081B33,45:123D5A,100:DAA520&text=SAKAYSENSE&fontColor=FFFFFF&fontSize=58&fontAlignY=42&desc=Navigate%20Smarter.%20Travel%20Better.&descAlignY=65&descSize=17&animation=fadeIn" width="100%" />

<img src="https://readme-typing-svg.demolab.com?font=Montserrat&weight=600&size=21&duration=3000&pause=1000&color=DAA520&center=true&vCenter=true&width=750&lines=Every+Route+Has+a+Smarter+Way.;Know+Your+Route.+Know+Your+Fare.;Stay+Updated.+Travel+Confidently.;Your+Journey+Starts+with+SakaySense." alt="Animated introduction" />

**A public transportation information system designed to help commuters explore routes, estimate fares, and stay informed about transportation conditions.**

[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-DAA520?style=for-the-badge)](#-license)
[![Status](https://img.shields.io/badge/Status-Prototype-123D5A?style=for-the-badge)](#)

[Overview](#-overview) • [Features](#-features) • [Transportation Modes](#-transportation-modes) • [Installation](#-installation) • [Contributing](#-contributing)

</div>

---

## 🚌 Overview

**SakaySense** is a public transportation information system designed to make commuting more convenient, understandable, and accessible.

Finding the right public transportation route can be challenging, especially when commuters need to consider multiple transportation options, fares, and possible delays.

SakaySense aims to address these challenges by providing a centralized platform where commuters can explore available transportation routes, estimate their travel expenses, and share information about transport delays.

Designed around the public transportation environment of **Cagayan de Oro City, Misamis Oriental, Philippines**, the system focuses on making local commuting information easier to access.

Whether someone is traveling to school, work, or another destination, SakaySense aims to help them make more informed transportation decisions.

### ✨ Our Mission

To make public transportation information more accessible by helping commuters understand their travel options, prepare their fares, and stay informed about possible disruptions.

> **EXPLORE. ESTIMATE. REPORT. COMMUTE.**

---

## 📸 Application Preview

The application preview images can be added to the `images/` folder as the interface evolves.

| Screen | Screenshot path |
|---|---|
| Main Dashboard | `images/Dashboard.PNG` |
| Trip Planner & Map | `images/Routes.PNG` |
| Fare Estimator | `images/Fare Estimator.PNG` |
| Transport Delay Reports | `images/Delay Reports.PNG` |
| Transportation Options | `images/Transportation Modes.PNG` |

---

## 🚀 Features

### 🗺️ 1. Interactive Map
- Built with **Leaflet.js** and **OpenStreetMap** data. The default basemap is Esri World Street Map (no API key needed); a layers button switches to OpenStreetMap Standard or OpenTopoMap. OSM's own tile server rejects requests with no valid Referer (for example pages opened from `file://`) and CARTO's free tiles now need a key, so neither is the default. Check each provider's terms before commercial use, centred on Cagayan de Oro City.
- Zoom, pan and explore (mouse, touch, on-screen buttons, or keyboard once the map is focused).
- Starting point (**A**) and destination (**B**) markers with popups.
- The map zooms to fit both places automatically.
- A dashed **straight-line link** connects A and B. It is only a visual aid — it is **not** a jeepney, bus or motorela route, and is labelled that way on the map, in the legend and in the results.
- **Recenter** and **Fit trip** buttons, a scale bar, a collapsible legend and OpenStreetMap attribution.
- Responsive: the map is a large side panel on desktop and sits above the planner on tablets and phones.
- If the map library cannot load (offline), a message appears and everything else keeps working.

### 🔎 2. Location Search & Autocomplete
- Free-text search for practically any place, street, barangay, landmark or establishment, using **OpenStreetMap Nominatim**.
- Instant local suggestions: Limketkai Center, SM City Cagayan de Oro, Centrio Mall, Ayala Malls, Cogon Market, Divisoria, Agora / Westbound / Eastbound terminals, City Hall, Xavier University, USTP, Liceo de Cagayan University, Capitol University, Northern Mindanao Medical Center and Cagayan de Oro Port.
- Results show a place name and address, with loading, no-results and error (with *Retry*) states.
- By default results are limited to Cagayan de Oro; tick **Search outside Cagayan de Oro** to search anywhere.
- Debounced (600 ms), minimum 3 characters, one network request per second at most, in-flight requests cancelled, and results cached in memory and in this browser for 7 days.
- Keyboard accessible (ARIA combobox: ↑ ↓ Home End Enter Esc).

> **Note on Nominatim:** the public Nominatim server asks apps not to hammer it and discourages as-you-type autocomplete. SakaySense throttles and caches aggressively, but for real public deployment please use your own Nominatim instance or a commercial geocoder.

### 📍 3. Origin & Destination
- Enter, clear and **swap** the starting point and destination.
- Pick suggested places or search by free text.
- **Use my current location** (◎ button): the browser asks for permission only after you press it. Nothing is requested on page load.

### 🚦 4. Transport Options
Jeepney, Bus (Orostco / Donsal) and Motorela cards for a planned trip show:
- transport type, origin and destination,
- estimated fare (for the selected passenger category),
- estimated travel time,
- route name, intermediate stops, transfers and notes — **only when verified route data exists**; otherwise they are shown as *“Not available”* / *“Not determined”*.

**Honest by design:** SakaySense does not ship any verified route, fare or schedule database. Fares use the project's original sample rates; travel time uses assumed average speeds; road distance is the straight-line distance × 1.3. All of these are labelled **Estimate**. The original prototype's sample notes for a few place pairs are kept and shown as “Earlier sample note”.

To add real routes, fill in `js/routes-data.js` (the schema is documented in the file). Matching routes appear as **Route data** cards, with alternatives listed together.

### 💰 5. Fare Estimator
| Fare Category | Description |
|---|---|
| Regular | Standard passenger fare |
| Student | Sample 20% discount |
| Senior Citizen | Sample 20% discount |

- Choose a transport type, passenger category and distance (1–40 km).
- See a fare breakdown (base fare, additional distance, discount).
- Use the estimated distance from your planned trip with one click.
- The passenger category is shared with the trip planner.

*The calculator uses illustrative sample rates (unchanged from the original prototype), not an official fare matrix. Confirm actual fares and discounts with the operator or authority.*

### 🚦 6. Transport Delay Reports
- Submit reports with a location, transport type, issue and optional details; quick-fill the location from your trip.
- See saved reports with relative times; delete one report or all of them.
- Reports are stored in this browser's `localStorage` under the same key and format as before, so earlier saved reports still appear.
- Reports are **not** shared, verified or sent to any authority.

### 🎨 7. User Interface
- Original navy, teal and gold identity, now with a trip-planner dashboard.
- Responsive desktop and mobile layouts, working mobile menu, reduced-motion support and visible keyboard focus.

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| HTML5 | Application structure and content |
| CSS3 | Styling, animations, and responsive layouts |
| JavaScript (ES6+, no framework) | Interactive features, split into small modules in `js/` |
| [Leaflet.js 1.9.4](https://leafletjs.com/) | Interactive map (loaded from the unpkg CDN) |
| [OpenStreetMap](https://www.openstreetmap.org/) | Place data and search (Nominatim). Basemap tiles: Esri World Street Map by default, with OpenStreetMap Standard and OpenTopoMap selectable |
| [Nominatim](https://nominatim.org/) | Place search and reverse geocoding |
| Local Storage | Delay reports and the search cache |

- No backend, no build step, no npm install, **no API keys**.

---

## 📦 Installation

```bash
git clone https://github.com/rheillunio2-byte/SakaySense.git
cd SakaySense
```

### Run it
Serve the folder with any static server — for example the **Live Server** extension in Visual Studio Code (right-click `index.html` → *Open with Live Server*), or:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly also works for most features, but browsers may block location sharing on `file://` pages and some send no Referer to Nominatim. Using `http://localhost` is recommended.

### 🌐 Internet requirements
An internet connection is needed for the map tiles, the Leaflet library (CDN), Google Fonts and Nominatim searches. Offline, the app still loads; the map and place search are unavailable, while the fare estimator and delay reports keep working.

### 📍 Geolocation permissions
“Use my current location” asks your browser for permission when you press the button. It only works on `https://` or `http://localhost`. If you decline, you can type your starting point instead. If you allow it, your coordinates are sent to OpenStreetMap's Nominatim only to look up a street address, and are not stored by SakaySense.

---

## 📂 Project Structure

```text
SakaySense/
├── index.html
├── styles.css
├── app.js                # application entry point / wiring
├── js/
│   ├── utils.js          # shared helpers
│   ├── data.js           # place suggestions, sample fare & estimate models
│   ├── routes-data.js    # verified route dataset (empty — add real data here)
│   ├── geocoder.js       # Nominatim client: throttle, cache, errors
│   ├── location-field.js # accessible autocomplete component
│   ├── map.js            # Leaflet map wrapper
│   ├── routes.js         # transport options and result cards
│   ├── fare.js           # fare calculation and estimator UI
│   └── reports.js        # delay reports (localStorage)
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

---

## ⚠️ Data Accuracy & Limitations

- Routes, fares, travel times and distances are **estimates for orientation only**, not official information.
- There is **no live vehicle tracking**, schedule data or verified public-transport integration.
- The straight line on the map is not a transit route.
- Place data comes from OpenStreetMap and may be incomplete or out of date.
- Delay reports are local to your browser and unverified.

---

## 💡 Why SakaySense?

Commuting is part of everyday life. However, finding routes, understanding fares, and knowing about transportation delays can sometimes be difficult.

SakaySense aims to make these tasks easier by bringing useful public transportation information together in one platform.

### Our Core Principles

- **Accessibility** — Make transportation information easier to find.
- **Convenience** — Help commuters explore routes and estimate fares.
- **Awareness** — Give commuters a way to share transportation delay information.
- **Practicality** — Focus on everyday commuting needs.
- **Community** — Encourage commuters to contribute useful travel information.

---

## 🗺️ Future Improvements

- [x] Interactive map with place search (OpenStreetMap + Nominatim).
- [x] Browser-permission-based current location.
- [x] Estimated travel time (assumed speeds) and fare per trip.
- [ ] Verified, sourced route data (stops, names, transfers) in `js/routes-data.js`.
- [ ] Drawing real jeepney / bus / motorela routes from verified data (e.g. GeoJSON).
- [ ] Multi-leg journeys with transfers.
- [ ] Verified and regularly updated fare information.
- [ ] Real-time vehicle tracking (requires an operator data feed).
- [ ] Shared, moderated delay reports (requires a backend).
- [ ] Self-hosted geocoder and map tiles for production use.
- [ ] Saved places, favourites and notifications.
- [ ] Accessibility and multilingual improvements.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

If you would like to contribute to SakaySense, please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

You can contribute by:
- Reporting bugs.
- Suggesting new features.
- Improving route information.
- Updating transportation details.
- Improving fare estimation.
- Enhancing the user interface.
- Improving accessibility.
- Submitting code improvements.

### Basic Contribution Workflow

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your changes locally.
5. Commit your updates.
6. Submit a pull request.

---

## 📄 License

SakaySense is distributed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

## 👨‍💻 Developer

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=soft&color=0:081B33,100:123D5A&height=110&section=header&text=Built%20for%20Every%20Journey&fontSize=27&fontColor=FFFFFF&animation=fadeIn" width="100%"/>

### Rheil Evans T. Lunio

**Developer & Creator of SakaySense**

[![GitHub](https://img.shields.io/badge/GitHub-@rheillunio2--byte-181717?style=for-the-badge&logo=github)](https://github.com/rheillunio2-byte)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:081B33,50:123D5A,100:DAA520&height=170&section=footer&text=Every%20Journey%20Matters.&fontSize=28&fontColor=FFFFFF&animation=fadeIn&fontAlignY=65" width="100%"/>

**EXPLORE • ESTIMATE • REPORT • COMMUTE**

*Making every journey a little more informed.*

⭐ If you find SakaySense interesting, consider giving the repository a star!

</div>
