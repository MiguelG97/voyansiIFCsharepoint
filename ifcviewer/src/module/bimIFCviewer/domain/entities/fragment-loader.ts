import {
  FragmentMesh,
  FragmentsGroup,
  IfcProperties,
} from "bim-fragment";
import * as OBC from "openbim-components";
import { navigation } from "./plan-navigation";
import { GLTFExporter } from "three/examples/jsm/Addons.js";
// import * as THREE from "three";
// import {
//   addIFCModel,
//   findIFCModel,
//   updateIFCModel,
// } from "../../data/database/dexie";
// import { localStr } from "../../../../core/const";
import { Mifcprops } from "./ifc-properties";
import { mapboxUtils } from "../../../mapboxViewer/domain/usecases";
import mapboxgl from "mapbox-gl";
import { LineStyles } from "openbim-components/src/navigation/EdgesClipper/src/edges-styles";
import { CustomIFCLayer } from "../../../mapboxViewer/domain/entities/custom_IFC_layer";

export const frag_loader = {
  initLoading: async (
    ifcLoader: OBC.FragmentIfcLoader,
    fragManager: OBC.FragmentManager,
    viewer: OBC.Components,
    viewerContainer: HTMLDivElement
  ) => {
    viewerContainer;
    const propertiesProcessor = viewer.tools.get(
      OBC.IfcPropertiesProcessor
    );
    let classifier = viewer.tools.get(
      OBC.FragmentClassifier
    );
    let clipper = viewer.tools.get(
      OBC.EdgesClipper
    );
    const styles: LineStyles =
      clipper.styles.get();
    const plans = viewer.tools.get(
      OBC.FragmentPlans
    );

    //i)on local env [remove in production!]
    // ifcLoader.onIfcLoaded.add(
    //   async (model: FragmentsGroup) => {
    //     //render model properties
    //     await Mifcprops.renderModelProperties(
    //       viewer,
    //       model
    //     );

    //     //export ifc to fragments
    //     const data = fragManager.export(model);
    //     //load again the native fragments!
    //     const fragModel = await fragManager.load(
    //       data
    //     );

    //     //plan navigation!
    //     const properties:
    //       | IfcProperties
    //       | undefined =
    //       model.getLocalProperties();

    //     if (properties !== undefined) {
    //       //fetch ifc coordinates
    //       const modelCoordinates =
    //         await Mifcprops.getIFCcoordinates(
    //           properties,
    //           model
    //         );
    //       if (modelCoordinates === null) {
    //         alert(
    //           "no coordinates found on ifc file!"
    //         );
    //         return;
    //       }
    //       const lat = modelCoordinates[0];
    //       const long = modelCoordinates[1];
    //       mapboxUtils.coordinates =
    //         new mapboxgl.LngLat(long, lat);

    //       //load properties to fragments
    //       fragModel.setLocalProperties(
    //         properties
    //       );

    //       //init navigation plan
    //       navigation.fragmentPlanInit(
    //         viewer,
    //         fragModel,
    //         viewer.tools.get(OBC.FragmentPlans),
    //         viewerContainer
    //       );

    //       //export to gltf
    //       const exporter = new GLTFExporter();
    //       const gltf:
    //         | ArrayBuffer
    //         | { [key: string]: any } =
    //         await exporter.parseAsync(
    //           viewer.scene.get()
    //         );
    //       //download gltf: debug purposes
    //       // if (gltf instanceof ArrayBuffer) {
    //       //   const link =
    //       //     document.createElement("a");
    //       //   const blob = new Blob([gltf]); //,);
    //       //   link.href = URL.createObjectURL(blob);
    //       //   link.download = "mydata.glb"; //different format??
    //       //   link.dispatchEvent(
    //       //     new MouseEvent("click")
    //       //   );
    //       // } else {
    //       //   const output = JSON.stringify(
    //       //     gltf,
    //       //     null,
    //       //     2
    //       //   );
    //       //   console.log("as json data", output);
    //       //   const link =
    //       //     document.createElement("a");
    //       //   const blob = new Blob([output], {
    //       //     type: "text/plain",
    //       //   }); //,);
    //       //   link.href = URL.createObjectURL(blob);
    //       //   link.download = "mydata.gltf";
    //       //   link.click();
    //       // }

    //       //download properties
    //       // const link =
    //       //   document.createElement("a");
    //       // const blob = new Blob(
    //       //   [JSON.stringify(properties)],
    //       //   { type: "text/plain" }
    //       // );
    //       // link.href = URL.createObjectURL(blob);
    //       // link.download = "PPM-5305_SC-R23.json";
    //       // link.click();

    //       //store the model name in local storage

    //       const modelName = "migueltest.ifc"; //on sharepoint we already have this data!!
    //       localStorage.setItem(
    //         localStr.IFCmodelKey,
    //         modelName
    //       );
    //       // CustomIFCLayer.gltfData = gltf;

    //       // store the data using dexie
    //       const ifcModel = await findIFCModel(
    //         modelName
    //       );
    //       //on first load lets overwrite it!
    //       if (ifcModel !== undefined) {
    //         updateIFCModel(
    //           modelName,
    //           data,
    //           properties,
    //           gltf
    //         );
    //       }
    //       //if not found, create a new instance for this one
    //       else {
    //         //this do not ovewrite! it place the same data with a different index
    //         addIFCModel(
    //           modelName,
    //           data,
    //           properties,
    //           gltf
    //         );
    //       }
    //     }
    //   }
    // );
    // const localDev = async () => {
    //   const links = [
    //     "/assets/ifc/arq-GN_CENTRAL.ifc",
    //     "/assets/ifc/est-GN_CENTRAL.ifc",
    //     "/assets/ifc/sitemodel.ifc",
    //   ];
    //   const models: FragmentsGroup[] = [];
    //   for (const link of links) {
    //     const file = await fetch(link);
    //     if (file.ok) {
    //       const buffer = await file.arrayBuffer();
    //       const arr = new Uint8Array(buffer);
    //       const modelGroup = await ifcLoader.load(
    //         arr
    //       );
    //       const fragExport =
    //         fragManager.export(modelGroup);
    //       const model = await fragManager.load(
    //         fragExport
    //       );
    //       const properties:
    //         | IfcProperties
    //         | undefined =
    //         modelGroup.getLocalProperties();
    //       if (properties !== undefined) {
    //         model.setLocalProperties(properties);
    //         models.push(model);
    //       }
    //     }
    //   }

    //   const meshes: FragmentMesh[] = [];
    //   for (const model of models) {
    //     await propertiesProcessor.process(model);
    //     classifier.byEntity(model);
    //     classifier.byStorey(model);
    //     const found = classifier.find({
    //       entities: [
    //         "IFCWALLSTANDARDCASE",
    //         "IFCWALL",
    //       ],
    //     });
    //     for (const fragID in found) {
    //       // const fragid = fragments.list[fragID];
    //       try {
    //         const { mesh } =
    //           fragManager.list[fragID];
    //         styles.filled.fragments[fragID] =
    //           new Set(found[fragID]);
    //         styles.filled.meshes.add(mesh);
    //       } catch (error) {
    //         console.log(
    //           error,
    //           "thefragid is: " + fragID
    //         );
    //       }
    //     }
    //     for (const fragment of model.items) {
    //       const { mesh } = fragment;
    //       meshes.push(mesh);
    //       styles.projected.meshes.add(mesh);
    //     }
    //     try {
    //       await plans.computeAllPlanViews(model);
    //       await plans.updatePlansList();
    //     } catch (error) {
    //       //it can happen that the model has no floor plans!
    //       console.log(error);
    //     }
    //   }
    //   await navigation.planInitForMultiplesIFC(
    //     viewer,
    //     models,
    //     meshes
    //   );

    //   //mapbox stuff
    //   const modelCoordinates =
    //     await Mifcprops.getIFCcoordinates(
    //       models[0]
    //     );
    //   if (modelCoordinates === null) {
    //     alert(
    //       "no coordinates found on ifc file!"
    //     );
    //     return;
    //   }
    //   const lat = modelCoordinates[0];
    //   const long = modelCoordinates[1];
    //   mapboxUtils.coordinates =
    //     new mapboxgl.LngLat(long, lat);

    //   //export to gltf
    //   const exporter = new GLTFExporter();
    //   const gltf:
    //     | ArrayBuffer
    //     | { [key: string]: any } =
    //     await exporter.parseAsync(
    //       viewer.scene.get()
    //     );
    //   CustomIFCLayer.gltfData = gltf;

    //   // localStorage.setItem(
    //   //   localStr.IFCmodelKey,
    //   //   data.Name
    //   // );
    //   // // CustomIFCLayer.gltfData = gltf;

    //   // // store the data using dexie
    //   // const ifcModel = await findIFCModel(
    //   //   data.Name
    //   // );
    //   // //on first load lets overwrite it!
    //   // if (ifcModel !== undefined) {
    //   //   updateIFCModel(
    //   //     data.Name,
    //   //     dataexported,
    //   //     properties,
    //   //     gltf
    //   //   );
    //   // }
    //   // //if not found, create a new instance for this one
    //   // else {
    //   //   //this do not ovewrite! it place the same data with a different index
    //   //   addIFCModel(
    //   //     data.Name,
    //   //     dataexported,
    //   //     properties,
    //   //     gltf
    //   //   );
    //   // }
    // };
    // localDev();

    //II) ON productions [sharepoint]
    window.addEventListener(
      "loadIFCData",
      async (event: CustomEventInit) => {
        const { name, data, type } = event.detail; //we need to pass as much model data available
        if (name === "loadIFCData") {
          //group the files by the same name!!

          //a.i)for ifc files
          const models: FragmentsGroup[] = [];
          if (type === "ifc") {
            for (const ifcFile of Object.keys(
              data
            )) {
              const ifcarray = data[ifcFile];
              const modelGroup =
                await ifcLoader.load(ifcarray);
              const fragExport =
                fragManager.export(modelGroup);
              const model =
                await fragManager.load(
                  fragExport
                );
              const properties:
                | IfcProperties
                | undefined =
                modelGroup.getLocalProperties();
              if (properties !== undefined) {
                model.setLocalProperties(
                  properties
                );
                models.push(model);
              }
            }
          }
          //a.ii) for .frag files
          else if (type === "fragments") {
            for (const fileName of Object.keys(
              data
            )) {
              const { frag, json } =
                data[fileName];
              const model =
                await fragManager.load(frag);
              model.setLocalProperties(json);
              models.push(model);
            }
          }

          const meshes: FragmentMesh[] = [];
          for (const model of models) {
            await propertiesProcessor.process(
              model
            );
            classifier.byEntity(model);
            classifier.byStorey(model);
            const found = classifier.find({
              entities: [
                "IFCWALLSTANDARDCASE",
                "IFCWALL",
              ],
            });
            for (const fragID in found) {
              // const fragid = fragments.list[fragID];
              try {
                const { mesh } =
                  fragManager.list[fragID];
                styles.filled.fragments[fragID] =
                  new Set(found[fragID]);
                styles.filled.meshes.add(mesh);
              } catch (error) {
                console.log(
                  error,
                  "thefragid is: " + fragID
                );
              }
            }
            for (const fragment of model.items) {
              const { mesh } = fragment;
              meshes.push(mesh);
              styles.projected.meshes.add(mesh);
            }
            try {
              await plans.computeAllPlanViews(
                model
              );
              await plans.updatePlansList();
            } catch (error) {
              //it can happen that the model has no floor plans!
              console.log(error);
            }
          }
          await navigation.planInitForMultiplesIFC(
            viewer,
            models,
            meshes
          );

          //mapbox stuff
          const modelCoordinates =
            await Mifcprops.getIFCcoordinates(
              models[0]
            );
          if (modelCoordinates === null) {
            alert(
              "no coordinates found on ifc file!"
            );
            return;
          }
          const lat = modelCoordinates[0];
          const long = modelCoordinates[1];
          mapboxUtils.coordinates =
            new mapboxgl.LngLat(long, lat);

          //export to gltf
          const exporter = new GLTFExporter();
          const gltf:
            | ArrayBuffer
            | { [key: string]: any } =
            await exporter.parseAsync(
              viewer.scene.get()
            );
          CustomIFCLayer.gltfData = gltf;

          //   localStorage.setItem(
          //     localStr.IFCmodelKey,
          //     data.Name
          //   );
          //   // CustomIFCLayer.gltfData = gltf;

          //   // store the data using dexie
          //   const ifcModel = await findIFCModel(
          //     data.Name
          //   );
          //   //on first load lets overwrite it!
          //   if (ifcModel !== undefined) {
          //     updateIFCModel(
          //       data.Name,
          //       dataexported,
          //       properties,
          //       gltf
          //     );
          //   }
          //   //if not found, create a new instance for this one
          //   else {
          //     //this do not ovewrite! it place the same data with a different index
          //     addIFCModel(
          //       data.Name,
          //       dataexported,
          //       properties,
          //       gltf
          //     );
          //   }
        }
      }
    );
  },
};
