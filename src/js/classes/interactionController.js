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
    };

    function reverse() {
      toggle = !toggle;
      blocks = tunnelblocks.slice(0);
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

    let toggleAudio = false;
    hud.volumeIcon.onclick = function () {
      if (toggleAudio) {
        listener.setMasterVolume(1);
        hud.mute(toggleAudio);
      } else {
        listener.setMasterVolume(0);
        hud.mute(toggleAudio);
      }
      toggleAudio = !toggleAudio;
    };

    // mute audio when tab is not active
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          listener.setMasterVolume(0);
        } else if (!toggleAudio) {
          // only un-mute if audio isnt turned off by the user
          listener.setMasterVolume(1);
        }
      },
      false
    );
    // <button type="button" class="close float-right" aria-label="Close">
    // <span aria-hidden="true">&times;</span>
    // </button>

    container.addEventListener("mousedown", onDocumentMouseDown, false);
    container.addEventListener("mousemove", onMouseMove, false);

    const meshes = blocks.map((b) => b.mesh);
    let intersects = [];
    function raycast(event) {
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

    function onMouseMove(event) {
      raycast(event);
    }

    function onDocumentMouseDown(event) {
      raycast(event);
      if (intersects.length > 0) {
        // push button
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
