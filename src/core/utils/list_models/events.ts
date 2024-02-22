// let dataArray: {
//   Name: string;
//   URl: string;
//   // buffer: Uint8Array;
// }[] = [];

// window.addEventListener(
//   "loadIFCData",
//   async (event: CustomEventInit) => {
//     const { name, dataArr } = event.detail;
//     if (name === "loadIFCData") {
//       // const ifcListDiv =
//       //   document.getElementById("ifcList");
//       // dataArray = dataArr;

//       // for (const item of dataArr) {
//       //   // const { Name } = item;

//       //   // const li = document.createElement("li");
//       //   // li.innerHTML = Name;
//       //   // li.dataset.selected = "false";
//       //   // li.classList.add("ifcItem");
//       //   // li.addEventListener(
//       //   //   "click",
//       //   //   (e: MouseEvent) => {
//       //   //     e.stopPropagation();

//       //   //     const items =
//       //   //       document.getElementsByClassName(
//       //   //         "ifcItem"
//       //   //       );
//       //   //     for (const it of items) {
//       //   //       (
//       //   //         it as HTMLElement
//       //   //       ).dataset.selected = "false";
//       //   //     }
//       //   //     if (li.dataset.selected === "true") {
//       //   //       li.dataset.selected = "false";
//       //   //     } else if (
//       //   //       li.dataset.selected === "false"
//       //   //     ) {
//       //   //       li.dataset.selected = "true";
//       //   //     }
//       //   //   }
//       //   // );
//       //   // ifcListDiv?.appendChild(li);
//       // }
//     }
//   }
// );
// const loadBtn =
//   document.getElementById("loadbutton");
// loadBtn?.addEventListener(
//   "click",
//   async (e: MouseEvent) => {
//     e.stopPropagation();

//     const items =
//       document.getElementsByClassName("ifcItem");

//     for (const index in items) {
//       if (index === "length") break;
//       console.log(
//         (items[index] as HTMLElement)?.dataset
//           .selected,
//         items[index].innerHTML
//       );
//       if (
//         (items[index] as HTMLElement).dataset
//           .selected === "true"
//       ) {
//         const data = dataArray[index];
//         const fetched = await fetch(data.URl);
//         const buffer =
//           await fetched.arrayBuffer();
//         const bufferArray = new Uint8Array(
//           buffer
//         );
//         const model = await ifcLoader.load(
//           bufferArray,
//           data.Name
//         );
//         // console.log(model);
//         const scene = viewer.scene.get();
//         for (const modelChild of scene.children) {
//           if (
//             dataArray.some((x) =>
//               x.Name.includes(modelChild.name)
//             )
//           ) {
//             scene.remove(modelChild);
//           }
//         }
//         scene.add(model);
//         break;
//       }
//     }

//     //shut down the modal
//     if (
//       modeListTool.uiElement.get("ifcModelsBtn")
//         .active
//     ) {
//       modeListTool.uiElement.get(
//         "ifcModelsBtn"
//       ).active = false;
//       modeListTool.toggleModalList(false);
//     }
//   }
// );
