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

//do not query inside the sharepoint context! query outside the event listener!
let dataArray: {
  Name: string;
  buffer: Uint8Array;
}[] = [];

window.addEventListener(
  "loadIFCData",
  async (event: CustomEventInit) => {
    const { name, dataArr } = event.detail;
    if (name === "loadIFCData") {
      const ifcListDiv =
        document.getElementById("ifcList");
      dataArray = dataArr;

      for (const item of dataArr) {
        const { Name } = item;

        const li = document.createElement("li");
        li.innerHTML = Name;
        li.dataset.selected = "false";
        li.classList.add("ifcItem");
        li.addEventListener("click", () => {
          const items =
            document.getElementsByClassName(
              "ifcItem"
            );
          for (const it of items) {
            (it as HTMLElement).dataset.selected =
              "false";
          }
          if (li.dataset.selected === "true") {
            li.dataset.selected = "false";
          } else if (
            li.dataset.selected === "false"
          ) {
            li.dataset.selected = "true";
          }
        });

        ifcListDiv?.appendChild(li);
      }
    }
  }
);

const loadBtn =
  document.getElementById("loadbutton");
loadBtn?.addEventListener("click", async () => {
  const items =
    document.getElementsByClassName("ifcItem");
  for (const index in items) {
    if (
      ((
        items[index] as HTMLElement
      ).dataset.selected = "true")
    ) {
      const data = dataArray[index];
      const model = await ifcLoader.load(
        data.buffer,
        data.Name
      );
      const scene = viewer.scene.get();
      for (
        var i = scene.children.length - 1;
        i >= 0;
        i--
      ) {
        const obj = scene.children[i];
        scene.remove(obj);
      }
      scene.add(model);
    }
  }
});

//store it on an object the ifc model name and the array buffer!
// const items =
//   document.getElementsByClassName("ifcItem");

// for (const item of items) {
//   const newItem = item as HTMLElement;
//   // newItem.dataset.miguel = "hey";//to add default attribute
//   newItem?.addEventListener("click", () => {
//     for (const it of items) {
//       (it as HTMLElement).dataset.selected =
//         "false";
//     }

//     if (newItem.dataset.selected === "true") {
//       newItem.dataset.selected = "false";
//     } else if (
//       newItem.dataset.selected === "false"
//     ) {
//       newItem.dataset.selected = "true";
//     }
//     console.log(newItem.dataset);
//   });
//   console.log(newItem.dataset);
// }
