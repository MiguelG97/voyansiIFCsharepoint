// function toggleFullScreen(element) {
//   if (!document.fullscreenElement) {
//     // Intentar entrar en modo pantalla completa
//     if (element.requestFullscreen) {
//       element.requestFullscreen();
//     } else if (element.mozRequestFullScreen) {
//       /* Firefox */
//       element.mozRequestFullScreen();
//     } else if (element.webkitRequestFullscreen) {
//       /* Chrome, Safari y Opera */
//       element.webkitRequestFullscreen();
//     } else if (element.msRequestFullscreen) {
//       /* IE/Edge */
//       element.msRequestFullscreen();
//     }
//   } else {
//     // Salir del modo pantalla completa
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.mozCancelFullScreen) {
//       /* Firefox */
//       document.mozCancelFullScreen();
//     } else if (document.webkitExitFullscreen) {
//       /* Chrome, Safari y Opera */
//       document.webkitExitFullscreen();
//     } else if (document.msExitFullscreen) {
//       /* IE/Edge */
//       document.msExitFullscreen();
//     }
//   }
// }

// // Ejemplo de uso
// document
//   .getElementById("miBotonPantallaCompleta")
//   .addEventListener("click", function () {
//     // Suponiendo que tienes un elemento con el ID 'miElemento'
//     var elemento =
//       document.getElementById("miElemento");
//     toggleFullScreen(elemento);
//   });
