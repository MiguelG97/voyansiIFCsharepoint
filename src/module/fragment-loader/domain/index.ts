import {
  FragmentsGroup,
  IfcProperties,
} from "bim-fragment";
import * as OBC from "openbim-components";
import { navigation } from "../../plan-navigation/domain";
import { GLTFExporter } from "three/examples/jsm/Addons.js";

import { CustomIFCLayer } from "../../map-box/domain/entities/custom_IFC_layer";
import {
  addIFCModel,
  findIFCModel,
  updateIFCModel,
} from "../data/repository/dexie";

export const frag_loader = {
  initLoading: (
    ifcLoader: OBC.FragmentIfcLoader,
    fragManager: OBC.FragmentManager,
    viewer: OBC.Components,
    viewerContainer: HTMLDivElement
  ) => {
    //i)on local env [remove in production!]
    ifcLoader.onIfcLoaded.add(
      async (model: FragmentsGroup) => {
        const data = fragManager.export(model);
        const fragModel = await fragManager.load(
          data
        );

        //plan navigation!
        const properties:
          | IfcProperties
          | undefined =
          model.getLocalProperties();
        if (properties !== undefined) {
          fragModel.setLocalProperties(
            properties
          );

          navigation.fragmentPlanInit(
            viewer,
            fragModel,
            viewer.tools.get(OBC.FragmentPlans),
            viewerContainer
          );

          //export to gltf
          const exporter = new GLTFExporter();
          const gltf:
            | ArrayBuffer
            | { [key: string]: any } =
            await exporter.parseAsync(
              viewer.scene.get()
            );
          CustomIFCLayer.gltfData = gltf;

          // store the data using dexie
          const modelName = "migueltest.ifc"; //on sharepoint we already have this data!!
          const ifcModel = await findIFCModel(
            modelName
          );
          if (ifcModel !== undefined) {
            //on first load we can overwrite it!
            updateIFCModel(
              modelName,
              data,
              properties,
              gltf
            );
          } else {
            //this do not ovewrite! it place the same data with a different index
            addIFCModel(
              modelName,
              data,
              properties,
              gltf
            );
          }
          console.log(ifcModel);
        }
      }
    );

    //II) ON productions [sharepoint]
    window.addEventListener(
      "loadIFCData",
      async (event: CustomEventInit) => {
        const { name, data } = event.detail;

        if (name === "loadIFCData") {
          const model = await ifcLoader.load(
            data.bufferArr
          );
          model.name = data.Name;
          const scene = viewer.scene.get();
          scene.add(model);

          //add it to fragment Manager! [store data in indexDB with dexie!!]
          const dataexported =
            fragManager.export(model);
          const fragModel =
            await fragManager.load(dataexported);
          const properties:
            | IfcProperties
            | undefined =
            model.getLocalProperties();
          if (properties !== undefined) {
            fragModel.setLocalProperties(
              properties
            );
            navigation.fragmentPlanInit(
              viewer,
              fragModel,
              viewer.tools.get(OBC.FragmentPlans),
              viewerContainer
            );
          }
        }
      }
    );
  },
};
