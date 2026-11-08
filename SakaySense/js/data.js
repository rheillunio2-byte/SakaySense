/* SakaySense — static data and model constants.
 *
 * IMPORTANT: nothing in this file is an official route, fare or schedule.
 *  - PLACE_SUGGESTIONS are search shortcuts. They hold a search phrase, NOT coordinates:
 *    the real position always comes from OpenStreetMap (Nominatim) when picked.
 *  - FARE_MODEL keeps the original prototype's sample rates (unchanged).
 *  - TRAVEL_MODEL holds assumptions used only to give a rough time / road-distance estimate.
 */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});

  SS.PLACE_SUGGESTIONS = [
    { id: "limketkai", name: "Limketkai Center", query: "Limketkai Center, Cagayan de Oro", category: "Mall" },
    { id: "sm-cdo", name: "SM City Cagayan de Oro", query: "SM City Cagayan de Oro", category: "Mall" },
    { id: "centrio", name: "Centrio Mall", query: "Centrio Mall, Cagayan de Oro", category: "Mall" },
    { id: "ayala", name: "Ayala Malls", query: "Ayala Malls, Cagayan de Oro", category: "Mall" },
    { id: "cogon-market", name: "Cogon Market", query: "Cogon Market, Cagayan de Oro", category: "Market" },
    { id: "divisoria", name: "Divisoria", query: "Divisoria, Cagayan de Oro", category: "Landmark" },
    { id: "agora-terminal", name: "Agora Bus Terminal", query: "Agora Bus Terminal, Cagayan de Oro", category: "Terminal" },
    { id: "westbound-terminal", name: "Westbound Terminal", query: "Westbound Bus Terminal, Cagayan de Oro", category: "Terminal" },
    { id: "eastbound-terminal", name: "Eastbound Terminal", query: "Eastbound Bus Terminal, Cagayan de Oro", category: "Terminal" },
    { id: "city-hall", name: "Cagayan de Oro City Hall", query: "Cagayan de Oro City Hall", category: "Government" },
    { id: "xu", name: "Xavier University", query: "Xavier University, Cagayan de Oro", category: "School" },
    { id: "ustp", name: "USTP", query: "University of Science and Technology of Southern Philippines, Cagayan de Oro", category: "School" },
    { id: "liceo", name: "Liceo de Cagayan University", query: "Liceo de Cagayan University, Cagayan de Oro", category: "School" },
    { id: "capitol-u", name: "Capitol University", query: "Capitol University, Cagayan de Oro", category: "School" },
    { id: "nmmc", name: "Northern Mindanao Medical Center", query: "Northern Mindanao Medical Center, Cagayan de Oro", category: "Hospital" },
    { id: "cdo-port", name: "Cagayan de Oro Port", query: "Cagayan de Oro Port", category: "Port" },
  ];

  /* The original prototype's hand-written sample notes, preserved word for word.
     Keyed by "originId|destinationId". Shown only as "earlier sample note" — never as verified data. */
  SS.LEGACY_ROUTE_NOTES = {
    "cogon-market|sm-cdo": { mode: "Jeepney route options", fare: "₱13–₱20", detail: "Illustrative route suggestion · verify route and fare locally" },
    "agora-terminal|sm-cdo": { mode: "Bus / Jeepney options", fare: "₱15–₱25", detail: "Illustrative route suggestion · verify route and fare locally" },
    "sm-cdo|cogon-market": { mode: "Jeepney route options", fare: "₱13–₱20", detail: "Illustrative route suggestion · verify route and fare locally" },
    "centrio|ustp": { mode: "Jeepney / Motorela options", fare: "₱13–₱20", detail: "Illustrative route suggestion · verify route and fare locally" },
    "ayala|ustp": { mode: "Jeepney / Motorela options", fare: "₱13–₱20", detail: "Illustrative route suggestion · verify route and fare locally" },
  };

  /* Sample fare model — identical to the original prototype's numbers.
     fare = base + max(0, km - baseKm) * perKm ; Student / Senior = 20% off. NOT an official fare matrix. */
  SS.FARE_MODEL = {
    baseKm: 4,
    discountRate: 0.2,
    modes: {
      jeepney: { label: "Jeepney", base: 13, perKm: 3 },
      bus: { label: "Bus (Orostco / Donsal)", base: 15, perKm: 4 },
      motorela: { label: "Motorela", base: 15, perKm: 4 },
    },
    categories: { regular: "Regular", student: "Student", senior: "Senior Citizen" },
    maxKm: 40,
  };

  /* Rough assumptions for estimates only (average door-to-door speeds incl. stops, km/h). */
  SS.TRAVEL_MODEL = {
    circuity: 1.3, // road distance ≈ straight-line × 1.3
    shortTripKm: 0.3, // below this, we suggest walking
    motorelaMaxKm: 8, // motorelas are for shorter local trips
    modes: {
      jeepney: { icon: "🚐", label: "Jeepney", speed: [12, 20] },
      bus: { icon: "🚌", label: "Bus (Orostco / Donsal)", speed: [15, 25] },
      motorela: { icon: "🛺", label: "Motorela", speed: [15, 25] },
    },
  };

  SS.DEMO_REPORTS = [
    { tone: "amber", icon: "!", title: "Heavy traffic reported", where: "City center · Sample community report" },
    { tone: "blue", icon: "↗", title: "Possible route disruption", where: "Agora area · Sample community report" },
    { tone: "green", icon: "✓", title: "Normal service update", where: "Cogon area · Sample community report" },
  ];

  SS.CDO = { center: { lat: 8.4822, lng: 124.6472 }, zoom: 13 };
})();
