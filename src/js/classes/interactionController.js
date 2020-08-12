import { Raycaster, Vector2 } from "three";
import $ from "jquery";

import Hud from "./hud";

function toggleFullScreen() {
  // https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
  var doc = window.document;
  var docEl = doc.documentElement;
  var requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  var cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;
  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

export default class InteractionController {
  constructor(container, listener, tunnelblocks, camera) {
    let time = 0;
    let current = undefined;
    let blocks = tunnelblocks.slice(0);
    let running = false;
    let toggle = true;
    const raycaster = new Raycaster();
    raycaster.layers.set(1);
    const vector = new Vector2();

    const hud = new Hud(container);

    hud.playButton.onclick = () => {
      tunnelblocks[0].button.userData.move(false);
      play();
    };

    hud.resetButton.onclick = () => {
      reverse();
      tunnelblocks[0].button.userData.move(true);
      play();
      // $(button).fadeOut();
      // $(button2).fadeOut();
    };

    function reverse() {
      toggle = !toggle;
      blocks = tunnelblocks.slice(0);
      // this.play();
    }

    function play() {
      if (blocks.length > 0) {
        running = true;
        $(hud.playButton).fadeOut();
        $(hud.resetButton).fadeOut();
      }
    }

    this.update = function (delta) {
      tunnelblocks.forEach((block) => block.update(delta));
      time += delta;
      if (!running || blocks.length < 1 || time < 1) return;

      current = blocks.pop();
      time = 0;
      toggle ? current.off() : current.on();
      if (blocks.length === 0) {
        running = false;
        if (toggle) {
          setTimeout(() => {
            if (!running) {
              $(hud.resetButton).fadeIn();
            }
          }, 3000);
        } else {
          reverse();
          $(hud.playButton).fadeIn();
        }
      }
    };

    hud.button3.onclick = function () {
      this.toggle
        ? (hud.button3.innerHTML = hud.fullIcon)
        : (hud.button3.innerHTML = hud.shrinkIcon);
      this.toggle = !this.toggle;
      toggleFullScreen();
    };

    hud.tray.onclick = function () {
      if (this.toggle) {
        this.toggle = false;
        listener.setMasterVolume(1);
        hud.tray.innerHTML = hud.vol;
      } else {
        this.toggle = true;
        listener.setMasterVolume(0);
        hud.tray.innerHTML = hud.mute;
      }
    };
    // <button type="button" class="close float-right" aria-label="Close">
    // <span aria-hidden="true">&times;</span>
    // </button>

    container.addEventListener("mousedown", onDocumentMouseDown, false);
    container.addEventListener("mousemove", onMouseMove, false);

    const meshes = blocks.map((b) => b.mesh);
    let intersects = [];
    function onMouseMove(event) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      vector.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(vector, camera);
      intersects = raycaster.intersectObjects(meshes, true);
      if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }

    function onDocumentMouseDown() {
      if (intersects.length > 0) {
        // push button
        // play();

        // if( !toggle ) {
        // reverse();
        // }
        if (blocks.length === 0 || !toggle) {
          intersects[0].object.userData.move(true);
          reverse();
          play();
        } else {
          intersects[0].object.userData.move(false);
          play();
        }
      }
    }
  }
}
