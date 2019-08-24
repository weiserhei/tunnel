import $ from "jquery";
import { library, icon, layer } from '@fortawesome/fontawesome-svg-core';
import { 
    faRedoAlt,
    faSkullCrossbones,
    faBiohazard,
    faVolumeUp,
    faVolumeMute,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
    faExpand,
    faQuestionCircle,
    faCompress,
    faCog,
    faCogs,
    faCircle,
    faWrench
} from '@fortawesome/free-solid-svg-icons';
library.add(faExpandArrowsAlt);

export default class Hud {
    constructor(container, listener, tunneblocks) {

        const button = document.createElement("button");
        button.innerHTML = icon(
            faSkullCrossbones, 
            // { styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,1))" }}, 
            { classes: ["mr-2", "text-white"] }
            ).html+ "Anybody here?";
        button.style.textShadow = "0 0 8px white";
        button.className = "btn btn-danger btn-lg";
        this.playButton = button;

        const button2 = document.createElement("button");
        button2.innerHTML = icon(faRedoAlt, { classes: ["mr-2", "fa-sm", "text-primary"] }).html + "restart";
        button2.style.textShadow = "0 0 8px white";
        button2.className = "btn btn-dark btn-lg bg-transparent ml-1";
        button2.style.border = 0;
        $(button2).hide();
        this.resetButton = button2;

        const div = document.createElement("div");
        div.className = "d-flex justify-content-center align-items-center position-absolute fixed-bottom mb-5";
        div.appendChild(button);
        div.appendChild(button2);
        container.appendChild(div);

        this.fullIcon = icon(faExpand, { transform: { x:0 }, classes: ["text-dark", "fa-lg"] }).html;
        this.shrinkIcon = icon(faCompress, { transform: { x:0 }, classes: ["text-dark", "fa-lg"] }).html;
        this.button3 = document.createElement("button");
        this.button3.className = "btn btn-dark position-absolute mb-3 mr-3 float-right bg-transparent btn-sm";
        this.button3.style.right = 0;
        this.button3.style.bottom = 0;
        // button3.appendChild(fullIcon);
        this.button3.innerHTML = this.fullIcon;
        container.appendChild(this.button3);
        // this.button3.onclick = openFullscreen.bind(container);

        const tray = document.createElement("button");
        tray.className = "btn btn-black position-absolute fixed-bottom ml-5 mb-2 btn-sm";
        this.vol = icon(faVolumeUp, { classes: ["text-secondary", "fa-lg"] }).html;
        tray.innerHTML = this.vol;
        this.mute = icon(faVolumeMute, { classes: ["text-secondary", "fa-lg"] }).html;
        container.appendChild(tray);
        this.tray = tray;
        
        const overlay2 = document.createElement("div");
        overlay2.className = "position-absolute bg-dark text-secondary p-2 m-4 card";
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
                    Three.js r107, RectArea Lights, Postprocessing
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
                        </tbody>
                    </table>
                </div>
        </div>`;
        $(overlay2).hide();
        container.appendChild(overlay2);

        const info = document.createElement("button");
        info.className = "btn btn-black position-absolute fixed-bottom ml-2 mb-2 btn-sm";
        const i = icon(
            faQuestionCircle,
            { styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,1))" },
            classes: ["text-dark", "fa-lg"] }
            ).html;
            info.innerHTML = i;
        container.appendChild(info);
        info.onclick = function() { 
            $(overlay2).fadeToggle();
            if ( $(overlay).is(":visible") ) {
                $(overlay).hide();
            }
        }
        
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
        <input type="number" class="form-control" placeholder="#" id="lightInput" aria-label="Input group example" aria-describedby="btnGroupAddon">
        <button type="button" onclick="{ 
            window.location.href = location.protocol + '//' + location.host + location.pathname +'?lights='+ document.getElementById('lightInput').value; 
        }" class="btn btn-secondary">reload</button>
        </div>
      </div>`;
        $(overlay).hide();
        container.appendChild(overlay);

        const l = layer((push) => {
            push(icon(faCircle, 
                { 
                    styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,0.8))" },
                    classes: ["text-dark", "fa-lg"], transform: { size: 18 }  
                } ))
            push(icon(
                faCog,
                { 
                    // styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,1))" },
                    transform: { x: 3, y: -1 },
                    classes: ["text-secondary"] 
                }
                ))
          }).html

        const settings = document.createElement("button");
        settings.className = "btn btn-black position-absolute fixed-bottom ml-2 mb-5 btn-sm";
        settings.innerHTML = l;
        // info.innerHTML = icon(
        //     faCogs,
            // { styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,1))" },
            // classes: ["text-dark", "fa-lg"] }
        //     ).html;
        container.appendChild(settings);
        settings.onclick = function() { 
            $(overlay).fadeToggle();
            if ( $(overlay2).is(":visible") ) {
                $(overlay2).hide();
            }
        }


    }

}