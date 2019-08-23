import {
    HemisphereLight,
    DirectionalLight,
    CameraHelper,
    SpotLight,
    SpotLightHelper,
    PointLight,
    PointLightHelper
  } from 'three';

  import TWEEN from '@tweenjs/tween.js';
  
  import Config from '../../data/config';
  
  // Sets up and places all lights in scene
  export default class LightManager {
    constructor(scene, camera, sky) {
      this.scene = scene;
      this.camera = camera;
      this.init();
    }
  
    init() {
      // Ambient
      // this.ambientLight = new THREE.AmbientLight(Config.ambientLight.color);
      // this.ambientLight.visible = Config.ambientLight.enabled;
  
      // Point light
      // this.pointLight = new PointLight(
      //   Config.pointLight.color,
      //   Config.pointLight.intensity,
      //   Config.pointLight.distance
      // );
      // this.pointLight.position.set(Config.pointLight.x, Config.pointLight.y, Config.pointLight.z);
      // this.pointLight.visible = Config.pointLight.enabled;
      // this.pointLight.castShadow = false;

      // this.pointLight.shadow.mapSize.width = 2048;  // default
      // this.pointLight.shadow.mapSize.height = 2048; // default
      // this.pointLight.shadow.camera.near = 0.5;       // default
      // this.pointLight.shadow.camera.far = 50      // default

      // this.plhelper = new PointLightHelper( this.pointLight, 10 );
    //   this.scene.add(this.plhelper);
  
      // Hemisphere light
      // this.hemiLight = new THREE.HemisphereLight(
      //   Config.hemiLight.color,
      //   Config.hemiLight.groundColor,
      //   Config.hemiLight.intensity
      // );
      this.hemiLight = new HemisphereLight();
      this.hemiLight.intensity = Config.hemiLight.intensity;
      this.hemiLight.color.setHSL(
        Config.hemiLight.hColor,
        Config.hemiLight.sColor,
        Config.hemiLight.lColor
      );
      this.hemiLight.groundColor.setHSL(
        Config.hemiLight.groundHColor,
        Config.hemiLight.groundSColor,
        Config.hemiLight.groundLColor
      );
      this.hemiLight.position.set(
        Config.hemiLight.x,
        Config.hemiLight.y,
        Config.hemiLight.z
      );

      // this.hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  
      // Directional light
      this.directionalLight = new DirectionalLight();
      this.directionalLight.intensity = Config.directionalLight.intensity;
      this.directionalLight.color.setHSL(
        Config.directionalLight.colorH,
        Config.directionalLight.colorS,
        Config.directionalLight.colorL
      );
  
      this.directionalLight.position.set(
        Config.directionalLight.x,
        Config.directionalLight.y,
        Config.directionalLight.z
      );
      this.directionalLight.position.multiplyScalar(Config.directionalLight.multiplyScalarPosition);
  
      // Shadow map
      this.directionalLight.castShadow = Config.directionalLight.castShadow;
      this.directionalLight.shadow.bias = Config.shadow.bias;
      this.directionalLight.shadow.camera.near = Config.shadow.near;
      this.directionalLight.shadow.camera.far = Config.shadow.far;
      this.directionalLight.shadow.camera.left = Config.shadow.left;
      this.directionalLight.shadow.camera.right = Config.shadow.right;
      this.directionalLight.shadow.camera.top = Config.shadow.top;
      this.directionalLight.shadow.camera.bottom = Config.shadow.bottom;
      this.directionalLight.shadow.mapSize.width = Config.shadow.mapWidth;
      this.directionalLight.shadow.mapSize.height = Config.shadow.mapHeight;
  
      // Shadow camera helper
      this.directionalLightHelper = new CameraHelper(this.directionalLight.shadow.camera);
      this.directionalLightHelper.visible = Config.shadow.helperEnabled;
  
      // move light wih camera
      // this.camera.add(this.directionalLight);
    }
  
    // update( camera ) {
    // this.pointLight.position.x = 110 * Math.cos( performance.now() / 1000 /1.5 ) + 0;
    // this.pointLight.position.y = 110 * Math.sin( performance.now() / 1000 /1.5 ) + 0;
    // this.spotlight.position.set(camera.position.x, camera.position.y, camera.position.z);
    // }
  
    place(lightName) {
      switch (lightName) {
        case 'ambient':
          this.scene.add(this.ambientLight);
          break;
  
        case 'spot':
          this.scene.add(this.spotlight);
          this.scene.add(this.spotlight.target);
          this.scene.add(this.spotLightHelper);
          break;
  
        case 'directional':
          this.scene.add( this.directionalLight);
          this.scene.add( this.directionalLightHelper);

          // this.scene.add(this.camera);
          // this.camera.add(this.directionalLight);
          // this.camera.add(this.directionalLightHelper);
          break;
  
        case 'point':
          this.scene.add(this.pointLight);
          break;
  
        case 'hemi':
          this.scene.add(this.hemiLight);
          break;
        default:
      }
    }
  }  