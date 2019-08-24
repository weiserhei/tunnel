// import TWEEN from '@tweenjs/tween.js';

// This object contains the state of the app
export default {
  maxAnisotropy: 0,
  dpr: 1,
  scene: {
    background: 0x070707
    // background: 0xffaa00
  },
  fog: {
    // color: 0xFFAAFF,
    color: 0x070707,
    near: 0.007,
  },
  camera: {
    fov: 40,
    near: 1,
    far: 500,
    aspect: 1,
    position: {
      x: 0,
      y: 1.7,
      z: -5
    }
  },
  postprocessing: {
    focalLength: 40,
    focus: 8,
    darkness: 0.4,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.2
  },
  block: {
    count: 4,
    depth: 8,
    width: 4,
    height: 2.4,
    thickness: 0.2
  },
  rectLight: {
    mesh: {
      width: 1.5,
      height: 0.04,
      depth: 0.2,
      color: 0x888822,
      emissive: 0x666633,
      offEmissive: 0x020202
    },
    position: {
      x: 0,
      z: -2
    },
    color: 0xFFFFAA,
    intensity: 18,
    width: 2,
    height: 0.2
  },
  turnLight: {
    // color: 0xff5500,
    color: 0xff4400,
    intensity: 0.9,
    distance: 7,
    angle: Math.PI/2.5,
    exponent: 1,
    decay: 1.5,
    material: {
      offEmissive: 0x050500,
      emissive: 0xFF8800
      // emissive: 0xff3300
    },
    position: {
      x: 0,
      z: 1
    },
  },
  hemiLight: {
    hColor: 0.0,
    sColor: 0,
    lColor: 1,
    groundHColor: 0.4,
    groundSColor: 1,
    groundLColor: 0.5,
    intensity: 0.06,
    x: 0,
    y: -1, // light direction top->down
    z: 0,
  },
  controls: {
    autoRotate: false,
    autoRotateSpeed: -0.1,
    rotateSpeed: 0.1,
    enableDamping: true,
    dampingFactor: 0.15,
    enableZoom: true,
    zoomSpeed: 1.8,
    minDistance: 2,
    maxDistance: 3,
    minPolarAngle: Math.PI / 2.5,
    maxPolarAngle: Math.PI / 1.8,
    minAzimuthAngle: -Math.PI,
    maxAzimuthAngle: Math.PI,
    enablePan: false,
    target: {
      x: 0,
      y: 2,
      z: 15,
    },
  },
  ambientLight: {
    enabled: false,
    color: 0x555555,
  },
  shadow: {
    enabled: false,
    helperEnabled: false,
    bias: -0.0001,
    mapWidth: 4096,
    mapHeight: 4096,
    near: 40,
    far: 70,
    top: 50,
    right: 50,
    bottom: -50,
    left: -50,
  },
  directionalLight: {
    castShadow: false,
    colorH: 0.1,
    colorS: 0.8,
    colorL: 0.9,
    intensity: 0.2,
    x: 0,
    y: 0,
    z: -1,
    multiplyScalarPosition: 10,
  },
};
