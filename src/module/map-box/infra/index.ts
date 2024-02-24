import mapboxgl from "mapbox-gl";
let map: mapboxgl.Map | null = null;
export const mapboxUtils = {
  initMapBox: () => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlndWVsZzk3IiwiYSI6ImNsc21pa3lzazBseG0ycWw5b3p0amtidWYifQ.wrDaCxPiwdl55CofX8KXrg";
    console.log("map creation");
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10", //"mapbox://styles/mapbox/streets-v9",
      projection: { name: "globe" }, // Display the map as a globe, since satellite-v9 defaults to Mercator
      zoom: 2,
      center: [30, 15],
      antialias: true,
    });
    map.on("style.load", () => {
      if (map !== null) {
        map.setFog({
          color: "rgb(186, 210, 235)", // Lower atmosphere
          "high-color": "rgb(36, 92, 223)", // Upper atmosphere
          "horizon-blend": 0.02, // Atmosphere thickness (default 0.2 at low zooms)
          "space-color": "rgb(11, 11, 25)", // Background color
          "star-intensity": 0.6, // Background star brightness (default 0.35 at low zoooms )
        });
      }
    });
    map.on("load", () => {
      //   map.addLayer({
      //     id: "terrain-data",
      //     type: "line",
      //     //6 types of sources [needs to be defined once a layer is added]
      //     source: {
      //       type: "vector",
      //       url: "mapbox://mapbox.mapbox-terrain-v2",
      //     },
      //     "source-layer": "contour",
      //   });
      if (map !== null) {
        map.addLayer({
          id: "rpd_parks",
          type: "fill",
          source: {
            type: "vector",
            url: "mapbox://mapbox.3o7ubwm8",
          },
          "source-layer": "RPD_Parks",
          layout: { visibility: "visible" },
          paint: {
            "fill-color": "rgba(61,153,80,0.55)",
          },
        });
      }
    });

    // map.on('move', () => {
    //     setLng(map.current.getCenter().lng.toFixed(4));
    //     setLat(map.current.getCenter().lat.toFixed(4));
    //     setZoom(map.current.getZoom().toFixed(2));
    //   });
  },
  unloadMapBox: () => {
    if (map !== null) {
      map.remove();
    }
  },
};
