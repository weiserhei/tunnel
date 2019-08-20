import { LoadingManager, TextureLoader } from 'three';
// import './../../scss/loader.scss';
import './../../css/loader.css';
import * as $ from "jquery";

// https://codepen.io/ZyrianovViacheslav/pen/wWVrLQ

export default class Loader {
  constructor(container) {
    this.manager = new LoadingManager();
    this.textureLoader = new TextureLoader(this.manager);

    const innerContainer = document.createElement('div');
    innerContainer.className = 'loader-wrap';
    // start hidden, set visible in manager.onStart
    innerContainer.style.display = 'none';
    container.appendChild(innerContainer);
    innerContainer.innerHTML = `
    <div class="loader"><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span><span class="loader-item"></span></div>
    `;

    this.manager.onStart = () => {
      // make visible if hidden with fadeOut()
      innerContainer.style.display = '';
    };

    this.manager.onProgress = (item, loaded, total) => {
      console.log( item, loaded, total );
    };

    this.manager.onLoad = () => {
      $(innerContainer).delay(200).fadeOut(800);
    };

    this.manager.onError = (url) => {
      console.error('Loading Error', url);
    };
  }
}
