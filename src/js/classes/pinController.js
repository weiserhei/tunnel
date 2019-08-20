import Pin from '../classes/pin';
import Config from './../../data/config';
import { Vector3 } from "three";

export default class PinController {
    constructor(container, controls, lightManager, pointLight) {
        let activePin = undefined;
        let pins = [];

        this.getPins = function() {
            return pins;
        }
        
        this.createPins = function ( pois ) {
            pins.push( ...pois.map(poi => new Pin( poi, container, this )) );
        };

        this.destroyPins = function() {
            if( pins.length > 0 ) {
                // remove elements from DOM
                pins.forEach( pin => pin.destroy() );
                pins.length = 0;
                pointLight.intensity = 0;
            }
        };

        this.enableNext = function() {
            if(activePin !== undefined) {
                const index = pins.indexOf(activePin);
                if(index >= 0 && index < pins.length - 1) {
                    const nextItem = pins[index + 1]
                    activePin.disable();
                    this.setActive(nextItem);
                } else if(index >= 0) {
                    activePin.disable();
                    this.setActive(pins[0]);
                }
            }
        };

        this.setActive = function( pin ) {
            if (activePin === pin ) {
                return;
            } else if ( pin === undefined ) {
                activePin.disable();
                // controls.threeControls.autoRotate = false;
                pointLight.intensity = 0;
                lightManager.reset();
                activePin = undefined;
                return;
            }
    
            if( activePin != undefined ) {
                activePin.disable();
                // this.controls.reset();
                pointLight.intensity = 0;
                lightManager.reset();
            }
            lightManager.dim();
            activePin = pin;
            controls.move( pin.cameraPosition, pin.position );
            pin.enable();

            // controls.threeControls.autoRotate = true;
            pointLight.position.set( pin.position.x, pin.position.y+2, pin.position.z );
            pointLight.target.position.copy( pin.position );
            // pointLight.target.position.set( pin.position.x, pin.position.y, pin.position.z );
            pointLight.intensity = Config.spotlight.intensity;
            pointLight.target.updateMatrixWorld();
            if(pointLight.userData.helper) pointLight.userData.helper.update();
        };
    
        this.update = function( delta, camera, collisionGroup ) {
            pins.forEach((pin) => {
                pin.update(camera, collisionGroup);
            });
        };
    
    }

}