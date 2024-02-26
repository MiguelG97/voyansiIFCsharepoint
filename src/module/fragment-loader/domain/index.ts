import {
  FragmentsGroup,
  IfcProperties,
} from "bim-fragment";
import * as OBC from "openbim-components";
import { navigation } from "../../plan-navigation/domain";
import { GLTFExporter } from "three/examples/jsm/Addons.js";

import {
  addIFCModel,
  findIFCModel,
  updateIFCModel,
} from "../data/repository/dexie";
import { localStr } from "../../../core/const";
import { CustomIFCLayer } from "../../map-box/domain/entities/custom_IFC_layer";

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
        //export ifc to fragments

        const data = fragManager.export(model);
        //load again the native fragments!
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
          //download gltf: debug purposes
          // if (gltf instanceof ArrayBuffer) {
          //   const link =
          //     document.createElement("a");
          //   const blob = new Blob([gltf]); //,);
          //   link.href = URL.createObjectURL(blob);
          //   link.download = "mydata.glb"; //different format??
          //   link.dispatchEvent(
          //     new MouseEvent("click")
          //   );
          // } else {
          //   const output = JSON.stringify(
          //     gltf,
          //     null,
          //     2
          //   );
          //   console.log("as json data", output);
          //   const link =
          //     document.createElement("a");
          //   const blob = new Blob([output], {
          //     type: "text/plain",
          //   }); //,);
          //   link.href = URL.createObjectURL(blob);
          //   link.download = "mydata.gltf";
          //   link.click();
          // }

          //store the model name in local storage
          const modelName = "migueltest.ifc"; //on sharepoint we already have this data!!
          localStorage.setItem(
            localStr.IFCmodelKey,
            modelName
          );
          // CustomIFCLayer.gltfData = gltf;

          // store the data using dexie
          const ifcModel = await findIFCModel(
            modelName
          );
          //on first load lets overwrite it!
          if (ifcModel !== undefined) {
            updateIFCModel(
              modelName,
              data,
              properties,
              gltf
            );
          }
          //if not found, create a new instance for this one
          else {
            //this do not ovewrite! it place the same data with a different index
            addIFCModel(
              modelName,
              data,
              properties,
              gltf
            );
          }
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

            //export to gltf
            const exporter = new GLTFExporter();
            const gltf:
              | ArrayBuffer
              | { [key: string]: any } =
              await exporter.parseAsync(
                viewer.scene.get()
              );

            localStorage.setItem(
              localStr.IFCmodelKey,
              data.Name
            );
            // CustomIFCLayer.gltfData = gltf;

            // store the data using dexie
            const ifcModel = await findIFCModel(
              data.Name
            );
            //on first load lets overwrite it!
            if (ifcModel !== undefined) {
              updateIFCModel(
                data.Name,
                data,
                properties,
                gltf
              );
            }
            //if not found, create a new instance for this one
            else {
              //this do not ovewrite! it place the same data with a different index
              addIFCModel(
                data.Name,
                data,
                properties,
                gltf
              );
            }
          }
        }
      }
    );
  },
};
