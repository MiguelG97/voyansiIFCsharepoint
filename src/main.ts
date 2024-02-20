import * as OBC from "openbim-components";
import * as THREE from "three";
import { ExampleTool } from "./bim-components";

const viewer = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(
  viewer
);
sceneComponent.setup();
viewer.scene = sceneComponent;

const viewerContainer = document.getElementById(
  "sharepoint-viewer-app"
) as HTMLDivElement;
const rendererComponent =
  new OBC.PostproductionRenderer(
    viewer,
    viewerContainer
  );
viewer.renderer = rendererComponent;
const postproduction =
  rendererComponent.postproduction;

const cameraComponent =
  new OBC.OrthoPerspectiveCamera(viewer);
viewer.camera = cameraComponent;

const raycasterComponent =
  new OBC.SimpleRaycaster(viewer);
viewer.raycaster = raycasterComponent;

await viewer.init();
postproduction.enabled = true;

const grid = new OBC.SimpleGrid(
  viewer,
  new THREE.Color(0x666666)
);
postproduction.customEffects.excludedMeshes.push(
  grid.get()
);

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

const exampleTool = new ExampleTool(viewer);
await exampleTool.setup({
  message: "Hi there from ExampleTool!",
  requiredSetting: 123,
});

const mainToolbar = new OBC.Toolbar(viewer);
mainToolbar.addChild(
  ifcLoader.uiElement.get("main"),
  propertiesProcessor.uiElement.get("main"),
  exampleTool.uiElement.get("activationBtn")
);

viewer.ui.addToolbar(mainToolbar);

window.addEventListener(
  "thatOpen",
  async (event: any) => {
    const { name, payload } = event.detail;
    if (name === "openModel") {
      const { name, buffer } = payload;
      const model = await ifcLoader.load(
        buffer,
        name
      );
      const scene = viewer.scene.get();
      scene.add(model);
    }
  }
);
