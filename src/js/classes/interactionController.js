import $ from "jquery";
import { library, icon } from '@fortawesome/fontawesome-svg-core';
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

} from '@fortawesome/free-solid-svg-icons';
library.add(faExpandArrowsAlt);

function toggleFullScreen() {
    // https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
    var doc = window.document;
    var docEl = doc.documentElement;
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }
  
export default class InteractionController {

    constructor(container, listener, tunneblocks) {
        let time = 0;
        let current = undefined;
        let blocks = tunneblocks.slice(0);
        let running = false;
        let toggle = true;

        const button = document.createElement("button");
        button.innerHTML = icon(
            faSkullCrossbones, 
            // { styles: { color: "#fff", filter:"drop-shadow(0px 0px 5px rgba(255,255,255,1))" }}, 
            { classes: ["mr-2", "text-white"] }
            ).html+ " Whos there?";
        button.style.textShadow = "0 0 8px white";
        button.className = "btn btn-danger btn-lg";

        const button2 = document.createElement("button");
        button2.innerHTML = icon(faRedoAlt, { classes: ["mr-2", "text-danger"] }).html + "rewind";
        button2.style.textShadow = "0 0 8px white";
        button2.className = "btn btn-dark ml-1";
        $(button2).hide();

        const div = document.createElement("div");
        div.className = "d-flex justify-content-center align-items-center position-absolute fixed-bottom mb-5";
        div.appendChild(button);
        div.appendChild(button2);
        container.appendChild(div);

        button.onclick = () => {
            play();
        }

        button2.onclick = () => {
            reverse();
            play();
            // $(button).fadeOut();
            // $(button2).fadeOut();
        }
        

        function reverse() {
            toggle = !toggle;
            blocks = tunneblocks.slice(0);
            // this.play();
        }

        function play() {
            if( blocks.length > 0 ) {
                running = true;
                $(button).fadeOut();
                $(button2).fadeOut();
            }
        }
        
        this.update = function( delta ) {
            tunneblocks.forEach(block => block.update(delta));
            time += delta;
            if (( !running || blocks.length < 1  ) || time < 1) return;

            current = blocks.pop();
            time = 0;
            toggle ? current.off() : current.on();
            if(blocks.length === 0) {
                running = false;
                if( toggle ) {
                    // setTimeout( () => { current.mesh.children[4].play(); }, 500);
                    setTimeout( () => { $(button2).fadeIn(); }, 3000);
                } else {
                    reverse();
                    $(button).fadeIn();
                }
            }
        
        }

        const fullIcon = icon(faExpand, { transform: { x:0 }, classes: ["text-dark", "fa-lg"] }).html;
        const shrinkIcon = icon(faCompress, { transform: { x:0 }, classes: ["text-dark", "fa-lg"] }).html;
        const button3 = document.createElement("button");
        button3.className = "btn btn-dark position-absolute mb-3 mr-3 float-right bg-transparent btn-sm";
        button3.style.right = 0;
        button3.style.bottom = 0;
        // button3.appendChild(fullIcon);
        button3.innerHTML = fullIcon;
        container.appendChild(button3);
        // button3.onclick = openFullscreen.bind(container);
        button3.onclick = function() { 
            this.toggle ? button3.innerHTML = fullIcon : button3.innerHTML = shrinkIcon;
            this.toggle = !this.toggle;
            toggleFullScreen() 
        };

        const tray = document.createElement("button");
        tray.className = "btn btn-black position-absolute fixed-bottom ml-5 mb-2 btn-sm";
        const vol = icon(faVolumeUp, { classes: ["text-secondary", "fa-lg"] }).html;
        tray.innerHTML = vol;
        const mute = icon(faVolumeMute, { classes: ["text-secondary", "fa-lg"] }).html;
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
        // <button type="button" class="close float-right" aria-label="Close">
        // <span aria-hidden="true">&times;</span>
        // </button>

        const overlay = document.createElement("div");
        overlay.className = "position-absolute fixed-top bg-dark text-secondary w-25 p-2 m-4 card";
        overlay.innerHTML = 
        // '<input type="text" class="form-control" value="?/lights=">';
        // <input type="text" class="form-control" value="?/lights=">
        `<div class="input-group" role="group" aria-label="Basic example">
        <div class="input-group-prepend">
            <div class="input-group-text" id="btnGroupAddon">/?lights=</div>
        </div>
        <input type="number" class="form-control" placeholder="#" id="lightInput" aria-label="Input group example" aria-describedby="btnGroupAddon">
        <button type="button" onclick="{ 
            window.location.href = location.protocol + '//' + location.host + location.pathname +'?lights='+ document.getElementById('lightInput').value; 
        }" class="btn btn-secondary">reload</button>
      </div>`;
        $(overlay).hide();
        container.appendChild(overlay);

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
            $(overlay).fadeToggle();
        }

    }

}