import mapboxgl from "mapbox-gl";
import { CustomIFCLayer } from "../domain/custom_IFC_layer";
import { arrayBuffer } from "three/examples/jsm/nodes/Nodes.js";

let map: mapboxgl.Map | null = null;
export const mapboxUtils = {
  fetchCoordinates:
    async (): Promise<mapboxgl.LngLatLike> => {
      let lng;
      let lat;
      let coordinates: mapboxgl.LngLatLike;
      if (
        localStorage.getItem("coordinates") &&
        localStorage.getItem("coordinates") !==
          null
      ) {
        const coordinatesData = JSON.parse(
          localStorage.getItem("coordinates")!
        );
        lng = coordinatesData[0];
        lat = coordinatesData[1];
        coordinates = [lng, lat];
      } else {
        // read ifc file data!!
        lng = -77.029499;
        lat = -12.120621;
        coordinates = [lng, lat];
      }
      return coordinates;
    },
  modelTransformation: (
    modelOrigin: mapboxgl.LngLatLike
  ): CustomIFCLayer => {
    // parameters to ensure the model is georeferenced correctly on the map
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate =
      mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
      );
    // transformation parameters to position, rotate and scale the 3D model onto the map
    const modelTransform: Mtransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      /* Since the 3D model is in real world meters, a scale transform needs to be
       * applied since the CustomLayerInterface expects units in MercatorCoordinates.
       */
      scale:
        modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    const ifcLayer = new CustomIFCLayer(
      modelTransform
    );
    return ifcLayer;
  },
  initMapBox: (
    coordinates: mapboxgl.LngLatLike
  ) => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWlndWVsZzk3IiwiYSI6ImNsc21pa3lzazBseG0ycWw5b3p0amtidWYifQ.wrDaCxPiwdl55CofX8KXrg";

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10", //"mapbox://styles/mapbox/streets-v9",
      projection: { name: "globe" }, // Display the map as a globe, since satellite-v9 defaults to Mercator
      zoom: 2,
      center: coordinates, //[lng,lat]
      antialias: true,
    });

    map.on("style.load", async () => {
      if (map !== null) {
        const modelOrigin =
          await mapboxUtils.fetchCoordinates();
        console.log(
          "model origin: ",
          modelOrigin
        );
        const ifcLayer =
          mapboxUtils.modelTransformation(
            modelOrigin
          );
        map.addLayer(ifcLayer);
        // console.log("added layer");

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
      }
    });

    map.on("move", () => {
      // setLng(map.current.getCenter().lng.toFixed(4));
      // setLat(map.current.getCenter().lat.toFixed(4));
      // setZoom(map.current.getZoom().toFixed(2));
    });

    //set marker??
  },
  unloadMapBox: () => {
    if (map !== null) {
      map.remove();
    }
  },
};
