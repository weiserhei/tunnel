import $ from "jquery";
import { library, icon } from "@fortawesome/fontawesome-svg-core";
import {
  faRedoAlt,
  faBiohazard,
  faVolumeUp,
  faVolumeMute,
  faExpandArrowsAlt,
  faExpand,
  faQuestionCircle,
  faCompress,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

import Config from "../../data/config";

library.add(faExpandArrowsAlt);

export default class UserInterface {
  constructor(container) {
    const div = document.createElement("div");
    div.className =
      "d-flex justify-content-between align-items-center position-absolute fixed-bottom mb-2 mr-2";
    container.appendChild(div);

    const container1 = document.createElement("div");
    const container2 = document.createElement("div");
    const container3 = document.createElement("div");
    div.appendChild(container1);
    div.appendChild(container2);
    div.appendChild(container3);

    const button = document.createElement("span");
    button.innerHTML = icon(faBiohazard, {
      styles: { color: "#fff", filter: "drop-shadow(0px 0px 3px rgba(0,0,0))" },
      classes: ["fa-lg", "text-warning"],
    }).html;
    button.className = "bg-transparent";
    button.setAttribute("type", "button");
    this.playButton = button;

    const button2 = document.createElement("span");
    button2.innerHTML = icon(faRedoAlt, {
      classes: ["fa-lg", "text-primary"],
    }).html;
    button2.style.textShadow = "0 0 8px white";
    button2.className = "bg-transparent";
    button2.setAttribute("type", "button");
    $(button2).hide();
    this.resetButton = button2;

    container2.appendChild(button);
    container2.appendChild(button2);

    const info = document.createElement("button");
    // info.className = "btn btn-black position-absolute fixed-bottom ml-2 mb-2 btn-sm";
    info.className = "shadow-none text-black ml-3 bg-transparent border-0 p-2";
    info.setAttribute("type", "button");
    const i = icon(faQuestionCircle, {
      // styles: { color: "#fff", filter:"drop-shadow(0px 0px 0px rgba(255,255,255,1))" },
      classes: ["fa-lg", "text-dark"],
    }).html;
    info.innerHTML = i;
    info.onclick = function () {
      $(overlay2).fadeToggle();
      if ($(overlay).is(":visible")) {
        $(overlay).hide();
      }
    };

    const settings = document.createElement("button");
    // settings.className = "btn btn-black position-absolute fixed-bottom ml-2 mb-5 btn-sm";
    settings.className = "text-black ml-3 bg-transparent border-0 p-2";
    settings.setAttribute("type", "button");
    settings.innerHTML = icon(faCog, {
      // styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,1))" },
      classes: ["fa-lg", "text-dark"],
    }).html;
    // info.innerHTML = icon(
    //     faCogs,
    // { styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,1))" },
    // classes: ["text-dark", "fa-lg"] }
    //     ).html;
    // container.appendChild(settings);
    settings.onclick = function () {
      $(overlay).fadeToggle();
      if ($(overlay2).is(":visible")) {
        $(overlay2).hide();
      }
    };

    const tray = document.createElement("button");
    tray.className = "text-black ml-3 bg-transparent border-0 p-2";
    tray.setAttribute("type", "button");
    const vol = icon(faVolumeUp, { classes: ["fa-lg", "text-primary"] }).html;
    tray.innerHTML = vol;
    const mute = icon(faVolumeMute, { classes: ["text-dark", "fa-lg"] }).html;
    this.volumeIcon = tray;

    this.mute = function (value) {
      if (value) {
        tray.innerHTML = vol;
      } else {
        tray.innerHTML = mute;
      }
    };

    container1.appendChild(info);
    container1.appendChild(settings);
    container1.appendChild(tray);

    this.fullIcon = icon(faExpand, { classes: ["text-dark", "fa-lg"] }).html;
    this.shrinkIcon = icon(faCompress, {
      classes: ["text-dark", "fa-lg"],
    }).html;
    this.button3 = document.createElement("span");
    this.button3.className = "text-black ml-3 bg-transparent border-0 p-2";
    this.button3.setAttribute("type", "button");
    this.button3.style.right = 0;
    this.button3.style.bottom = 0;
    // button3.appendChild(fullIcon);
    this.button3.innerHTML = this.fullIcon;
    // div.appendChild(this.button3);
    container3.appendChild(this.button3);
    // this.button3.onclick = openFullscreen.bind(container);

    const overlay2 = document.createElement("div");
    overlay2.className =
      "position-absolute bg-dark text-secondary p-2 m-4 card";
    overlay2.style.top = 0;
    overlay2.innerHTML =
      // <li class="list-group-item bg-info text-light">
      //     Sound Reference
      // </li>
      `
        <div class="card-body">
            <div class="card mb-3 bg-secondary text-white">
                <div class="card-header">
                    Tunnel Demo (2019)
                </div>
                <div class="card-body bg-dark">
                    Three.js r119, Shader-Particle-Engine, Rectangle-Area Lights, Postprocessing
                </div>
            </div>
            <div class="card bg-secondary text-light">
                <div class="card-header">References</div>
                    <table class="table table-dark mb-0">
                        <thead class="thead-dark">
                            <tr>
                                <th>Artist</th>
                                <th>Work</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Yughues</td>
                            <td><a href="https://www.deviantart.com/yughues/art/Free-textures-pack-41-352194217" target="_blank">Free textures pack 41</a></td>
                        </tr>
                        <tr>
                            <td>ModulationStation</td>
                            <td><a href="https://freesound.org/people/ModulationStation/sounds/131599/" target="_blank">Kill Switch</a></td>
                        </tr>
                        <tr>
                            <td>mirkosukovic</td>
                            <td><a href="https://freesound.org/people/mirkosukovic/sounds/435666/" target="_blank">Alarm Siren</a></td>
                        </tr>
                        <tr>
                            <td>iSaria</td>
                            <td><a href="https://freesound.org/people/iSaria/sounds/326261/" target="_blank">zombi purr 2</a></td>
                        </tr>
                        <tr>
                            <td>steveygos93</td>
                            <td><a href="https://freesound.org/people/steveygos93/sounds/80401/" target="_blank">Explosion 2</a></td>
                        </tr>
                        <tr>
                            <td>kingof_thelab</td>
                            <td><a href="https://freesound.org/people/kingof_thelab/sounds/340255/" target="_blank">Steam Loop Body</a></td>
                        </tr>
                        <tr>
                            <td>LamaMakesMusic</td>
                            <td><a href="https://freesound.org/people/LamaMakesMusic/sounds/403537/" target="_blank">Door_Heavy_Reverb_Open_Close</a></td>
                        </tr>
                        <tr>
                            <td> felixmariotto </td>
                            <td><a href="https://github.com/felixmariotto/three-screenshake" target="_blank">Camera Shake</a></td>
                        </tr>
                        <tr>
                            <td> squashy555 </td>
                            <td><a href="https://freesound.org/people/squashy555/sounds/256915/" target="_blank">Arc Welding</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
        </div>`;
    $(overlay2).hide();
    container.appendChild(overlay2);

    const overlay = document.createElement("div");
    overlay.className = "position-absolute bg-dark text-secondary p-2 m-4 card";
    overlay.style.top = 0;
    overlay.innerHTML =
      // '<input type="text" class="form-control" value="?/lights=">';
      // <input type="text" class="form-control" value="?/lights=">
      `
        <div class="card-body">
        <div class="input-group" role="group" aria-label="Basic example">
        <div class="input-group-prepend">
            <div class="input-group-text" id="btnGroupAddon">/?lights=</div>
        </div>
        <input type="number" class="form-control" placeholder="` +
      Config.block.count +
      `" id="lightInput" aria-label="Input group example" aria-describedby="btnGroupAddon">
        <button type="button" onclick="{ 
            window.location.href = location.protocol + '//' + location.host + location.pathname +'?lights='+ document.getElementById('lightInput').value; 
        }" class="btn btn-secondary">reload</button>
        </div>
      </div>`;
    $(overlay).hide();
    container.appendChild(overlay);
  }
}
