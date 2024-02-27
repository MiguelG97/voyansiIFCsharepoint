import {
  FragmentsGroup,
  IfcProperties,
} from "bim-fragment";
import * as OBC from "openbim-components";

export class Mifcprops {
  static async getIFCcoordinates(
    properties: IfcProperties,
    model: FragmentsGroup
  ): Promise<[number, number] | null> {
    let ifcsiteprops = null;
    for (const [key, value] of Object.entries(
      properties
    )) {
      if (
        value["Name"] !== undefined &&
        value["Name"] !== null
      ) {
        if (
          value["Name"]["value"] === "Default"
        ) {
          ifcsiteprops =
            await model.getProperties(
              Number(key)
            );
          break;
        }
      }
    }
    if (ifcsiteprops !== null) {
      const lat =
        ifcsiteprops["RefLatitude"]["value"];
      const long =
        ifcsiteprops["RefLongitude"]["value"];

      const latDecimal =
        Mifcprops.convertToDecimal(
          lat[0],
          lat[1],
          lat[2],
          lat[3]
        );
      const longDecimal =
        Mifcprops.convertToDecimal(
          long[0],
          long[1],
          long[2],
          long[3]
        );
      return [latDecimal, longDecimal];
    }

    return null;
  }

  static convertToDecimal(
    degrees: number,
    minutes: number,
    seconds: number,
    fraction: number
  ) {
    // La fracción está en microsegundos, por lo que la dividimos por 1e6 para convertirla en segundos
    return (
      degrees +
      minutes / 60 +
      (seconds + fraction / 1000000) / 3600
    );
  }

  static async renderModelProperties(
    viewer: OBC.Components,
    model: FragmentsGroup
  ) {
    const propsProcessor = viewer.tools.get(
      OBC.IfcPropertiesProcessor
    );
    await propsProcessor.process(model);

    //bind highlighter logic to the properties processor
    const fragments = viewer.tools.get(
      OBC.FragmentManager
    );
    const highlighter = viewer.tools.get(
      OBC.FragmentHighlighter
    );

    const highlighterEvents = highlighter.events;
    highlighterEvents.select.onClear.add(() => {
      propsProcessor.cleanPropertiesList();
    });
    highlighterEvents.select.onHighlight.add(
      (selection) => {
        const fragmentID =
          Object.keys(selection)[0];
        const expressID = Number(
          [...selection[fragmentID]][0]
        );
        //this code doesn't make it work!! comment it!
        // let model;
        // for (const group of fragments.groups) {
        //   const fragmentFound = Object.values(
        //     group.keyFragments
        //   ).find((id) => id === fragmentID);
        //   if (fragmentFound) model = group;
        // }
        if (model) {
          propsProcessor.renderProperties(
            model,
            expressID
          );
        }
      }
    );
  }

  // Valores ejemplo directamente de tu línea IFC para latitud y longitud
  // let refLatitude = [42, 21, 31, 181945];
  // let refLongitude = [-71, -3, -24, -263305];

  // Convertir latitud y longitud a decimal
  // let latDecimal = convertToDecimal(...refLatitude);
  // let longDecimal = convertToDecimal(...refLongitude);

  // console.log(`Latitud: ${latDecimal}, Longitud: ${longDecimal}`);
}
