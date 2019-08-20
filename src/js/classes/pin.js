import './../../css/pin.css';
import * as $ from "jquery";
import { Vector3, Raycaster } from 'three';
import Overlay from "./overlay";

import { library, icon, findIconDefinition  } from '@fortawesome/fontawesome-svg-core'
import { faDotCircle, faExclamationCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
// add all the icons that are used in this application
library.add(faDotCircle, faExclamationCircle, faQuestionCircle);

export default class Pin {
    constructor(poi, parentDomNode, controller) {
        this.position = new Vector3(poi.position.x, poi.position.y, poi.position.z);
        this.cameraPosition = new Vector3(poi.cameraposition.x, poi.cameraposition.y, poi.cameraposition.z)
        
        let occluded = true;
        let active = true;
        const roemerhausrot = "#C70020";
        const screenVector = new Vector3();
        const container = document.createElement("div");
        container.className = "position-absolute pinContainer";
        // this.container.className = "position-absolute pb-4 pinContainer";

        const raycaster = new Raycaster();
        const vector = new Vector3();

        const overlay = new Overlay( poi.name, poi.description, controller );
        parentDomNode.appendChild(overlay.domElement);

        const pinIcon = icon(
            findIconDefinition({ iconName: poi.icon }) || faDotCircle, 
            { 
                transform: { x: 0, y: 13 },
                // styles: { "color" : , "text-shadow":"0 0 6px #ffaa00" },
                // https://github.com/FortAwesome/Font-Awesome/issues/11916#issuecomment-377247309
                styles: { "color" : "#fff", "filter":"drop-shadow(0px 0px 5px rgba(0,0,0,1))" },
                // styles: { "color" : roemerhausrot, "filter":"drop-shadow(1px 1px 5px "+roemerhausrot+")"},
                classes: ["position-absolute", "fixed-bottom", "text-light"] 
            }).html;

        let textBox = document.createElement('button');
        // textBox.className = 'ml-2 mt-n2 text-uppercase badge badge-light';
        textBox.className = 'ml-3 mt-n4 text-uppercase font-weight-bold btn btn-dark btn-sm bg-transparent border border-light';
        // textBox.style.backgroundColor = roemerhausrot;
        textBox.style.textShadow = '0 0 6px #000';
        // textBox.innerHTML = "<a href='#' class='text-white border-bottom text-decoration-none'>"+poi.name+"</a>";
        // textBox.innerHTML = "<a href='#' class='text-decoration-none'>"+poi.name+"</a>";
        textBox.innerHTML = poi.name;

        textBox.onclick = () => {
            controller.setActive(this);
        };

        container.innerHTML = pinIcon;
        container.appendChild(textBox);
        parentDomNode.appendChild(container);

        this.destroy = function() {
            parentDomNode.removeChild(container);
            parentDomNode.removeChild(overlay.domElement);
        }

        // enable/disable is called by the pin-controller
        this.enable = function() {
            active = false;
            container.style.visibility = 'hidden';
            $(overlay.domElement).delay(400).fadeIn(600);
        }
        this.disable = function() {
            active = true;
            overlay.domElement.style.display = "none";
            container.style.visibility = 'visible';
        }

        this.update = function(camera, collisionGroup) {
            
            const dir = vector.subVectors( this.position, camera.position ).normalize();
            raycaster.set( camera.position, dir );
            const intersects = raycaster.intersectObjects( collisionGroup, false );

            if(intersects.length > 0) {
                const d1 = camera.position.distanceTo( this.position );
                const d2 = camera.position.distanceTo( intersects[0].point );
                if( d1 > d2 ) {
                    occluded = true;
                    $(container).fadeOut(200);
                } else if( occluded ) {
                    occluded = false;
                    $(container).fadeIn(200);
                }
            } else if( occluded ) {
                occluded = false;
                $(container).fadeIn(200);
            }
            
            // pin is visible, copy position
            if (active && !occluded) {
                // screenVector.set(0, 0, 0);
                // followMesh.localToWorld(screenVector);
                screenVector.copy(this.position).project(camera);

                const posx = Math.round((screenVector.x + 1) * parentDomNode.offsetWidth / 2);
                const posy = Math.round((1 - screenVector.y) * parentDomNode.offsetHeight / 2);
                //   const posx = Math.round((this.screenVector.x + 1) * this.parentDomNode.clientWidth / 2);
                //   const posy = Math.round((1 - this.screenVector.y) * this.parentDomNode.clientHeight / 2);

                const boundingRect = container.getBoundingClientRect();
                const left = (posx - boundingRect.width + boundingRect.width);
                const top = (posy - boundingRect.height);
                //   this.box.style.left = (posx - boundingRect.width + boundingRect.width / 2) + 'px';
                //   this.box.style.top = (posy - boundingRect.height * 1.3) + 'px';
                // https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
                container.style.transform = 'translate(' + Math.floor(left) + 'px, ' + Math.floor(top) + 'px)';
            }

        }

  }

}
