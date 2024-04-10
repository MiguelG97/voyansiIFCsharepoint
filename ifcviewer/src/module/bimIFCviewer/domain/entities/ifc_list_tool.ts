import * as OBC from "openbim-components";

export class IFCModelsTool
  extends OBC.Component<null>
  implements OBC.UI, OBC.Disposable
{
  enabled: boolean = false; //what this stands for??
  static uuid =
    "558c5bca-0753-44f4-9468-7843b6ab1e9a";
  uiElement = new OBC.UIElement<{
    ifcModelsBtn: OBC.Button;
    // modalContainer: OBC.FloatingWindow;
    //https://github.com/IFCjs/components/blob/main/src/ifc/IfcPropertiesProcessor/index.ts
  }>();
  constructor(components: OBC.Components) {
    super(components);
    components.tools.add(
      IFCModelsTool.uuid,
      this
    );

    if (components.uiEnabled) {
      //Set UI:
      const ifcModelsBtn = new OBC.Button(
        this.components
      );
      ifcModelsBtn.materialIcon = "summarize";
      //description, ...
      ifcModelsBtn.tooltip = "List IFC Models";
      ifcModelsBtn.onClick.add(() => {
        //i) set button status
        ifcModelsBtn.active =
          !ifcModelsBtn.active;

        //ii) show custom panel container
        this.toggleModalList(ifcModelsBtn.active);
      });
      this.uiElement.set({
        ifcModelsBtn: ifcModelsBtn,
      });
    }
  }

  toggleModalList(active: boolean) {
    const ifcPanelContainer =
      document.getElementById(
        "IFC-panel-container"
      );

    if (active) {
      ifcPanelContainer!.style.display = "flex";
    } else if (!active) {
      ifcPanelContainer!.style.display = "none";
    }
  }

  readonly onDisposed = new OBC.Event<string>();
  async dispose() {
    //will trigger all the callbacks assigned to this event...??
    await this.onDisposed.trigger(
      IFCModelsTool.uuid
    );
    this.onDisposed.reset();
  }

  get(): null {
    return null;
  }
}