import * as THREE from 'three';
import $ from "jquery";
import TWEEN from '@tweenjs/tween.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import { icon } from '@fortawesome/fontawesome-svg-core'
import { faRedoAlt, faSkullCrossbones, faBiohazard, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'


import Controls from './classes/controls';
import Renderer from './classes/renderer';
import Camera from './classes/camera';
import LightManager from './classes/lightManager';
import dat from "dat.gui";

import Config from './../data/config';
import Models from './utils/models';

import T_205_diffuse from "../textures/pattern_205/diffuse.jpg";
import T_205_normal from "../textures/pattern_205/normal.jpg";
import T_205_specular from "../textures/pattern_205/specular.jpg";

import T_207_diffuse from "../textures/pattern_207/diffuse.jpg";
import T_207_normal from "../textures/pattern_207/normal.jpg";
import T_207_specular from "../textures/pattern_207/specular.jpg";

import S_breaker from "../media/131599__modulationstation__kill-switch-large-breaker-switch.ogg";
import S_zombi from "../media/326261__isaria__zombie-purr-2.wav";

import { BloomEffect, VignetteEffect, BokehEffect, RealisticBokehEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";


export default function () {
    
    const container = document.body;
	const clock = new THREE.Clock();
    let delta = 0;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(Config.scene.background);
	scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    const renderer = new Renderer(container);
	const camera = new Camera(renderer.threeRenderer);
	// const controls = new Controls(camera.threeCamera, renderer.threeRenderer.domElement);
    // controls.threeControls.update();
    
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

    const button = document.createElement("button");
    // button.innerHTML = "come at me";
    button.innerHTML = icon(faSkullCrossbones, { classes: ["mr-2", "text-white"] }).html + "come at me";
    button.style.textShadow = "0 0 8px white";
    button.className = "btn btn-danger";

    const button2 = document.createElement("button");
    button2.innerHTML = icon(faRedoAlt, { classes: ["mr-2", "text-danger"] }).html + "rewind";
    button2.style.textShadow = "0 0 8px black";
    button2.className = "btn btn-light ml-1";
    // $(button2).fadeOut(10);
    $(button2).hide();

    const div = document.createElement("div");
    div.className = "d-flex justify-content-center align-items-center position-absolute fixed-bottom mb-5";
    div.appendChild(button);
    div.appendChild(button2);
    container.appendChild(div);
  
	const lightManager = new LightManager(scene);
	// Create and place lights in scene
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

    const tray = document.createElement("button");
    tray.className = "btn btn-black position-absolute fixed-bottom ml-2 mb-2";
    const vol = icon(faVolumeUp, { classes: ["text-secondary"] }).html;
    tray.innerHTML = vol;
    const mute = icon(faVolumeMute, { classes: ["text-secondary"] }).html;
    container.appendChild(tray);
    tray.onclick = function() { 
        const mvol = parseInt( listener.getMasterVolume() );
        if(this.toggle) { 
            this.toggle = false;
            listener.setMasterVolume(1); 
            tray.innerHTML = vol;
        } else { 
            this.toggle = true;
            listener.setMasterVolume(0); 
            tray.innerHTML = mute;
        }
    }

    // Models(scene);


	// GUI
    // const gui = new dat.GUI();
    // END GUI

    const textureloader = new THREE.TextureLoader();

    const width = 4;
    const height = 2.5;
    const depth = 8;
    const thickness = 0.2;

    const geometryFloor = new THREE.BoxGeometry(width,thickness,depth);
    const geometryWall = new THREE.BoxGeometry(thickness,height,depth);
    geometryWall.applyMatrix(new THREE.Matrix4().makeTranslation(width/2, height/2, 0));
    const material = new THREE.MeshPhysicalMaterial({
        color:0xFFFFFF,
        map: textureloader.load(T_205_diffuse),
        normalMap: textureloader.load(T_205_normal),
        metalnessMap: textureloader.load(T_205_specular),
        roughness: 0.4
    });

    material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
    material.map.repeat.set( 1, 1 );
    material.map.anisotropy = 16;
    material.normalMap.anisotropy = 16;
    // geometry.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI / 2 ) );
    geometryFloor.merge(geometryWall, geometryWall.matrix);
    const geo2 = geometryFloor.clone();
    geo2.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI ));
    geo2.applyMatrix(new THREE.Matrix4().makeTranslation(0, height, 0));
    geometryFloor.merge(geo2, geo2.matrix);
    // const geometry = geometryFloor.merge(geometryWall, geometryWall.matrix);
    const tunnel = new THREE.Mesh(geometryFloor, material);
    // scene.add(tunnel);
    const lamp = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1,0.05,0.1),
        new THREE.MeshPhongMaterial({color:0xFFFFAA, emissive:0x666633})
        );
    lamp.position.set(0,height-thickness+0.1,0);
    // scene.add(lamp);
    // lamp.add( positionalAudio );
    // positionalAudio.position.copy(lamp.position);

    RectAreaLightUniformsLib.init();

    const rectLight = new THREE.RectAreaLight( 0xFFFFAA, 8, 2, 0.5 );
    rectLight.position.set( 0, height-thickness+0.01, 0 );
    rectLight.rotation.set( -Math.PI / 2,0, 0);
    // scene.add( rectLight );

    // var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.DoubleSide } ) );
    // rectLightMesh.scale.x = rectLight.width;
    // rectLightMesh.scale.y = rectLight.height;
    // rectLight.add( rectLightMesh );

    const block = new THREE.Object3D();
    block.add( tunnel );
    block.add( rectLight );
    block.userData.lamp = lamp;
    block.userData.light = rectLight;
    block.add( lamp );
    // scene.add( block);

    function Player( tunneblocks ) {
        const clock = new THREE.Clock();
        let time = 0;
        let current = undefined;
        let blocks = tunneblocks.slice(0);
        // blocks.forEach(block => block.children[2].material.emissive.setHex(0x111111));
        let run = false;
        let toggle = true;
        this.reverse = function() {
            toggle = !toggle;
            this.reset();
            // this.play();
        }
        this.play = function() {
            // this.reset();
            if( blocks.length > 0 ) {
                run = true;
                $(button).fadeOut();
                $(button2).fadeOut();
            }
        }
        
        this.reset = function() {
            // licht an
            blocks = tunneblocks.slice(0);
            // run = true;
            // tunneblocks.forEach(block => {
            //     block.children[1].intensity = 8;
            //     block.children[2].material.emissive.setHex(0x666633)
            // });
        }

        this.on = function(block) {
            current.children[3].play();
            current.children[2].material.emissive.setHex(0x666633);
            current.children[1].intensity = 8;
        }

        this.off = function(block) {
            current.children[3].play();
            current.children[2].material.emissive.setHex(0x050505);
            current.children[1].intensity = 0;
        }
        
        this.update = function() {
            time += clock.getDelta();
            if( run && blocks.length > 0 ) {
                if(time > 1) {
                    current = blocks.pop();
                    time = 0;
                    // positionalAudio.position.copy(current.position);
                    // positionalAudio.stop();
                    // positionalAudio.play();
                    if(toggle) {
                        this.off(current);
                    } else {
                        this.on(current);
                    }
                    // this.on(current);
                    if(blocks.length === 0) {
                        const self = this;
                        run = false;
                        if( toggle ) {
                            setTimeout( () => { current.children[4].play(); }, 500);
                            setTimeout( () => { $(button2).fadeIn(); }, 6000);
                        } else {
                            this.reverse();
                            $(button).fadeIn();
                        }
                        // current.children[4].play();
                    }
                    // current.userData.lamp.material.emissive.setHex(0x666633);
                    // current.userData.lamp.materials[0].material.emissive.setHex(0x666633);
                }
            }
        }
    }
    
    const blocks = [];
    for(let i = 0; i<8; i++) {
        const copy = block.clone();
        copy.children[2].material = lamp.material.clone();
        copy.position.z = depth * i;
        blocks.push(copy);
        scene.add( copy );
    }

    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( S_breaker, function( buffer ) {
        blocks.forEach(block => {
            var positionalAudio = new THREE.PositionalAudio( listener );
            positionalAudio.setBuffer( buffer );
            positionalAudio.setRefDistance( 10 );
            block.add(positionalAudio);
        })
        // sound.play();
    });
    audioLoader.load( S_zombi, function( buffer ) {
        var positionalAudio = new THREE.PositionalAudio( listener );
        positionalAudio.setBuffer( buffer );
        positionalAudio.setRefDistance( 10 );
        blocks[0].add(positionalAudio);
        // sound.play();
    });

    
    const p = new Player(blocks);
    // gui.add( p, "play");
    // gui.add( p, "reset");

    button.onclick = () => {
        p.play();
    }

    button2.onclick = () => {
        p.reverse();
        p.play();
        // $(button).fadeOut();
        // $(button2).fadeOut();
    }

    // http://oos.moxiecode.com/js_webgl/grass_quads/
    var targetCamera = new THREE.Vector3(0, 2, 20);

    var mouseX = 0;
    var mouseY = 0;

    var mouseXpercent = 0;
    var mouseYpercent = 0;
    var upIsDown = false;
    var downIsDown = false;
    var leftIsDown = false;
    var rightIsDown = false;
    var camy = 1.7;
    var distance = -2;
    var angle = 0;
    var toangle = angle;
        
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // document.addEventListener( 'touchstart', onTouchStart, false );
    document.addEventListener( 'touchmove', onTouchMove, false );
    // document.addEventListener( 'touchend', onTouchEnd, false );

    // function onTouchStart(event) { 
    //     event.preventDefault();
    // }

    function onTouchMove(event) { 
        event.preventDefault();
        onDocumentMouseMove(event.touches[0]);
    }

    function onTouchEnd(event) { 
        event.preventDefault();
    }

    function onDocumentMouseMove(event) {
				
        var windowHalfX = window.innerWidth >> 1;
        var windowHalfY = window.innerHeight >> 1;

        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY );

        mouseXpercent = mouseX/(window.innerWidth/2);
        mouseYpercent = mouseY/(window.innerHeight/2);

    }
    
	function update(delta) {
        TWEEN.update();
        // controls.threeControls.update();
        p.update();

        if (upIsDown && camy < 1.5) {camy++};
        if (downIsDown && camy > 2.2) {camy--};

        if (leftIsDown && angle > -0.4) {angle-= 0.01};
        if (rightIsDown && angle < 0.4) {angle+= 0.01};
        toangle += (angle - toangle)/20;

        camera.threeCamera.position.x = Math.sin(toangle) * distance;
        camera.threeCamera.position.z = Math.cos(toangle) * distance;
        
        camera.threeCamera.position.y += (camy - camera.threeCamera.position.y) / 10;
        
        targetCamera.x += (-mouseXpercent * 5 - targetCamera.x) / 10;
        targetCamera.y += (-(mouseYpercent * 5) +1 - targetCamera.y) / 50;
        
        camera.threeCamera.lookAt(targetCamera);

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
