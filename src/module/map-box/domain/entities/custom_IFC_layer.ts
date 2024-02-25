import mapboxgl, {
  CustomLayerInterface,
} from "mapbox-gl";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class CustomIFCLayer
  implements CustomLayerInterface
{
  static gltfData:
    | ArrayBuffer
    | { [key: string]: any };
  id: string;
  type: "custom";
  renderingMode?: "2d" | "3d" | undefined;
  camera: THREE.Camera = new THREE.Camera();
  scene: THREE.Scene = new THREE.Scene();
  map: mapboxgl.Map | null = null;
  renderer: THREE.WebGLRenderer | null = null;

  modelTransform: Mtransform;
  constructor(mtransform: Mtransform) {
    this.id = "3d-ifc-model";
    this.type = "custom";
    this.renderingMode = "3d";
    this.modelTransform = mtransform;
  }

  //once layer has been added to the Map
  async onAdd(
    map: mapboxgl.Map,
    gl: WebGL2RenderingContext
  ) {
    //ADD LIGHTS
    const directionalLight =
      new THREE.DirectionalLight(0xffffff);
    directionalLight.position
      .set(0, -70, 100)
      .normalize();
    this.scene.add(directionalLight);
    const directionalLight2 =
      new THREE.DirectionalLight(0xffffff);
    directionalLight2.position
      .set(0, 70, 100)
      .normalize();
    this.scene.add(directionalLight2);

    //add or fragments to the scene!
    //shouldn't we add the model to an existing map scene??
    //why it works creating a new webglrenderer that uses the mapbox canvas and webglcontext?
    //shouldn't they overlap each other with that approach??
    const loader = new GLTFLoader();
    const gltf = await loader.parseAsync(
      CustomIFCLayer.gltfData as ArrayBuffer,
      ""
    );
    this.scene.add(gltf.scene);
    console.log("gltf loaded: ", gltf.scene);
    //...

    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
    });
    this.renderer.autoClear = false;
  }
  render(
    gl: WebGL2RenderingContext,
    matrix: Array<number>
  ) {
    const rotationX =
      new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        this.modelTransform.rotateX
      );
    const rotationY =
      new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        this.modelTransform.rotateY
      );
    const rotationZ =
      new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        this.modelTransform.rotateZ
      );
    const m = new THREE.Matrix4().fromArray(
      matrix
    );
    const l = new THREE.Matrix4()
      .makeTranslation(
        this.modelTransform.translateY,
        this.modelTransform.translateX,
        this.modelTransform.translateZ ?? 0
      )
      .scale(
        new THREE.Vector3(
          this.modelTransform.scale,
          -this.modelTransform.scale,
          this.modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    this.camera.projectionMatrix = m.multiply(l);
    if (this.renderer !== null) {
      this.renderer.resetState();
      this.renderer.render(
        this.scene,
        this.camera
      );
    }
    if (this.map !== null) {
      this.map.triggerRepaint();
    }
  }
  //optional
  prerender() {}
  onRemove() {}
}
