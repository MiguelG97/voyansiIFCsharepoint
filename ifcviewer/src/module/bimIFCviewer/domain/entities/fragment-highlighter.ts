import * as OBC from "openbim-components";
import * as THREE from "three";
export class MfragmentHightlighter {
  static async initialize(
    viewer: OBC.Components
  ) {
    const highlighter = viewer.tools.get(
      OBC.FragmentHighlighter
    );
    await highlighter.setup();
    highlighter.outlineEnabled = true;
    const postRenderer =
      viewer.renderer as OBC.PostproductionRenderer;
    postRenderer.postproduction.customEffects.outlineEnabled =
      true;

    const highlightMaterial =
      new THREE.MeshBasicMaterial({
        color: "#749ae6",
        depthTest: false,
        opacity: 0.8,
        transparent: true,
      });
    highlighter.add("default", [
      highlightMaterial,
    ]);
    highlighter.outlineMaterial.color.set(
      0xffffff
    );
    highlighter.outlineMaterial.opacity = 0.22;

    const highlightOnClick = async () => {
      await highlighter.highlight(
        "default",
        true,
        false
      );
    };
    viewer.ui.viewerContainer.addEventListener(
      "click",
      highlightOnClick
    );

    //editing same name for original class [the outline doesnt work with this setup!!]
    (
      highlighter.config
        .selectionMaterial as THREE.MeshBasicMaterial
    ).color = new THREE.Color(0x749ae6);

    // highlighter.outlineMaterial.color.set(
    //   0xffffff
    // );

    (
      highlighter.config
        .hoverMaterial as THREE.MeshBasicMaterial
    ).color = new THREE.Color(0x005991);
  }
}
