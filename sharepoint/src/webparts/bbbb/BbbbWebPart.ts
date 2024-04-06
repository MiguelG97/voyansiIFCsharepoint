import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
import styles from "./BbbbWebPart.module.scss";

export interface IBbbbWebPartProps {
  description: string;
}

export default class BbbbWebPart extends BaseClientSideWebPart<IBbbbWebPartProps> {
  //HERE EXTREMELY IMPORTANT! THE HTML FILE IS NOT BEING IMPORTED THUS WE HAVE TO DECLARE IT HERE!

  public render(): void {
    //i). the same document from sharepoint
    // const rootNode =
    //   this.domElement.getRootNode();
    const domROOt = this.domElement.ownerDocument;

    const css = `
    * {
    margin: 0;
    padding: 0;
  }

    #map {
      position: absolute !important;
      visibility: hidden;
      z-index: 10;
    }
    :root {
      --primary-color: #005991 !important;
      /* --secondary-color: #ff9500 !important; */
      --secondary-color: rgb(
        230,
        229,
        229
      ) !important;
      --secondary-color-100: #ffffff !important;
    
      --secondary-color-120: white !important;
    }
    #bottom-toolbar-container span {
      color: #000;
    }
${styles["obc-viewer"]}
    #bottom-toolbar-container
      button:hover
      .material-icons {
      color: #fff !important;
    }
    .obc-viewer :is(.text-white) {
      color: #000;
    }
    .obc-viewer :is(.bg-ifcjs-200) {
      background-color: #fff;
    }
    `;
    const head: HTMLHeadElement =
      domROOt.getElementsByTagName("head")[0];
    const style = domROOt.createElement("style");
    style.appendChild(
      domROOt.createTextNode(css)
    );
    head.appendChild(style);

    //iii) this is a div element!
    let sharepointDiv = this.domElement;
    sharepointDiv.style.position = "relative";

    sharepointDiv.innerHTML = `
    <div
    id="map"
    class="top-0 z-[10] absolute ${styles.sharepointViewer}"
    ></div>

    <div class="${styles.sharepointViewer} "
    id="sharepoint-viewer-app" >
    </div>
    `;
  }

  protected onInit(): Promise<void> {
    setTimeout(async () => {
      // eslint-disable-next-line @microsoft/spfx/import-requires-chunk-name
      await import(
        //@ts-ignore
        /*webpackIgnore:true*/ "https://miguelg97.github.io/mapbox3dmodel/public/utils/ifcjs.js"
      );
      document.body.style.display = "relative";

      const toolbar = document.getElementById(
        "bottom-toolbar-container"
      );

      const childToolbar: HTMLDivElement = toolbar
        ?.children[0] as HTMLDivElement;
      childToolbar?.addEventListener(
        "click",
        (e: MouseEvent) => {
          if (
            (e.target! as HTMLElement)
              .localName === "span"
          ) {
            const span: HTMLSpanElement =
              e.target as HTMLSpanElement;
            // console.log(span.style.color);
            if (span.style.color === "white") {
              span.style.setProperty(
                "color",
                "#000",
                "important"
              );
            } else if (
              span.style.color === "#000" ||
              !span.style.color ||
              span.style.color === "rgb(0, 0, 0)"
            ) {
              span.style.setProperty(
                "color",
                "white",
                "important"
              );
            }
          } else if (
            (e.target! as HTMLElement)
              .localName === "button"
          ) {
            // console.log("my button");
            const button: HTMLButtonElement =
              e.target as HTMLButtonElement;
            // eslint-disable-next-line guard-for-in
            for (const key in button.children) {
              const span = button.children[
                key
              ] as HTMLSpanElement;
              if (
                !(
                  span instanceof HTMLSpanElement
                ) ||
                span === undefined
              )
                continue; //in case it's not a span
              if (
                span.classList.contains(
                  "material-icons"
                )
              ) {
                if (
                  span.style.color === "white"
                ) {
                  span.style.setProperty(
                    "color",
                    "#000",
                    "important"
                  );
                } else if (
                  span.style.color === "#000" ||
                  !span.style.color ||
                  span.style.color ===
                    "rgb(0, 0, 0)"
                ) {
                  span.style.setProperty(
                    "color",
                    "white",
                    "important"
                  );
                }
              }
            }
          }

          // if (childToolbar.children.length > 0) {
          //   // eslint-disable-next-line guard-for-in
          //   for (const index in childToolbar.children) {
          //     const child: HTMLButtonElement =
          //       childToolbar.children[
          //         index
          //       ] as HTMLButtonElement;

          //     if (child.dataset === undefined)
          //       continue;

          //     if (
          //       child.dataset.active === "true"
          //     ) {
          //       // eslint-disable-next-line guard-for-in
          //       for (const key in child.children) {
          //         const span = child.children[
          //           key
          //         ] as HTMLSpanElement;
          //         if (
          //           !(
          //             span instanceof
          //             HTMLSpanElement
          //           ) ||
          //           span === undefined
          //         )
          //           continue; //in case it's not a span
          //         console.log(
          //           "active span",
          //           span,
          //           child
          //         );
          //         if (
          //           span.classList.contains(
          //             "material-icons"
          //           )
          //         ) {
          //           span.style.setProperty(
          //             "color",
          //             "#000",
          //             "important"
          //           );
          //         }
          //       }
          //     } else if (
          //       child.dataset.active === "false"
          //     ) {
          //       // eslint-disable-next-line guard-for-in
          //       for (const key in child.children) {
          //         const span = child.children[
          //           key
          //         ] as HTMLSpanElement;
          //         if (
          //           !(
          //             span instanceof
          //             HTMLSpanElement
          //           ) ||
          //           span === undefined
          //         )
          //           continue; //in case it's not a span
          //         console.log(
          //           "inactive span",
          //           span,
          //           child
          //         );
          //         if (
          //           span.classList.contains(
          //             "material-icons"
          //           )
          //         ) {
          //           span.style.setProperty(
          //             "color",
          //             "white",
          //             "important"
          //           );
          //         }
          //       }
          //     }
          //   }
          // }
        },
        true
      );

      // const delet = () => {
      //   // eslint-disable-next-line guard-for-in
      //   for (const index in childToolbar.children) {
      //     const button: HTMLButtonElement =
      //       childToolbar.children[
      //         index
      //       ] as HTMLButtonElement;
      //     button?.addEventListener(
      //       "click",
      //       () => {
      //         console.log("button click");
      //         button.classList;
      //       }
      //     );

      //     // eslint-disable-next-line guard-for-in
      //     for (const key in button.children) {
      //       const span = button.children[
      //         key
      //       ] as HTMLSpanElement;
      //       if (
      //         !(
      //           span instanceof HTMLSpanElement
      //         ) ||
      //         span === undefined
      //       )
      //         continue;

      //       if (
      //         span.classList.contains(
      //           "material-icons"
      //         )
      //       ) {
      //         span.addEventListener(
      //           "click",
      //           () => {
      //             console.log("span click");
      //             span.classList;
      //           }
      //         );
      //       }
      //     }
      //   }
      // };

      window.dispatchEvent(new Event("resize"));
      await this.loadMultipleIFCfiles();
    }, 1000);

    return new Promise<void>((resolve) => {
      // const docFiles =
      //   "_api/web/lists/GetByTitle('Documents')/Files";
      // const baseUrl =
      //   this.context.pageContext.web.absoluteUrl;
      // const url = `${baseUrl}/${docFiles}`;
      // const http = this.context.spHttpClient;
      // const config =
      //   SPHttpClient.configurations.v1;

      // http
      //   .get(url, config)
      //   .then(async (response) => response.json())
      //   .then((documents) => {
      //     console.log(documents);
      //   })
      //   .catch((x) =>
      //     console.log("error here", x)
      //   );
      return resolve();
    });
  }

  protected async loadFirstFile(): Promise<void> {
    const docFiles =
      "_api/web/lists/GetByTitle('Documents')/Files";
    const baseUrl =
      this.context.pageContext.web.absoluteUrl;
    const url = `${baseUrl}/${docFiles}`; //graph.microsoft.com/v1.0.....
    const http = this.context.spHttpClient;
    const config = SPHttpClient.configurations.v1;
    const response = await http.get(url, config);
    const documents = await response.json();
    if (documents.value.length) {
      let url = window.location.href;
      const texts = url.split("/");
      url = texts[texts.length - 1];
      url = url.replace(".aspx", "");

      for (const val of documents.value) {
        const ifcName = val.Name.replace(
          ".ifc",
          ""
        );

        if (url.includes(ifcName)) {
          // console.log(
          //   "url.includes(ifcName)",
          //   url
          // );
          const fetched = await fetch(val.Url);
          const buffer =
            await fetched.arrayBuffer();
          const data = new Uint8Array(buffer);
          const eventList = new CustomEvent(
            "loadIFCData",
            {
              detail: {
                data: {
                  Name: ifcName,
                  bufferArr: data,
                },
                name: "loadIFCData",
              },
            }
          );
          window.dispatchEvent(eventList);
          break;
        }
      }
    }
  }

  protected async loadMultipleIFCfiles(): Promise<void> {
    const docFiles =
      "_api/web/lists/GetByTitle('Documents')/Files";
    const baseUrl =
      this.context.pageContext.web.absoluteUrl;
    const url = `${baseUrl}/${docFiles}`; //graph.microsoft.com/v1.0.....
    const http = this.context.spHttpClient;
    const config = SPHttpClient.configurations.v1;
    const response = await http.get(url, config);
    const documents = await response.json();

    if (documents.value.length) {
      let url = window.location.href;
      const texts = url.split("/");
      url = texts[texts.length - 1];
      const pageTitle = url.replace(".aspx", "");

      // check for .frag existence
      let isFragFile = false;
      for (const val of documents.value) {
        isFragFile = (
          val.Name as string
        ).includes(".frag");
        break;
      }

      //send frag and json prop file
      if (isFragFile) {
        const fragData: { [name: string]: any } =
          {};
        for (const val of documents.value) {
          if (
            (val.Name as string).includes(".frag")
          ) {
            const fragName = (
              val.Name as string
            ).replace(".frag", "");
            //since we gonna load multiple files, the fragName could have an extra extension!!
            if (fragName.includes(pageTitle)) {
              const fetched = await fetch(
                val.Url
              );
              const buffer =
                await fetched.arrayBuffer();
              const fragArray = new Uint8Array(
                buffer
              );

              //group the data
              if (fragName in fragData) {
                fragData[fragName].frag =
                  fragArray;
              } else {
                fragData[fragName] = {
                  frag: fragArray,
                };
              }
            }
          } else if (
            (val.Name as string).includes(".json")
          ) {
            const propName = val.Name.replace(
              ".json",
              ""
            );
            if (propName.includes(pageTitle)) {
              const fetched = await fetch(
                val.Url
              );
              const jsonProps =
                await fetched.json();

              //group the data
              if (propName in fragData) {
                fragData[propName].json =
                  jsonProps;
              } else {
                fragData[propName] = {
                  json: jsonProps,
                };
              }
            }
          }
        }

        const eventList = new CustomEvent(
          "loadIFCData",
          {
            detail: {
              type: "fragments",
              data: {
                fragData: fragData,
              },
              name: "loadIFCData",
            },
          }
        );
        window.dispatchEvent(eventList);
      }
      //send ifc file
      else {
        const fragData: { [name: string]: any } =
          {};
        for (const val of documents.value) {
          const ifcName = val.Name.replace(
            ".ifc",
            ""
          );

          if (ifcName.includes(pageTitle)) {
            const fetched = await fetch(val.Url);
            const buffer =
              await fetched.arrayBuffer();
            const data = new Uint8Array(buffer);

            fragData[ifcName + ".ifc"] = data;
          }
        }
        const eventList = new CustomEvent(
          "loadIFCData",
          {
            detail: {
              type: "ifc",
              data: {
                fragData: fragData,
              },
              name: "loadIFCData",
            },
          }
        );
        window.dispatchEvent(eventList);
      }
    }
  }
}
