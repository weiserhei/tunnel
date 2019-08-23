import {
    AudioLoader,
    AudioListener,
    PositionalAudio,
    Scene,
    Clock,
    Color,
    FogExp2,
} from 'three';
import { 
    BloomEffect,
    VignetteEffect,
    BokehEffect,
    RealisticBokehEffect,
    EffectComposer,
    EffectPass,
    RenderPass
} from "postprocessing";

import Controls from './classes/controls';
import Renderer from './classes/renderer';
import Camera from './classes/camera';
import InteractionController from './classes/interactionController';
import LightManager from './classes/lightManager';
import Block from './classes/block';

import Config from './../data/config';
import S_breaker from "../media/131599__modulationstation__kill-switch-large-breaker-switch.ogg";
import S_zombi from "../media/326261__isaria__zombie-purr-2.wav";
import S_alarm from "../media/435666__mirkosukovic__alarm-siren.wav";


export default function () {
    
    const container = document.body;
	const clock = new Clock();
    let delta = 0;

	const scene = new Scene();
	scene.background = new Color(Config.scene.background);
	scene.fog = new FogExp2(Config.fog.color, Config.fog.near);

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

    var listener = new AudioListener();
    camera.threeCamera.add( listener );
    // var sound = new THREE.Audio( listener );

    const url = new URL(window.location.href);
    const c = url.searchParams.get("lights") || 4;

    const blocks = [];
    for(let i = 0; i< c; i++) {
        const block = new Block(i, listener);
        blocks.push(block);
        scene.add(block.mesh);
    }
    
    const ic = new InteractionController(container, listener, blocks);

    const audioLoader = new AudioLoader();
    audioLoader.load( S_breaker, function( buffer ) {
        blocks.forEach(block => {
            const positionalAudio = new PositionalAudio( listener );
            positionalAudio.setBuffer( buffer );
            positionalAudio.setRefDistance( 8 );
            block.addSound(positionalAudio);
        })
    });
    audioLoader.load( S_zombi, function( buffer ) {
        const positionalAudio = new PositionalAudio( listener );
        positionalAudio.setBuffer( buffer );
        positionalAudio.setRefDistance( 8 );
        positionalAudio.setVolume( 4 );
        blocks[0].addBonusSound(positionalAudio);
    });
    audioLoader.load( S_alarm, function( buffer ) {
        blocks.forEach( (block, index) => {
            // every X blocks there is an alarm light
            if( index % 3 === 0) {
                const positionalAudio = new PositionalAudio( listener );
                positionalAudio.setBuffer( buffer );
                positionalAudio.setRefDistance( 4 );
                positionalAudio.setVolume( 0.2 );
                positionalAudio.setLoop( true );
                block.addBonusSound(positionalAudio);
            }
        });
    });
    
	function update(delta) {
        ic.update(delta);
        controls.update();
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
