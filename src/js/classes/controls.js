import { Vector3, SpotLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Config from './../../data/config';
// import { createNoisyEasing, createStepEasing } from "./../utils/easings";
// var customTween = createStepEasing(3, TWEEN.Easing.Exponential.InOut);

// Controls based on orbit controls
export default class Controls {
  constructor(camera, container, scene) {
    const cc = Config.controls;
    const controls = new OrbitControls(camera, container);
    this.threeControls = controls;
    this.camera = camera;
    // controls.target.set(cc.target.x, cc.target.y, cc.target.z);
    // controls.update();
    // controls.autoRotate = cc.autoRotate;
    // controls.autoRotateSpeed = cc.autoRotateSpeed;
    // controls.rotateSpeed = cc.rotateSpeed;
    // controls.zoomSpeed = cc.zoomSpeed;
    // controls.minDistance = cc.minDistance;
    // controls.maxDistance = cc.maxDistance;
    // controls.minPolarAngle = cc.minPolarAngle;
    // controls.maxPolarAngle = cc.maxPolarAngle;
    // controls.minAzimuthAngle = cc.minAzimuthAngle;
    // controls.maxAzimuthAngle = cc.maxAzimuthAngle;
    // controls.enableDamping = cc.enableDamping;
    // controls.enableZoom = cc.enableZoom;
    // controls.dampingFactor = cc.dampingFactor;
    // controls.enablePan = cc.enablePan;

    // http://oos.moxiecode.com/js_webgl/grass_quads/
    const targetCamera = new Vector3().copy(cc.target);
    let mouseX = 0;
    let mouseY = 0;
    let mouseXpercent = 0;
    let mouseYpercent = 0;

    var upIsDown = false;
    var downIsDown = false;
    var leftIsDown = false;
    var rightIsDown = false;

    let camy = Config.camera.position.y;
    let distance = Config.camera.position.z;
    let angle = 0;
    let toangle = angle;
        
    container.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // document.addEventListener( 'touchstart', onTouchStart, false );
    container.addEventListener( 'touchmove', onTouchMove, false );
    // document.addEventListener( 'touchend', onTouchEnd, false );

    // function onTouchStart(event) { 
    //     event.preventDefault();
    // }

    // scene.add( camera );


    function onTouchMove(event) { 
        event.preventDefault();
        onDocumentMouseMove(event.touches[0]);
    }

    function onTouchEnd(event) { 
        event.preventDefault();
    }

    function onDocumentMouseMove(event) {
				
        const windowHalfX = window.innerWidth >> 1;
        const windowHalfY = window.innerHeight >> 1;

        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY );

        mouseXpercent = mouseX/(window.innerWidth/2);
        mouseYpercent = mouseY/(window.innerHeight/2);

    }

    this.update = function( delta ) {
        // if (upIsDown && camy < 1.5) {camy++};
        // if (downIsDown && camy > 2.2) {camy--};

        // if (leftIsDown && angle > -0.4) {angle-= 0.01};
        // if (rightIsDown && angle < 0.4) {angle+= 0.01};
        // toangle += (angle - toangle)/20;

        camera.position.x = Math.sin(toangle) * distance;
        camera.position.z = Math.cos(toangle) * distance;
        
        // camera.position.y += (camy - camera.position.y) / 10;
        
        targetCamera.x += (-mouseXpercent * 5 - targetCamera.x) / 10;
        targetCamera.y += (-(mouseYpercent * 5) +1 - targetCamera.y) / 50;
        
        camera.lookAt(targetCamera);

    }

  }

}
