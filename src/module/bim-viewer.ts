import * as OBC from "openbim-components";
import * as THREE from "three";
import { measurements } from "./measurements/domain";

import { MapBoxTool } from "./map-box/domain/entities/mapBox_tool";
import { LogLevel } from "web-ifc";
import { frag_loader } from "./fragment-loader/domain";

//1) Components is the main object of the library [we name it "viewer"]
const viewer = new OBC.Components();

//2)Integration of at least 4 main components:
//2.1) scene
const sceneComponent = new OBC.SimpleScene(
  viewer
);
sceneComponent.get().background = new THREE.Color(
  0xffffff
);
sceneComponent.setup();
viewer.scene = sceneComponent;
//2.2) Render
const viewerContainer = document.getElementById(
  "sharepoint-viewer-app"
) as HTMLDivElement;
const rendererComponent =
  new OBC.PostproductionRenderer(
    viewer,
    viewerContainer
  );
viewer.renderer = rendererComponent;

//2.3) Camera
const cameraComponent =
  new OBC.OrthoPerspectiveCamera(viewer);
viewer.camera = cameraComponent;

//2.4) Raycaster
const raycasterComponent =
  new OBC.SimpleRaycaster(viewer);
viewer.raycaster = raycasterComponent;

//3) initialize the main component [viewer]: animation loops, etc...
await viewer.init();
//extra setup:
//enabling postproduction effect
const postproduction =
  rendererComponent.postproduction;
postproduction.enabled = true;

//4) Extra components
const grid = new OBC.SimpleGrid(
  viewer,
  new THREE.Color(0x666666)
);
postproduction.customEffects.excludedMeshes.push(
  grid.get()
);

const culler = new OBC.ScreenCuller(viewer);
await culler.setup();

//we use this for loading ifc as fragments, do not use the FragmentManager
const fragManager = new OBC.FragmentManager(
  viewer
);
const ifcLoader = new OBC.FragmentIfcLoader(
  viewer
);
ifcLoader.settings.webIfc.COORDINATE_TO_ORIGIN =
  true;
ifcLoader.settings.webIfc.OPTIMIZE_PROFILES =
  true;
ifcLoader.settings.wasm = {
  logLevel: LogLevel.LOG_LEVEL_OFF,
  absolute: true,
  path: "https://unpkg.com/web-ifc@0.0.44/",
};

await ifcLoader.setup();

const highlighter = new OBC.FragmentHighlighter(
  viewer
);
await highlighter.setup();

const propertiesProcessor =
  new OBC.IfcPropertiesProcessor(viewer);
highlighter.events.select.onClear.add(() => {
  propertiesProcessor.cleanPropertiesList();
});

// ifcLoader.onIfcLoaded.add(async (model) => {
//   propertiesProcessor.process(model);
//   highlighter.events.select.onHighlight.add(
//     (selection) => {
//       const fragmentID =
//         Object.keys(selection)[0];
//       const expressID = Number(
//         [...selection[fragmentID]][0]
//       );
//       propertiesProcessor.renderProperties(
//         model,
//         expressID
//       );
//     }
//   );
//   highlighter.updateHighlight();
// });

//5) UI: toolbar component and its buttons
const mainToolbar = new OBC.Toolbar(viewer);

mainToolbar.addChild(
  ifcLoader.uiElement.get("main"),
  propertiesProcessor.uiElement.get("main")
);

//adding toolbar to the main component [viewer]
viewer.ui.addToolbar(mainToolbar);
//measurements
measurements.init(viewer, viewerContainer);

//navigation plans
const plans = new OBC.FragmentPlans(viewer);
mainToolbar.addChild(plans.uiElement.get("main"));

//load fragments
frag_loader.initLoading(
  ifcLoader,
  fragManager,
  viewer,
  viewerContainer
);

//7) mapbox
const mapBoxTool = new MapBoxTool(viewer);
mainToolbar.addChild(
  mapBoxTool.uiElement.get("mapBoxbtn")
);
