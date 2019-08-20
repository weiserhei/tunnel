import './../css/style.css';
// import "./../scss/main.scss";

import { WEBGL } from 'three/examples/jsm/WebGL.js';
import init from './init';

if (WEBGL.isWebGLAvailable()) {
    init();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
