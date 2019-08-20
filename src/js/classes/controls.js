import TWEEN from '@tweenjs/tween.js';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Config from './../../data/config';
// import { createNoisyEasing, createStepEasing } from "./../utils/easings";
// var customTween = createStepEasing(3, TWEEN.Easing.Exponential.InOut);

// Controls based on orbit controls
export default class Controls {
  constructor(camera, container) {
    const controls = new OrbitControls(camera, container);
    this.threeControls = controls;
    this.camera = camera;
    const cc = Config.controls;

    controls.target.set(cc.target.x, cc.target.y, cc.target.z);
    controls.autoRotate = cc.autoRotate;
    controls.autoRotateSpeed = cc.autoRotateSpeed;
    controls.rotateSpeed = cc.rotateSpeed;
    controls.zoomSpeed = cc.zoomSpeed;
    controls.minDistance = cc.minDistance;
    controls.maxDistance = cc.maxDistance;
    controls.minPolarAngle = cc.minPolarAngle;
    controls.maxPolarAngle = cc.maxPolarAngle;
    controls.minAzimuthAngle = cc.minAzimuthAngle;
    controls.maxAzimuthAngle = cc.maxAzimuthAngle;
    controls.enableDamping = cc.enableDamping;
    controls.enableZoom = cc.enableZoom;
    controls.dampingFactor = cc.dampingFactor;
    controls.enablePan = cc.enablePan;

    this.move = function move(position, target, callback) {

      new TWEEN.Tween(this.camera.position)
        .to(position, 1000)
        // .easing( TWEEN.Easing.Circular.Out )
        // .easing( TWEEN.Easing.Circular.InOut )
        .easing( TWEEN.Easing.Cubic.InOut )
        // .easing( TWEEN.Easing.Quintic.InOut )
        .onStart(() => { 
          new TWEEN.Tween(this.threeControls.target).to( target || Config.controls.target, 1000)
          .easing( TWEEN.Easing.Cubic.InOut )
          .onComplete(()=>{ 
            // fix to poi jitters when moving the camera after onComplete
            this.threeControls.target.z += 0.01; 
          })
          .start();
          this.enabled = false; 
        })
        .onComplete(() => {
          this.enabled = true;
          if (callback !== undefined) {
            callback();
          }
        })
        .start();
    };

    function handleMouseMove() {
      document.body.style.cursor = 'grabbing';
    }

    function onMouseUp() {
      container.removeEventListener('mousemove', handleMouseMove, false);
      document.body.style.cursor = 'default';
    }

    container.addEventListener('mousedown', ()=>{
      container.addEventListener('mousemove', handleMouseMove, false);
      container.addEventListener('mouseup', onMouseUp, false);
      container.addEventListener('mouseout', onMouseUp, false);
    }, false);
  }

  reset() {
    this.threeControls.reset();
    const cc = Config.controls;
    this.threeControls.target = new Vector3(cc.target.x, cc.target.y, cc.target.z);
  }

  set enabled(value) {
    this.threeControls.enabled = value;
    this.threeControls.enableZoom = value;
    this.threeControls.enableRotate = value;
  }
}
