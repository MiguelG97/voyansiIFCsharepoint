import * as OBC from "openbim-components";
import * as THREE from "three";
import { IFCModelsTool } from "../entities/VoyansiIFCmodels";

//1) Components is the main object of the library [we name it "viewer"]
const viewer = new OBC.Components();

//2)Integration of at least 4 main components:
//2.1) scene
const sceneComponent = new OBC.SimpleScene(
  viewer
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

//we use this for loading ifc as fragments, do not use the FragmentManager
const ifcLoader = new OBC.FragmentIfcLoader(
  viewer
);
ifcLoader.settings.wasm = {
  absolute: true,
  path: "https://unpkg.com/web-ifc@0.0.44/",
};

await ifcLoader.setup();

const highlighter = new OBC.FragmentHighlighter(
  viewer
);
await highlighter.setup();

//there is an option to see only 2D screen of the elements that are not occluded
const culler = new OBC.ScreenCuller(viewer);
await culler.setup();
cameraComponent.controls.addEventListener(
  "sleep",
  () => (culler.needsUpdate = true)
);

const propertiesProcessor =
  new OBC.IfcPropertiesProcessor(viewer);
highlighter.events.select.onClear.add(() => {
  propertiesProcessor.cleanPropertiesList();
});

ifcLoader.onIfcLoaded.add(async (model) => {
  for (const fragment of model.items) {
    culler.add(fragment.mesh);
  }
  propertiesProcessor.process(model);
  highlighter.events.select.onHighlight.add(
    (selection) => {
      const fragmentID =
        Object.keys(selection)[0];
      const expressID = Number(
        [...selection[fragmentID]][0]
      );
      propertiesProcessor.renderProperties(
        model,
        expressID
      );
    }
  );
  highlighter.update();
  culler.needsUpdate = true;
});

//5) UI: toolbar component and its buttons
const mainToolbar = new OBC.Toolbar(viewer);

const modeListTool = new IFCModelsTool(viewer);

mainToolbar.addChild(
  // ifcLoader.uiElement.get("main"),
  modeListTool.uiElement.get("ifcModelsBtn"),
  propertiesProcessor.uiElement.get("main")
);

//adding toolbar to the main component [viewer]
viewer.ui.addToolbar(mainToolbar);

//6) event listeners
// window.addEventListener(
//   "thatOpen",
//   async (event: any) => {
//     const { name, payload } = event.detail;
//     if (name === "openModel") {
//       const { name, buffer } = payload;
//       const model = await ifcLoader.load(
//         buffer,
//         name
//       );
//       const scene = viewer.scene.get();
//       scene.add(model);
//     }
//   }
// );

window.addEventListener(
  "loadIFCData",
  async (event: CustomEventInit) => {
    const { name, bufferArr } = event.detail;
    if (name === "loadIFCData") {
      document.getElementById(
        "IFC-panel-container"
      )!.innerHTML =
        "my array: " + bufferArr.length;
      console.log("my array: ", bufferArr.length);
    }
  }
);
