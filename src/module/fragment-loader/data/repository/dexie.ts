import { DexieIFCDB } from "../models/ifc_model";
import { IfcProperties } from "bim-fragment";

//new dexie database as singleton!!
const IFCdb = new DexieIFCDB("ifc-database", 1);

export const addIFCModel = async (
  name: string,
  fragments: Uint8Array,
  properties: IfcProperties,
  gltf: ArrayBuffer | { [key: string]: any }
) => {
  try {
    //stringify the properties??

    const id = await IFCdb.models.add({
      name,
      fragments,
      properties,
      gltf,
    });
  } catch (error) {
    console.log(error);
  }
};

export const findIFCModel = async (
  modelName: string
) => {
  const ifcModel = await IFCdb.models
    .where("name")
    .equals(modelName)
    .toArray();
  if (ifcModel.length > 0) {
    return ifcModel[0];
  } else {
    return undefined;
  }
};

export const updateIFCModel = async (
  modelName: string,
  fragments: Uint8Array,
  properties: IfcProperties,
  gltf: ArrayBuffer | { [key: string]: any }
) => {
  const model = await findIFCModel(modelName);
  if (model !== undefined) {
    //approach 1) apparently doesnt work using the "++id"!! it set another different ID!
    // IFCdb.models.put(
    //   {
    //     name: "1" + modelName,
    //     fragments,
    //     properties,
    //     gltf,
    //   },
    //   model.id
    // );

    //approach2) odesnt work
    // model.name = "1" + modelName;

    //approach3) transaction doesnt work too!

    //approach 4)update()!!
    const numberX = await IFCdb.models.update(
      model.id!,
      {
        name: "1" + modelName,
        fragments,
        properties,
        gltf,
      }
    );
    console.log(numberX);
  }
};
