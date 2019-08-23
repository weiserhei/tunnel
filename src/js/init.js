import * as THREE from 'three';
// import TWEEN from '@tweenjs/tween.js';
import Controls from './classes/controls';
import Renderer from './classes/renderer';
import Camera from './classes/camera';
import InteractionController from './classes/interactionController';
import LightManager from './classes/lightManager';
import Block from './classes/block';

import Config from './../data/config';

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
	const controls = new Controls(camera.threeCamera, renderer.threeRenderer.domElement, scene);

    const composer = new EffectComposer(renderer.threeRenderer);
    // const effectPass = new EffectPass(camera.threeCamera, new RealisticBokehEffect( {dof:0.1, focus: 0.9} ));
    const effectPass2 = new EffectPass(camera.threeCamera, new RealisticBokehEffect( {focalLength:70, focus: 10} ));
    effectPass2.renderToScreen = true;
    const effectPass = new EffectPass(camera.threeCamera, new VignetteEffect({darkness:0.4}));
    // effectPass.renderToScreen = true;
    const effectPass3 = new EffectPass(camera.threeCamera, new BloomEffect({ luminanceThreshold: 0.1, luminanceSmoothing: 0.2 }));

    composer.addPass(new RenderPass(scene, camera.threeCamera));
    composer.addPass(effectPass);
    composer.addPass(effectPass3);
    composer.addPass(effectPass2);
  
	const lightManager = new LightManager(scene);
    const lights = [
        // "directional",
        "hemi"
    ];
	lights.forEach((light) => lightManager.place(light));

    var listener = new THREE.AudioListener();
    camera.threeCamera.add( listener );
    // var sound = new THREE.Audio( listener );

    const url = new URL(window.location.href);
    const c = url.searchParams.get("lights") || 4;

    const blocks = [];
    for(let i = 0; i< c; i++) {
        const block = new Block(i);
        blocks.push(block);
        scene.add(block.mesh);
    }
    
    const ic = new InteractionController(container, listener, blocks);
      
	// GUI
    // const gui = new dat.GUI();
    // gui.add( ic, "play");
    // gui.add( ic, "reset");
    // END GUI
    // const gui = document.createElement("div");
    // gui.className = "position-absolute fixed-top card";
    // container.appendChild(gui);

    const zpos = 8;
    const ypos = 2.4;
    const xpos = 0;

    const x = new THREE.SpotLight(0xff4400, 1, 8, Math.PI/2.5, 1, 1 );
    scene.add( x );
    let counter = 0;
    x.userData.update = function(delta) {
        // x.rotateZ += 0.1;
        counter += delta * 4;
        x.target.position.z = zpos + Math.cos(counter);
        // x.target.position.y = ypos + Math.sin(counter);
        x.target.position.x = xpos + Math.sin(counter);
    }
    x.position.set(xpos, ypos-0.1, zpos);
    x.target.position.set(xpos,ypos-1,zpos);
    scene.add( x.target );

    const alarm = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 0.2, 0.1), new THREE.MeshPhongMaterial({ color:0x884400, emissive: 0xff8800 }) );
    alarm.onBeforeRender = () => {

    }
    scene.add( alarm);
    alarm.position.set(xpos, ypos, zpos);

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( S_breaker, function( buffer ) {
        blocks.forEach(block => {
            const positionalAudio = new THREE.PositionalAudio( listener );
            positionalAudio.setBuffer( buffer );
            positionalAudio.setRefDistance( 8 );
            block.addSound(positionalAudio);
        })
        // sound.play();
    });
    audioLoader.load( S_zombi, function( buffer ) {
        const positionalAudio = new THREE.PositionalAudio( listener );
        positionalAudio.setBuffer( buffer );
        positionalAudio.setRefDistance( 8 );
        positionalAudio.setVolume( 4 );
        blocks[0].addBonusSound(positionalAudio);
        // sound.play();
    });
    
	function update(delta) {
        // TWEEN.update();
        ic.update(delta);
        controls.update();
        x.userData.update(delta);
	}

	function animate() {
		requestAnimationFrame(animate);
		delta = clock.getDelta();
        update(delta);
        composer.render(delta);
		// renderer.render(scene, camera.threeCamera);
	};

	animate();
}
