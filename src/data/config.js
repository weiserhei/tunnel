// import TWEEN from '@tweenjs/tween.js';

// This object contains the state of the app
export default {
  maxAnisotropy: 0,
  dpr: 1,
  scene: {
    background: 0x070707
  },
  fog: {
    // color: 0xFFAA00,
    color: 0x070707,
    near: 0.018,
  },
  camera: {
    fov: 40,
    near: 1,
    far: 500,
    aspect: 1,
    // posX: 0,
    // posY: 20,
    // posZ: 30,
    position: {
      x: 0,
      y: 1.7,
      z: -4
    }
  },
  block: {
    depth: 8,
    width: 4,
    height: 2.5,
    thickness: 0.2
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
  sky: {
    size: 500,
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    sunPosition: {
      x: 10,
      y: -0.3,
      z: 10
    }
  },
  ambientLight: {
    enabled: false,
    color: 0x141414,
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
  spotlight: {
    // 0xCEECF5 orig //0x44ffaa mystic green 500, 4
    // color: 0xCEECF5, //moonlight
    // color: 0xAA7722, //white
    color: 0xFFEEDD, // yellow tint
    helperEnabled: false,
    castShadow: false,
    intensity: 1.5,
    distance: 50,
    angle: Math.PI / 5,
    penumbra: 0.5,
    decay: 2,
    x: 147,
    y: -179,
    z: -21,
    targetx: -74,
    targety: -12,
    targetz: 41,
  },
  pointLight: {
    color: 0xffaa00,
    intensity: 1,
    distance: 10,
    castShadow: false,
    helperEnabled: false,
    x: 0,
    y: 0,
    z: 0,
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
  directionalLight: {
    castShadow: false,
    colorH: 0.1,
    colorS: 0.8,
    colorL: 0.9,
    intensity: 0.6,
    x: -1,
    y: 5,
    z: 1,
    multiplyScalarPosition: 10,
    night: {
      // color: 0x8ebbff,
      color: 7391996,
      intensity: 0.5,
    },
  },
};
