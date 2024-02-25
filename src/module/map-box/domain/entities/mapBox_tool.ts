import * as OBC from "openbim-components";
import { mapboxUtils } from "../services";

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
    const mapDiv = document.getElementById("map");
    mapDiv!.style.visibility = "visible";

    const coordinates =
      await mapboxUtils.fetchCoordinates();
    mapboxUtils.initMapBox(coordinates);
    //dispose viewer!!
    const fragManager = components.tools.get(
      OBC.FragmentManager
    );
    if (fragManager.isDisposeable()) {
      //try removing measurements too!
      await fragManager.dispose();
    }
  }

  async unloadMapBoxGL() {
    const mapDiv = document.getElementById("map");
    mapDiv!.style.visibility = "hidden";
    mapboxUtils.unloadMapBox();

    //load again the previous ifc model!!
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
