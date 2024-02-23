import { FragmentsGroup } from "bim-fragment";
import * as OBC from "openbim-components";
import * as THREE from "three";
export const navigation = {
  fragmentPlanInit: async (
    viewer: OBC.Components,
    model: FragmentsGroup,
    plans: OBC.FragmentPlans
  ) => {
    // const clipper = new OBC.EdgesClipper(viewer);
    // const sectionMaterial =
    //   new THREE.LineBasicMaterial({
    //     color: "black",
    //   });
    // const fillMaterial =
    //   new THREE.MeshBasicMaterial({
    //     color: "gray",
    //     side: 2,
    //   });
    // const fillOutline =
    //   new THREE.MeshBasicMaterial({
    //     color: "black",
    //     side: 1,
    //     opacity: 0.5,
    //     transparent: true,
    //   });
    // clipper.styles.create(
    //   "filled",
    //   new Set(),
    //   sectionMaterial,
    //   fillMaterial,
    //   fillOutline
    // );
    // clipper.styles.create(
    //   "projected",
    //   new Set(),
    //   sectionMaterial
    // );
    // const styles = clipper.styles.get();

    // const rendererComponent =
    //   viewer.renderer as OBC.PostproductionRenderer;
    // rendererComponent.postproduction.customEffects.outlineEnabled =
    //   true;

    // const classifier = new OBC.FragmentClassifier(
    //   viewer
    // );
    // const scene = viewer.scene.get();

    // classifier.byEntity(model);
    // classifier.byStorey(model);
    // const found = classifier.find({
    //   entities: [
    //     "IFCWALLSTANDARDCASE",
    //     "IFCWALL",
    //   ],
    // });
    // const fragments = viewer.tools.get(
    //   OBC.FragmentManager
    // );
    // for (const fragID in found) {
    //   const { mesh } = fragments.list[fragID];
    //   styles.filled.fragments[fragID] = new Set(
    //     found[fragID]
    //   );
    //   styles.filled.meshes.add(mesh);
    // }
    // const meshes = [];
    // for (const fragment of model.items) {
    //   const { mesh } = fragment;
    //   meshes.push(mesh);
    //   styles.projected.meshes.add(mesh);
    // }

    // const whiteColor = new THREE.Color("white");
    // const whiteMaterial =
    //   new THREE.MeshBasicMaterial({
    //     color: whiteColor,
    //   });
    // const materialManager =
    //   new OBC.MaterialManager(viewer);
    // materialManager.addMaterial(
    //   "white",
    //   whiteMaterial
    // );
    // materialManager.addMeshes("white", meshes);

    await plans.computeAllPlanViews(model);

    plans.onNavigated.add(() => {
      //   rendererComponent.postproduction.customEffects.glossEnabled =
      //     false;
      //   materialManager.setBackgroundColor(
      //     whiteColor
      //   );
      //   materialManager.set(true, ["white"]);
      viewer.tools.get(OBC.SimpleGrid).visible =
        false;
    });
    plans.onExited.add(() => {
      //   rendererComponent.postproduction.customEffects.glossEnabled =
      //     true;
      //   materialManager.resetBackgroundColor();
      //   materialManager.set(false, ["white"]);
      viewer.tools.get(OBC.SimpleGrid).visible =
        true;
    });
  },
};
