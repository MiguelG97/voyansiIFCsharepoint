import { IfcProperties } from "bim-fragment";
import Dexie, { Table } from "dexie";

export interface Models {
  id?: number;
  name: string;
  fragments: Uint8Array;
  properties: IfcProperties;
  gltf: ArrayBuffer | { [key: string]: any };
}

export class DexieIFCDB extends Dexie {
  models!: Table<Models>;
  constructor(dbname: string, version: number) {
    super(dbname);

    //store,alter or delete tables in this db version!
    //dissclosure: there is no need to define the index for images,videos or large string. They
    //can be stored straightaway. Reason, when using clause where(...) to find item it would
    //decrease database query performance!!
    //no need to specify prop types unlike SQL
    this.version(version).stores({
      models: "++id,name",
    });
  }
}
