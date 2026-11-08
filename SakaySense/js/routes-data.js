/* SakaySense — verified route dataset (currently EMPTY on purpose).
 *
 * No official or surveyed route data has been supplied, so none is invented here.
 * When this array is empty, the app shows clearly-labelled ESTIMATES only.
 *
 * To add a real route, push an object like the template below. A route is shown as a
 * "Route data" card when both the origin and the destination chosen by the commuter are
 * within `matchRadiusM` metres of one of its stops, in the listed order (or in either order
 * when `bidirectional` is true). Stops in between are listed as intermediate stops.
 *
 * Only add routes you have verified (LTFRB / City Transport office / your own survey) and
 * fill `source` so commuters can see where the information came from.
 *
 * window.SakaySense.ROUTES = [
 *   {
 *     id: "example-jeep-01",
 *     mode: "jeepney",                 // "jeepney" | "bus" | "motorela"
 *     name: "Route name / signboard",
 *     operator: "Optional operator name",
 *     bidirectional: true,
 *     matchRadiusM: 500,
 *     stops: [
 *       { name: "Stop A", lat: 0, lng: 0 },
 *       { name: "Stop B", lat: 0, lng: 0 },
 *       { name: "Stop C", lat: 0, lng: 0 }
 *     ],
 *     fare: { regular: 13 },            // optional verified regular fare in PHP; discounts are applied by the app
 *     travelMinutes: [20, 35],          // optional verified [min, max]
 *     transfers: 0,                     // number of transfers on this itinerary
 *     notes: "Anything else commuters should know.",
 *     source: "Where this information came from, and when it was checked"
 *   }
 * ];
 */
(function () {
  "use strict";
  const SS = (window.SakaySense = window.SakaySense || {});
  SS.ROUTES = SS.ROUTES || [];
})();
