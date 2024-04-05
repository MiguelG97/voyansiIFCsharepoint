import {
  FragmentMesh,
  FragmentsGroup,
} from "bim-fragment";
import * as OBC from "openbim-components";
import * as THREE from "three";
export const navigation = {
  fragmentPlanInit: async (
    viewer: OBC.Components,
    model: FragmentsGroup,
    plans: OBC.FragmentPlans,
    viewerContainer: HTMLDivElement
  ) => {
    //Culler
    const culler = viewer.tools.get(
      OBC.ScreenCuller
    );
    viewerContainer.addEventListener(
      "mouseup",
      () => (culler.elements.needsUpdate = true)
    );
    viewerContainer.addEventListener(
      "wheel",
      () => (culler.elements.needsUpdate = true)
    );
    // for (const fragment of model.items) {
    //   culler.elements.add(fragment.mesh);
    // }
    //should we add this??
    // cameraComponent.controls.addEventListener(
    //   "sleep",
    //   () => (culler.needsUpdate = true)
    // );

    culler.elements.needsUpdate = true;

    //Styling our floorplans
    //should we check if this already exist from tools, other way just add a new instance
    let clipper = viewer.tools.get(
      OBC.EdgesClipper
    );
    // const clipper = new OBC.EdgesClipper(viewer);
    const sectionMaterial =
      new THREE.LineBasicMaterial({
        color: "black",
      });
    const fillMaterial =
      new THREE.MeshBasicMaterial({
        color: "gray",
        side: 2,
      });
    const fillOutline =
      new THREE.MeshBasicMaterial({
        color: "black",
        side: 1,
        opacity: 0.5,
        transparent: true,
      });

    clipper.styles.create(
      "filled",
      new Set(),
      sectionMaterial,
      fillMaterial,
      fillOutline
    );
    clipper.styles.create(
      "projected",
      new Set(),
      sectionMaterial
    );
    const styles = clipper.styles.get();

    // enable the outline effect to see the clipping outline
    const postproduction = (
      viewer.renderer as OBC.PostproductionRenderer
    ).postproduction;
    postproduction.customEffects.outlineEnabled =
      true;

    //apply the styles depending on the category
    let classifier = viewer.tools.get(
      OBC.FragmentClassifier
    );
    classifier.byEntity(model);
    classifier.byStorey(model);
    const found = classifier.find({
      entities: [
        "IFCWALLSTANDARDCASE",
        "IFCWALL",
      ],
    });

    //assign each geometry to its corresponding style
    const fragments = viewer.tools.get(
      OBC.FragmentManager
    );
    // console.log(fragments.list); //issue here!! it was not loaded as frag manager! so there is no data here

    for (const fragID in found) {
      // const fragid = fragments.list[fragID];
      try {
        const { mesh } = fragments.list[fragID];
        styles.filled.fragments[fragID] = new Set(
          found[fragID]
        );
        styles.filled.meshes.add(mesh);
      } catch (error) {
        console.log(
          error,
          "thefragid is: " + fragID
        );
      }
    }

    const meshes = [];
    for (const fragment of model.items) {
      const { mesh } = fragment;
      meshes.push(mesh);
      styles.projected.meshes.add(mesh);
    }

    //Global white material
    const whiteColor = new THREE.Color("white");
    const whiteMaterial =
      new THREE.MeshBasicMaterial({
        color: whiteColor,
      });
    let materialManager = viewer.tools.get(
      OBC.MaterialManager
    );
    const matsCreated = materialManager.get(); //array of material names!
    const isWhiteMatCreated = matsCreated.map(
      (x) => x === "white"
    );
    if (isWhiteMatCreated.length === 0) {
      materialManager.addMaterial(
        "white",
        whiteMaterial
      );
    }
    materialManager.addMeshes("white", meshes);

    //Generating the plans
    await plans.computeAllPlanViews(model);

    //extra functionalities
    const hider = viewer.tools.get(
      OBC.FragmentHider
    ); //new OBC.FragmentHider(viewer);

    const highlighter = viewer.tools.get(
      OBC.FragmentHighlighter
    );

    const highlightMat =
      new THREE.MeshBasicMaterial({
        depthTest: false,
        color: 0xbcf124,
        transparent: true,
        opacity: 0.3,
      });
    const highlightmats =
      highlighter.highlightMats;
    if (highlightmats.default === undefined) {
      highlighter.add("default", [highlightMat]);
    }

    const canvas =
      viewer.renderer.get().domElement;
    canvas.addEventListener("click", () =>
      highlighter.clear("default")
    );

    highlighter.updateHighlight();
    // And let's add these features to the floorplans as extra commands
    plans.commands = {
      Select: async (plan) => {
        const found = await classifier.find({
          storeys: [plan!.name],
        });
        highlighter.highlightByID(
          "default",
          found
        );
      },
      Show: async (plan) => {
        const found = await classifier.find({
          storeys: [plan!.name],
        });
        hider.set(true, found);
      },
      Hide: async (plan) => {
        const found = await classifier.find({
          storeys: [plan!.name],
        });
        hider.set(false, found);
      },
    };

    plans.updatePlansList();

    //event navigation
    plans.onNavigated.add(() => {
      postproduction.customEffects.glossEnabled =
        false;
      materialManager.setBackgroundColor(
        whiteColor
      );
      materialManager.set(true, ["white"]);
      viewer.tools.get(OBC.SimpleGrid).visible =
        false;
    });

    plans.onExited.add(() => {
      postproduction.customEffects.glossEnabled =
        true;
      materialManager.resetBackgroundColor();
      materialManager.set(false, ["white"]);
      viewer.tools.get(OBC.SimpleGrid).visible =
        true;
    });
  },
  planSetup: async (viewer: OBC.Components) => {
    const culler = viewer.tools.get(
      OBC.ScreenCuller
    );
    viewer.ui.viewerContainer.addEventListener(
      "mouseup",
      () => (culler.elements.needsUpdate = true)
    );
    viewer.ui.viewerContainer.addEventListener(
      "wheel",
      () => (culler.elements.needsUpdate = true)
    );
    culler.elements.needsUpdate = true;

    //Styling our floorplans
    //should we check if this already exist from tools, other way just add a new instance
    let clipper = viewer.tools.get(
      OBC.EdgesClipper
    );
    // const clipper = new OBC.EdgesClipper(viewer);
    const sectionMaterial =
      new THREE.LineBasicMaterial({
        color: "black",
      });
    const fillMaterial =
      new THREE.MeshBasicMaterial({
        color: "gray",
        side: 2,
      });
    const fillOutline =
      new THREE.MeshBasicMaterial({
        color: "black",
        side: 1,
        opacity: 0.5,
        transparent: true,
      });

    clipper.styles.create(
      "filled",
      new Set(),
      sectionMaterial,
      fillMaterial,
      fillOutline
    );
    clipper.styles.create(
      "projected",
      new Set(),
      sectionMaterial
    );
    const styles = clipper.styles.get();
    // enable the outline effect to see the clipping outline
    const postproduction = (
      viewer.renderer as OBC.PostproductionRenderer
    ).postproduction;
    postproduction.customEffects.outlineEnabled =
      true;

    const highlightMat =
      new THREE.MeshBasicMaterial({
        depthTest: false,
        color: 0xbcf124,
        transparent: true,
        opacity: 0.3,
      });
    const highlighter = viewer.tools.get(
      OBC.FragmentHighlighter
    );
    const highlightmats =
      highlighter.highlightMats;
    if (highlightmats.default === undefined) {
      highlighter.add("default", [highlightMat]);
    }
    const canvas =
      viewer.renderer.get().domElement;
    canvas.addEventListener("click", () =>
      highlighter.clear("default")
    );
    await highlighter.updateHighlight();
  },

  planInitForMultiplesIFC: async (
    viewer: OBC.Components,
    models: FragmentsGroup[],
    meshes: FragmentMesh[]
  ) => {
    const propertiesProcessor = viewer.tools.get(
      OBC.IfcPropertiesProcessor
    );
    const highlighter = viewer.tools.get(
      OBC.FragmentHighlighter
    );
    const highlighterEvents = highlighter.events;
    highlighterEvents.select.onClear.add(() => {
      propertiesProcessor.cleanPropertiesList();
    });
    let lastMeshSelected:
      | FragmentMesh
      | undefined;
    highlighterEvents.select.onHighlight.add(
      async (selection: OBC.FragmentIdMap) => {
        const fragmentID =
          Object.keys(selection)[0];
        const expressID = Number(
          [...selection[fragmentID]][0]
        );
        //infinity loop!!
        // highlighter.highlightByID(
        //   "select",
        //   highlighter.selection["select"]
        // );

        //do not await them!! or the pops are not going to get rendered
        for (const model of models) {
          propertiesProcessor.renderProperties(
            model,
            expressID
          );
        }
      }
    );

    const whiteColor = new THREE.Color("white");
    const whiteMaterial =
      new THREE.MeshBasicMaterial({
        color: whiteColor,
      });
    const materialManager = viewer.tools.get(
      OBC.MaterialManager
    );
    const matsCreated = materialManager.get();
    const isWhiteMatCreated = matsCreated.map(
      (x) => x === "white"
    );
    if (isWhiteMatCreated.length === 0) {
      materialManager.addMaterial(
        "white",
        whiteMaterial
      );
      materialManager.addMeshes("white", meshes);
    }
    const plans = viewer.tools.get(
      OBC.FragmentPlans
    );
    const postproduction = (
      viewer.renderer as OBC.PostproductionRenderer
    ).postproduction;
    plans.onNavigated.add(() => {
      // postproduction.customEffects.outlineEnabled =
      //   true;
      postproduction.enabled = true;
      postproduction.customEffects.glossEnabled =
        false;
      materialManager.setBackgroundColor(
        whiteColor
      );
      materialManager.set(true, ["white"]);
      // viewer.tools.get(OBC.SimpleGrid).visible =
      //   false;
    });

    plans.onExited.add(() => {
      postproduction.enabled = false;
      postproduction.customEffects.glossEnabled =
        true;
      // postproduction.customEffects.outlineEnabled =
      //   false;
      materialManager.resetBackgroundColor();
      materialManager.set(false, ["white"]);
      // viewer.tools.get(OBC.SimpleGrid).visible =
      //   true;
    });
  },
};
