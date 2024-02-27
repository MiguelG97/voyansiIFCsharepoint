import * as OBC from "openbim-components";
import { mapboxUtils } from "../usecases";
import { localStr } from "../../../../core/const";
import { findIFCModel } from "../../../fragment-loader/data/repository/dexie";
import { navigation } from "../../../plan-navigation/domain";

export class MapBoxTool
  extends OBC.Component<null>
  implements OBC.UI, OBC.Disposable
{
  enabled: boolean = false; //what this stands for??
  static uuid =
    "95396b23-18d5-47bf-a382-5eda098aa805";
  uiElement = new OBC.UIElement<{
    mapBoxbtn: OBC.Button;
    // modalContainer: OBC.FloatingWindow;
    //https://github.com/IFCjs/components/blob/main/src/ifc/IfcPropertiesProcessor/index.ts
  }>();
  constructor(components: OBC.Components) {
    super(components);
    components.tools.add(MapBoxTool.uuid, this);

    if (components.uiEnabled) {
      //Set UI:
      const mapBoxBtn = new OBC.Button(
        this.components
      );
      mapBoxBtn.materialIcon = "public";
      mapBoxBtn.tooltip = "Show in Map";
      mapBoxBtn.onClick.add(() => {
        //i) set button status
        mapBoxBtn.active = !mapBoxBtn.active;

        //ii) show custom panel container
        if (mapBoxBtn.active) {
          this.loadMapBoxGL(components);
        } else if (!mapBoxBtn.active) {
          this.unloadMapBoxGL();
        }
      });
      this.uiElement.set({
        mapBoxbtn: mapBoxBtn,
      });
    }
  }

  async loadMapBoxGL(components: OBC.Components) {
    //Exit from navigation plans (do not dispose it, it remove the tool from toolbar)
    const fragPlans = this.components.tools.get(
      OBC.FragmentPlans
    );
    fragPlans.uiElement.get(
      "floatingWindow"
    ).visible = false;

    fragPlans.exitPlanView();

    //show map div element
    const mapDiv = document.getElementById("map");
    mapDiv!.style.visibility = "visible";

    //initialize the map!
    // const coordinates =
    //   await mapboxUtils.fetchCoordinates();
    // mapboxUtils.coordinates = coordinates;
    await mapboxUtils.initializeMap();

    //dispose the IFC model from the viewer!!
    const fragManager = components.tools.get(
      OBC.FragmentManager
    );
    if (fragManager.isDisposeable()) {
      await fragManager.dispose();
    }

    //remove measurements too!
    this.components.tools
      .get(OBC.LengthMeasurement)
      .deleteAll();
  }

  async unloadMapBoxGL() {
    const mapDiv = document.getElementById("map");
    mapDiv!.style.visibility = "hidden";
    mapboxUtils.unloadMapBox();

    //load again the previous ifc model!!
    //get fragments and json props from dexie
    const modelName = localStorage.getItem(
      localStr.IFCmodelKey
    );
    if (modelName === null) return;
    const modelData = await findIFCModel(
      modelName
    );
    if (modelData === undefined) return;

    const fragManager =
      await this.components.tools.get(
        OBC.FragmentManager
      );

    // const fragModel = await this.components.tools
    //   .get(OBC.FragmentIfcLoader)
    //   .load(modelData.);
    const fragModel = await fragManager.load(
      modelData.fragments
    );
    fragModel.setLocalProperties(
      modelData.properties
    );

    //do I gotta start again the navigation plans? Yes!!
    navigation.fragmentPlanInit(
      this.components,
      fragModel,
      this.components.tools.get(
        OBC.FragmentPlans
      ),
      this.components.ui
        .viewerContainer as HTMLDivElement
    );
  }

  readonly onDisposed = new OBC.Event<string>();
  async dispose() {
    //will trigger all the callbacks assigned to this event...??
    mapboxUtils.unloadMapBox();

    await this.onDisposed.trigger(
      MapBoxTool.uuid
    );
    this.onDisposed.reset();
  }

  get(): null {
    return null;
  }
}
