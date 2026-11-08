 <div align="center">

<img src="https://capsule-render.vercel.app/api?type=shark&height=230&color=0:071B33,45:075985,100:06B6D4&text=SakaySense&fontColor=FFFFFF&fontSize=68&fontAlignY=45&animation=twinkling&desc=Find%20your%20route.%20Move%20with%20confidence.&descAlignY=68&descSize=17" width="100%" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=17&duration=2800&pause=900&color=38BDF8&center=true&vCenter=true&width=750&lines=Your+journey+starts+with+SakaySense.;Explore+routes.+Discover+destinations.;Plan+smarter.+Travel+easier.;Making+commuting+more+accessible." alt="Typing SVG" />

<br/>

**A public transportation information system designed to help commuters navigate Cagayan de Oro City.**

<br/>

<img src="https://img.shields.io/badge/Project-Public%20Transportation-0284C7?style=for-the-badge&logo=googlemaps&logoColor=white" />
<img src="https://img.shields.io/badge/Platform-Web%20Application-0F766E?style=for-the-badge&logo=googlechrome&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-7C3AED?style=for-the-badge&logo=opensourceinitiative&logoColor=white" />

<br/><br/>

[Overview](#-overview) • [Features](#-key-features) • [Screenshots](#-screenshots) • [Getting Started](#-getting-started) • [Contributing](#-contributing) • [License](#-license)

</div>

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:06B6D4,100:1D4ED8&height=4&section=header" width="100%" />
</div>

## 📍 Overview

**SakaySense** is a public transportation information system designed to make commuting easier and more convenient in Cagayan de Oro City, Misamis Oriental, Philippines.

The platform helps commuters discover destinations, explore available transportation options, plan trips, estimate fares, and report transportation delays through a centralized interface.

With an interactive map and flexible location search, SakaySense aims to make public transportation information more accessible and understandable for everyday commuters.

### 🎯 Project Objectives

- Make public transportation information easier to access.
- Help commuters explore available transportation options.
- Simplify origin and destination searching.
- Provide estimated fare information for different passenger categories.
- Improve awareness of transportation delays.
- Encourage smarter and more convenient travel planning.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Interactive Map** | Explore locations and view selected origin and destination markers. |
| **Smart Location Search** | Search for destinations using place names, landmarks, and addresses. |
| **Trip Planner** | Select starting points and destinations to explore available travel options. |
| **Vehicle Options** | Explore supported transportation types, including jeepneys, buses, and motorelas. |
| **Fare Estimator** | View estimated fares based on passenger categories. |
| **Passenger Categories** | Supports Regular, Student, and Senior Citizen fare categories. |
| **Delay Reports** | Report and review transportation delays. |
| **Responsive Interface** | Designed for convenient use across desktop and mobile screens. |

---

## 🗺️ How It Works

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=soft&color=0:0F766E,100:0284C7&height=55&text=From%20Search%20to%20Destination&fontColor=FFFFFF&fontSize=20" width="90%" />

</div>

SakaySense follows a simple commuting workflow:

1. **Choose Your Location** – Enter your starting point and destination.
2. **Explore the Map** – View selected locations and their map markers.
3. **Discover Transportation** – Explore available vehicle and route information.
4. **Estimate Your Fare** – Select your passenger category and check the estimated fare.
5. **Stay Informed** – Check or submit transportation delay reports.

---

## 🖥️ Screenshots

Explore the different sections of the SakaySense interface.

### Main Page

<div align="center">

<img src="images/Main Page.PNG" width="95%" alt="SakaySense Main Page" />

<sub>The main SakaySense interface and commuting dashboard.</sub>

</div>

### Trip Planner

<div align="center">

<img src="images/Trip Planner.PNG" width="95%" alt="SakaySense Trip Planner" />

<sub>Plan journeys by selecting your origin and destination.</sub>

</div>

### Vehicle Options

<div align="center">

<img src="images/Vehicle Options.PNG" width="95%" alt="SakaySense Vehicle Options" />

<sub>Explore available public transportation options.</sub>

</div>

### Fare Estimator

<div align="center">

<img src="images/Fare Estimator.PNG" width="95%" alt="SakaySense Fare Estimator" />

<sub>Estimate transportation fares based on passenger categories.</sub>

</div>

### Delay Reports

<div align="center">

<img src="images/Delay Reports.PNG" width="95%" alt="SakaySense Delay Reports" />

<sub>View and report transportation delays.</sub>

</div>

---

## 🧰 Technology Stack

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)

</div>

### Frontend
- HTML5
- CSS3
- JavaScript

### Mapping and Location Services
- Leaflet.js
- OpenStreetMap
- Nominatim Geocoding Service

### Browser Features
- Browser Geolocation API
- LocalStorage (where implemented)

---

## 🚀 Getting Started

Follow these instructions to run SakaySense locally.

### Prerequisites

Make sure you have:

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) or another code editor.
- A modern web browser.
- An active internet connection for online map tiles and location search.

### 1. Clone the Repository

```bash
git clone https://github.com/rheillunio2-byte/SakaySense.git
```

### 2. Navigate to the Project Directory

```bash
cd SakaySense
```

### 3. Open the Project

Open the project folder in Visual Studio Code.

### 4. Run the Application

You can open `index.html` directly in your browser or use the Live Server extension in Visual Studio Code.

If using Live Server:

1. Open the project in Visual Studio Code.
2. Install the Live Server extension if necessary.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. Open the local address displayed in your browser.

---

## 🌐 Map and Location Search

SakaySense uses Leaflet and OpenStreetMap to provide an interactive map experience.

Nominatim can be used to search for locations and retrieve geographic coordinates.

**Important considerations:**

- An internet connection is required for online map tiles and geocoding.
- Location search availability depends on the external service.
- Nominatim has usage policies and request limitations.
- Browser geolocation requires user permission.
- A displayed map connection should not automatically be interpreted as a verified public transportation route.

Map services and location data are subject to their respective providers' terms and policies.

---

## ⚠️ Data Accuracy and Limitations

SakaySense is intended to help commuters access public transportation information.

However, route availability, fare estimates, travel times, and transportation details depend on the accuracy and completeness of the available data.

Unless supported by verified sources or official integrations:

- Route information should be treated as indicative.
- Fare calculations should be treated as estimates.
- Travel durations are not guaranteed.
- Map markers do not indicate live vehicle positions.
- The application does not claim official real-time vehicle tracking.

Always verify important transportation information with the appropriate operators or local authorities.

---

## 🔐 Privacy

SakaySense may use browser location services when a user chooses to access their current location.

Location permission is controlled through the browser. Users can decline or revoke permission through their browser settings.

Do not submit sensitive personal information through reports or other application features.

---

## 📂 Project Structure

```text
SakaySense/
│
├── images/
│   ├── Delay Reports.PNG
│   ├── Fare Estimator.PNG
│   ├── Main Page.PNG
│   ├── Trip Planner.PNG
│   └── Vehicle Options.PNG
│
├── index.html
├── styles.css
├── app.js
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── .gitignore
```

*The structure above represents the main project files; additional assets or configuration files may be present.*

---

## 🔮 Future Improvements

Potential improvements for future versions include:

- Verified public transportation route databases.
- More comprehensive route coverage across Cagayan de Oro.
- Real-time vehicle location tracking.
- More accurate fare calculations.
- Route alternatives and transfer recommendations.
- Estimated arrival times.
- Improved commuter notifications.
- User accounts and personalized travel preferences.
- Community-based transportation updates.
- Additional accessibility features.

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome!

You can help improve SakaySense by:

- Reporting bugs and issues.
- Suggesting new features.
- Improving the interface and user experience.
- Expanding location suggestions.
- Improving route and fare information.
- Enhancing map functionality.
- Updating project documentation.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

---

## 📄 License

SakaySense is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for the full license text.

You can also view the license on GitHub:

[View SakaySense MIT License](https://github.com/rheillunio2-byte/SakaySense?tab=MIT-1-ov-file)

---

## 👨‍💻 Developer

<div align="center">

**Developed by RETL**

Rheil Evans Lunio

[![GitHub](https://img.shields.io/badge/GitHub-rheillunio2--byte-181717?style=for-the-badge&logo=github)](https://github.com/rheillunio2-byte)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=wave&color=0:06B6D4,45:0284C7,100:071B33&height=150&section=footer&animation=twinkling" width="100%" />

**SakaySense** · Find your route. Move with confidence.

<sub>© 2026 Rheil Evans Lunio. Licensed under the MIT License.</sub>

</div>
