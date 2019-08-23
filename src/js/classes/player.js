import { Clock } from "three";
import $ from "jquery";

export default class Player {
    constructor(tunneblocks, button, button2) {

        const clock = new Clock();
        let time = 0;
        let current = undefined;
        let blocks = tunneblocks.slice(0);
        let run = false;
        let toggle = true;

        this.reverse = function() {
            toggle = !toggle;
            this.reset();
            // this.play();
        }

        this.play = function() {
            // this.reset();
            if( blocks.length > 0 ) {
                run = true;
                $(button).fadeOut();
                $(button2).fadeOut();
            }
        }
        
        this.reset = function() {
            // licht an
            blocks = tunneblocks.slice(0);
        }

        this.on = function(block) {
            current.on();
        }

        this.off = function(block) {
            current.off();
        }
        
        this.update = function() {
            time += clock.getDelta();
            if( run && blocks.length > 0 ) {
                if(time > 1) {
                    current = blocks.pop();
                    time = 0;
                    if(toggle) {
                        this.off(current);
                    } else {
                        this.on(current);
                    }
                    // this.on(current);
                    if(blocks.length === 0) {
                        const self = this;
                        run = false;
                        if( toggle ) {
                            // setTimeout( () => { current.mesh.children[4].play(); }, 500);
                            setTimeout( () => { $(button2).fadeIn(); }, 4000);
                        } else {
                            this.reverse();
                            $(button).fadeIn();
                        }
                        // current.children[4].play();
                    }
                    // current.userData.lamp.material.emissive.setHex(0x666633);
                    // current.userData.lamp.materials[0].material.emissive.setHex(0x666633);
                }
            }
        }
    }

}