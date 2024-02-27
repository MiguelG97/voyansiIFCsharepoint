import mapboxgl from "mapbox-gl";
import { CustomIFCLayer } from "../entities/custom_IFC_layer";

export abstract class mapboxUtils {
  static coordinates: mapboxgl.LngLatLike;
  static map: mapboxgl.Map;
  static async initializeMap() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlndWVsZzk3IiwiYSI6ImNsc21pa3lzazBseG0ycWw5b3p0amtidWYifQ.wrDaCxPiwdl55CofX8KXrg";
    mapboxUtils.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10", //"mapbox://styles/mapbox/streets-v9",
      projection: { name: "globe" }, // Display the map as a globe, since satellite-v9 defaults to Mercator
      zoom: 20,
      center: mapboxUtils.coordinates, //[lng,lat]
      antialias: true,
      pitch: 60,
    });
    const ifcLayer = new CustomIFCLayer();
    mapboxUtils.map.on("style.load", async () => {
      //i) add custom 3d model layer
      mapboxUtils.map.addLayer(
        ifcLayer,
        "waterway-label"
      ); //"building"
      //ii) setup for planet UI
      mapboxUtils.map.setFog({
        color: "rgb(186, 210, 235)", // Lower atmosphere
        "high-color": "rgb(36, 92, 223)", // Upper atmosphere
        "horizon-blend": 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        "space-color": "rgb(11, 11, 25)", // Background color
        "star-intensity": 0.6, // Background star brightness (default 0.35 at low zoooms )
      });
      //iii) add building extrusion layer
      const layers =
        mapboxUtils.map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) =>
          layer.type === "symbol" &&
          layer.layout !== undefined &&
          layer.layout["text-field"]
      )?.id;
      console.log(labelLayerId);
      mapboxUtils.map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
    });
    mapboxUtils.map.on("load", () => {
      // mapboxUtils.map.flyTo({
      //   center: mapboxUtils.coordinates,
      //   zoom: 20,
      //   pitch: 75,
      //   essential: true,
      //   duration: 5000,
      // });
      // setTimeout(() => {}, 1000);
    });
  }

  // static async fetchCoordinates(): Promise<mapboxgl.LngLatLike> {
  //   let lng;
  //   let lat;
  //   let coordinates: mapboxgl.LngLatLike;
  //   if (
  //     localStorage.getItem("coordinates") &&
  //     localStorage.getItem("coordinates") !== null
  //   ) {
  //     const coordinatesData = JSON.parse(
  //       localStorage.getItem("coordinates")!
  //     );
  //     lng = coordinatesData[0];
  //     lat = coordinatesData[1];
  //     coordinates = new mapboxgl.LngLat(lng, lat);
  //   } else {
  //     // read ifc file data!!
  //     lng = -77.029499;
  //     lat = -12.120621;
  //     coordinates = new mapboxgl.LngLat(lng, lat);
  //   }
  //   return coordinates;
  // }

  static unloadMapBox() {
    mapboxUtils.map.remove();
  }
}
