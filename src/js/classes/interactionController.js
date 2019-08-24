import $ from "jquery";
import Hud from "./hud";

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

        const hud = new Hud(container);

        hud.playButton.onclick = () => {
            play();
        }

        hud.resetButton.onclick = () => {
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
                $(hud.playButton).fadeOut();
                $(hud.resetButton).fadeOut();
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
                    setTimeout( () => { $(hud.resetButton).fadeIn(); }, 3000);
                } else {
                    reverse();
                    $(hud.playButton).fadeIn();
                }
            }
        
        }

        hud.button3.onclick = function() { 
            this.toggle ? hud.button3.innerHTML = hud.fullIcon : hud.button3.innerHTML = hud.shrinkIcon;
            this.toggle = !this.toggle;
            toggleFullScreen() 
        };

        hud.tray.onclick = function() { 
            if(this.toggle) { 
                this.toggle = false;
                listener.setMasterVolume(1); 
                hud.tray.innerHTML = hud.vol;
            } else { 
                this.toggle = true;
                listener.setMasterVolume(0); 
                hud.tray.innerHTML = hud.mute;
            }
        }
        // <button type="button" class="close float-right" aria-label="Close">
        // <span aria-hidden="true">&times;</span>
        // </button>

    }

}