import { 
    Vector2,
    Raycaster,
    Mesh,
    SphereBufferGeometry,
    MeshNormalMaterial,
    Vector3,
    PointLightHelper,
    SpotLightHelper
} from "three";
import Config from './../../data/config';

import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { 
    faRedoAlt,
    faSkullCrossbones,
    faBiohazard,
    faVolumeUp,
    faVolumeMute,
    faExpandArrowsAlt,
    faExpand
} from '@fortawesome/free-solid-svg-icons';
library.add(faExpandArrowsAlt);


function openFullscreen() {
    // var elem = document.getElementById("id-webglcanvas");
    var elem = this;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    elem.style.width = '100%';
    elem.style.height = '100%';
}

export default class InteractionController {

    constructor(container, listener, lightManager, panel, scene, camera) {


        const fullIcon = icon(faExpandArrowsAlt, { transform: { x:0 }, classes: ["text-dark", "fa-lg"] }).node[0];
        const button3 = document.createElement("button");
        button3.className = "btn btn-dark position-absolute mb-2 mr-2 float-right bg-transparent border border-light";
        button3.style.right = 0;
        button3.style.bottom = 0;
        button3.appendChild(fullIcon);
        container.appendChild(button3);
        button3.onclick = openFullscreen.bind(container);

        const tray = document.createElement("button");
        tray.className = "btn btn-black position-absolute fixed-bottom ml-2 mb-2";
        const vol = icon(faVolumeUp, { classes: ["text-secondary"] }).html;
        tray.innerHTML = vol;
        const mute = icon(faVolumeMute, { classes: ["text-secondary"] }).html;
        container.appendChild(tray);
        tray.onclick = function() { 
            if(this.toggle) { 
                this.toggle = false;
                listener.setMasterVolume(1); 
                tray.innerHTML = vol;
            } else { 
                this.toggle = true;
                listener.setMasterVolume(0); 
                tray.innerHTML = mute;
            }
        }

    }

    update ( delta, camera ) {
    }

}