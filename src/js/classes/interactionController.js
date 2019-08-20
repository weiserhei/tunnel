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
import PinController from "./pinController";
import Pointlight from '../components/pointLight';
import PoiLight from '../components/poiLight';
import Config from './../../data/config';

import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faExpand, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'
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

// if (document.addEventListener)
// {
//     document.addEventListener('webkitfullscreenchange', fsChangeHandler, false);
//     document.addEventListener('mozfullscreenchange', fsChangeHandler, false);
//     document.addEventListener('fullscreenchange', fsChangeHandler, false);
//     document.addEventListener('MSFullscreenChange', fsChangeHandler, false);
// }
// function fsChangeHandler()
// {
//     if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== undefined) {
//         /* Run code when going to fs mode */
//     } else {
//         /* Run code when going back from fs mode */
//     }
// }

export default class InteractionController {

    constructor(container, rendererDomElement, controls, lightManager, panel, scene, camera) {

        // const pointLight = new Pointlight();
        const poilight = new PoiLight();
        scene.add( poilight );
        scene.add( poilight.target );

        
        if( Config.spotlight.helperEnabled ) {
            const plhelper = new SpotLightHelper( poilight );
            scene.add(plhelper);
            poilight.userData.helper = plhelper;
        }

        this.pinController = new PinController(container, controls, lightManager, poilight);
        this.collisionGroup = undefined;
        this.controller2 = undefined; //wireframe
        this.currentModel = undefined;
        // this.folderGenereal = datGUI.addFolder("General");

        const fullIcon = icon(faExpandArrowsAlt, { transform: { x:0 }, classes: ["text-dark", "fa-lg"] }).node[0];
        const button = document.createElement("button");
        button.className = "btn btn-dark position-absolute mb-2 mr-2 float-right bg-transparent border border-light";
        button.style.right = 0;
        button.style.bottom = 0;
        button.appendChild(fullIcon);
        container.appendChild(button);
        button.onclick = openFullscreen.bind(rendererDomElement);

        this.cPos = panel.addSubGroup({label:"Camera Position", enable: false});
        this.cPos.addNumberOutput(camera.position, "x");
        this.cPos.addNumberOutput(camera.position, "y");
        this.cPos.addNumberOutput(camera.position, "z");
        this.panelGeneral = panel.addSubGroup({label:"Camera Target", enable: false});
        this.panelGeneral.addNumberOutput(controls.threeControls.target, "x");
        this.panelGeneral.addNumberOutput(controls.threeControls.target, "y");
        this.panelGeneral.addNumberOutput(controls.threeControls.target, "z");
        
        this.changeModel = function ( gltf, modelDefinition, collisionGroup ) {
            // controls.reset();
            if( this.collisionGroup !== undefined ) {
                this.collisionGroup.forEach(object => {
                    object.geometry.dispose();
                    object.material.dispose();
                    scene.remove( object );
                });
            }
            this.collisionGroup = collisionGroup;
            const c = modelDefinition.model.camera;
            const cameraPosition = new Vector3(c.position.x, c.position.y, c.position.z);
            const target = new Vector3(c.target.x, c.target.y, c.target.z);
            controls.move(cameraPosition, target);

            this.addWireframe(gltf.scene);
            this.pinController.destroyPins();
            this.pinController.createPins(modelDefinition.pois);
            // this.pinController.setActive(this.pinController.getPins()[1]);
            // lightManager.dim();
            
            if(this.currentModel != undefined) {
                this.currentModel.scene.visible = false;
            }
            this.currentModel = gltf;
        }

        const raycaster = new Raycaster();
        const vector = new Vector2();

        // const folderTracking = datGUI.addFolder('Raycasting');
        const indicator = new Mesh( new SphereBufferGeometry(0.2, 16, 8), new MeshNormalMaterial({wireframe:true}) );
        indicator.visible = false;
        scene.add(indicator);
        const obj = { 
            toggle: false,
            add:function(){ 
                this.toggle = !this.toggle;
                if(this.toggle) {
                    indicator.visible = true;
                    rendererDomElement.addEventListener('mousedown', onDocumentMouseDown, false);
                    rendererDomElement.addEventListener('mouseup', crosshair, false);
                    document.body.style.cursor = "crosshair";
                } else {
                    rendererDomElement.removeEventListener('mousedown', onDocumentMouseDown, false);
                    rendererDomElement.removeEventListener('mouseup', crosshair, false);
                    document.body.style.cursor = "default";
                }
            },
        };

        function crosshair() {
            document.body.style.cursor = "crosshair";
        }


        let rg = panel.addSubGroup({label:"Raytracing", enable: false});
        rg.addCheckbox(obj, "toggle", {label: "Activate", onChange: obj.add});
        rg.addCheckbox(indicator, "visible", {label: "Indicator visible"});
        rg.addNumberOutput(indicator.position, "x");
        rg.addNumberOutput(indicator.position, "y");
        rg.addNumberOutput(indicator.position, "z");
        // rg.addStringOutput(indicator.getWorldPosition);
        // folderTracking.add(obj, 'toggle').name("Activate").onChange(obj.add);
        // folderTracking.add(indicator, "visible").name("Indicator visible").listen();
        // folderTracking.add(indicator.position, "x").step(0.001).listen();
        // folderTracking.add(indicator.position, "y").step(0.001).listen();
        // folderTracking.add(indicator.position, "z").step(0.001).listen();

        function onDocumentMouseDown( event ) {
            vector.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1 );
            raycaster.setFromCamera( vector, camera );  
            const intersects = raycaster.intersectObjects( scene.children, true );
            if ( intersects.length > 0 ) {
                let position = intersects[ 0 ].point;
                indicator.position.copy(position);
            }
        }

    }
    
    addWireframe( gltf ) {
        const obj = { 
            toggle: false,
            add:function(){ 
                this.toggle = !this.toggle;
                gltf.traverse( (child) => {
                    if ( child.isMesh ) {
                        child.material.wireframe = this.toggle;
                    }
                } );
        }};

        if(this.controller2 != undefined) {
            this.folderGenereal.remove(this.controller2);
        }
        
        this.panelGeneral.addCheckbox(obj, "add", {label:"Wireframe", onChange: obj.add});
        // rg.addCheckbox(obj, "toggle", {label: "Activate", onChange: obj.add});
        // this.controller2 = this.folderGenereal.add(obj,'toggle').name("Wireframe").onChange(obj.add);

    }

    update ( delta, camera ) {
        this.pinController.update(delta, camera, this.collisionGroup);
    }

}