import * as OBC from "openbim-components";
export const measurements = {
  init: (
    viewer: OBC.Components,
    viewerContainer: HTMLElement
  ) => {
    const dimensions = viewer.tools.get(
      OBC.LengthMeasurement
    );
    //settings
    dimensions.enabled = false; //

    dimensions.snapDistance = 1;

    //events
    viewerContainer.ondblclick = () => {
      dimensions.create();
      console.log("double click");
    };
    viewerContainer.onclick = () => {
      //bug! the dimensions get trigered here after disabling and enabling again!
      console.log("1 click");
    };
    window.onkeydown = (event: KeyboardEvent) => {
      if (
        event.code === "Delete" ||
        event.code === "Backspace"
      ) {
        //the tool has to be enabled for this to work properly!! its amazing it works!
        dimensions.delete();
      }
    };

    viewer.ui.toolbars[0].addChild(
      dimensions.uiElement.get("main")
    );
  },
};
