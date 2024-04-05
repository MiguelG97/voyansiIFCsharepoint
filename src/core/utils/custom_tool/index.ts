import * as OBC from "openbim-components";

export class PanelDataTool
  extends OBC.Component<null>
  implements OBC.UI, OBC.Disposable
{
  enabled: boolean = false; //what this stands for??
  static uuid =
    "558c5bca-0753-44f4-9468-7843b6ab1e9a";
  uiElement = new OBC.UIElement<{
    panelDataBtn: OBC.Button;
    // modalContainer: OBC.FloatingWindow;
    //https://github.com/IFCjs/components/blob/main/src/ifc/IfcPropertiesProcessor/index.ts
  }>();
  constructor(components: OBC.Components) {
    super(components);
    components.tools.add(
      PanelDataTool.uuid,
      this
    );

    if (components.uiEnabled) {
      //Set UI:
      const panelDataBtn = new OBC.Button(
        this.components
      );
      panelDataBtn.materialIcon = "summarize";
      //description, ...
      panelDataBtn.tooltip = "List IFC Models";
      panelDataBtn.onClick.add(() => {
        //i) set button status
        panelDataBtn.active =
          !panelDataBtn.active;

        //ii) show custom panel container
        this.toggleModalList(panelDataBtn.active);
      });
      this.uiElement.set({
        panelDataBtn: panelDataBtn,
      });
    }
  }

  toggleModalList(active: boolean) {
    const panelDataBtnContainer =
      document.getElementById("panelDataBtn");

    if (active) {
      panelDataBtnContainer!.style.display =
        "flex";
    } else if (!active) {
      panelDataBtnContainer!.style.display =
        "none";
    }
  }

  readonly onDisposed = new OBC.Event<string>();
  async dispose() {
    //will trigger all the callbacks assigned to this event...??
    await this.onDisposed.trigger(
      PanelDataTool.uuid
    );
    this.onDisposed.reset();
  }

  get(): null {
    return null;
  }
}
