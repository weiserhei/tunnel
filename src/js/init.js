import * as THREE from 'three';
// import TWEEN from '@tweenjs/tween.js';
import $ from "jquery";
import Controls from './classes/controls';
import Renderer from './classes/renderer';
import Camera from './classes/camera';
import InteractionController from './classes/interactionController';
import LightManager from './classes/lightManager';
import Player from './classes/player';
import Block from './classes/block';
// import dat from "dat.gui";

import Config from './../data/config';
import { 
    faRedoAlt,
    faSkullCrossbones,
    faBiohazard,
    faExpandArrowsAlt,
    faExpand
} from '@fortawesome/free-solid-svg-icons';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
library.add(faExpandArrowsAlt);

import S_breaker from "../media/131599__modulationstation__kill-switch-large-breaker-switch.ogg";
import S_zombi from "../media/326261__isaria__zombie-purr-2.wav";

import { 
    BloomEffect,
    VignetteEffect,
    BokehEffect,
    RealisticBokehEffect,
    EffectComposer,
    EffectPass,
    RenderPass
} from "postprocessing";


export default function () {
    
    const container = document.body;
	const clock = new THREE.Clock();
    let delta = 0;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(Config.scene.background);
	scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    const renderer = new Renderer(container);
	const camera = new Camera(renderer.threeRenderer);
	const controls = new Controls(camera.threeCamera, renderer.threeRenderer.domElement);
    
    const composer = new EffectComposer(renderer.threeRenderer);

    // const effectPass = new EffectPass(camera.threeCamera, new BloomEffect());
    // const effectPass = new EffectPass(camera.threeCamera, new RealisticBokehEffect( {dof:0.1, focus: 0.9} ));
    const effectPass2 = new EffectPass(camera.threeCamera, new RealisticBokehEffect( {focalLength:8, focus: 1.6} ));
    effectPass2.renderToScreen = true;
    const effectPass = new EffectPass(camera.threeCamera, new VignetteEffect({darkness:0.5}));
    // effectPass.renderToScreen = true;

    composer.addPass(new RenderPass(scene, camera.threeCamera));
    composer.addPass(effectPass);
    composer.addPass(effectPass2);
  
	const lightManager = new LightManager(scene);
    const lights = [
        // "directional",
        "hemi"
    ];
	lights.forEach((light) => lightManager.place(light));

	var gridHelper = new THREE.GridHelper( 10, 10 );
	scene.add( gridHelper );
    
    var listener = new THREE.AudioListener();
    camera.threeCamera.add( listener );
    // var sound = new THREE.Audio( listener );
    

    const button = document.createElement("button");
    button.innerHTML = icon(faSkullCrossbones, { classes: ["mr-2", "text-white"] }).html + "come at me";
    button.style.textShadow = "0 0 8px white";
    button.className = "btn btn-danger";

    const button2 = document.createElement("button");
    button2.innerHTML = icon(faRedoAlt, { classes: ["mr-2", "text-danger"] }).html + "rewind";
    button2.style.textShadow = "0 0 8px white";
    button2.className = "btn btn-dark ml-1";
    $(button2).hide();

    const div = document.createElement("div");
    div.className = "d-flex justify-content-center align-items-center position-absolute fixed-bottom mb-5";
    div.appendChild(button);
    div.appendChild(button2);
    container.appendChild(div);

    const iC = new InteractionController(container, listener);

	// GUI
    // const gui = new dat.GUI();
    // END GUI
    const depth = 8;
    const block = new Block(depth);

    const blocks = [];
    for(let i = 0; i<6; i++) {
        const copy = block.clone();
        copy.children[2].material = block.children[2].material.clone();
        copy.position.z = depth * i;
        blocks.push(copy);
        scene.add( copy );
    }

    const player = new Player(blocks, button, button2);
    // gui.add( p, "play");
    // gui.add( p, "reset");

    button.onclick = () => {
        player.play();
    }

    button2.onclick = () => {
        player.reverse();
        player.play();
        // $(button).fadeOut();
        // $(button2).fadeOut();
    }

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( S_breaker, function( buffer ) {
        blocks.forEach(block => {
            const positionalAudio = new THREE.PositionalAudio( listener );
            positionalAudio.setBuffer( buffer );
            positionalAudio.setRefDistance( 10 );
            block.add(positionalAudio);
        })
        // sound.play();
    });
    audioLoader.load( S_zombi, function( buffer ) {
        const positionalAudio = new THREE.PositionalAudio( listener );
        positionalAudio.setBuffer( buffer );
        positionalAudio.setRefDistance( 10 );
        blocks[0].add(positionalAudio);
        // sound.play();
    });
    
	function update(delta) {
        // TWEEN.update();
        // controls.threeControls.update();
        player.update();
        controls.update();
	}

	const animate = function animate() {
		requestAnimationFrame(animate);
		delta = clock.getDelta();
        update(delta);
        composer.render(delta);
		// renderer.render(scene, camera.threeCamera);
	};

	animate();
}
