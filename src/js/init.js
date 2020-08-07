import {
    Audio,
    AudioLoader,
    AudioListener,
    PositionalAudio,
    Scene,
    Clock,
    Color,
    FogExp2,
    Vector2,
    Vector3,
    CatmullRomCurve3,
    BufferGeometry,
    LineBasicMaterial,
    Line,
    Mesh,
    BoxGeometry,
    PlaneBufferGeometry,
    MeshNormalMaterial,
    PlaneGeometry,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    TubeBufferGeometry,
} from 'three';
import { 
    BloomEffect,
    VignetteEffect,
    BokehEffect,
    RealisticBokehEffect,
    DepthOfFieldEffect,
    ChromaticAberrationEffect,
    EffectComposer,
    EffectPass,
    RenderPass
} from "postprocessing";
import Stats from 'stats.js';

import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";
import { Line2  } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial   } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry    } from 'three/examples/jsm/lines/LineGeometry.js';
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils.js';

import Controls from './classes/controls';
import Renderer from './classes/renderer';
import Camera from './classes/camera';
import InteractionController from './classes/interactionController';
import LightManager from './classes/lightManager';
import Block from './classes/block';
import Particles from './classes/particles';

import Config from './../data/config';
import S_breaker from "../media/131599__modulationstation__kill-switch-large-breaker-switch.ogg";
import S_zombi from "../media/326261__isaria__zombie-purr-2.wav";
import S_alarm from "../media/435666__mirkosukovic__alarm-siren.wav";
import S_ballast from "../media/53680__lonemonk__switch-and-ballast-2.ogg";
import S_explosion from "../media/80401__steveygos93__explosion2.ogg";

import TWEEN from "@tweenjs/tween.js";

export default function () {

    const container = document.body;
	const clock = new Clock();
    let delta = 0;
	const scene = new Scene();
	scene.background = new Color(Config.scene.background);
    scene.fog = new FogExp2(Config.fog.color, Config.fog.near);
    
    const stats = new Stats();
    container.appendChild( stats.dom );

    const renderer = new Renderer(container);
	const camera = new Camera(renderer.threeRenderer);
	const controls = new Controls(camera.threeCamera, renderer.threeRenderer.domElement, scene);

    const composer = new EffectComposer(renderer.threeRenderer);
    
    const bokeh = new RealisticBokehEffect( {
        // showFocus: true,
        luminanceGain: 2,
        luminanceThreshold: 0.2,
        // pentagon: true,
        // rings: 10,
        // samples: 4,
        // maxBlur: 1,
        fringe: 0,
        // bias: 1,
        focalLength:Config.postprocessing.focalLength, 
        focus: Config.postprocessing.focus
    } );
    const dof = new DepthOfFieldEffect( camera.threeCamera, {
            focalLength: 0.02,
            bokehScale: 1
            // focusDistance: 0.1
        } );


    // const x = new Mesh(new BoxGeometry(1, 1, 1));
    // x.position.set(0, 0, 15);
    // scene.add(x);
    const somePosition = new Vector3(0, 1, 3);
    // Auto focus on a specific target position. Set to null to disable.
    dof.target = somePosition;

    // Alternatively, calculate the focus distance and update the uniform once:
    // const focusDistance = dof.calculateFocusDistance(somePosition);
    // const cocMaterial = dof.circleOfConfusionMaterial;
    // cocMaterial.uniforms.focusDistance.value = focusDistance;

    const ca = new ChromaticAberrationEffect({ offset: new Vector2(Config.postprocessing.CAoffset, Config.postprocessing.CAoffset) });
        
    const vignette = new VignetteEffect({darkness:Config.postprocessing.darkness});
    const bloom = new BloomEffect({ luminanceThreshold: Config.postprocessing.luminanceThreshold, luminanceSmoothing: Config.postprocessing.luminanceSmoothing });
        
    // const effectPass = new EffectPass(camera.threeCamera, new RealisticBokehEffect( {dof:0.1, focus: 0.9} ));
    // const effectPass = new EffectPass(camera.threeCamera, vignette, bloom, bokeh);
    const effectPassV = new EffectPass(camera.threeCamera, vignette, bloom, ca);
    const effectPassBK = new EffectPass(camera.threeCamera, bokeh);
    // const effectPassBK = new EffectPass(camera.threeCamera, dof);

    composer.addPass(new RenderPass(scene, camera.threeCamera));
    composer.addPass(effectPassV);
    composer.addPass(effectPassBK);
  
	const lightManager = new LightManager(scene);
    const lights = [
        // "directional",
        // "ambient",
        "hemi"
    ];
	lights.forEach((light) => lightManager.place(light));

    const listener = new AudioListener();
    camera.threeCamera.add( listener );

    const audio = new Audio( listener );
    const audio2 = new Audio( listener );

    const particles = new Particles(scene, listener);
    // particles.start();

    const perlin = new ImprovedNoise();


    // Position and THREE.Color Data

    var positions = [];
    var colors = [];

    const width = Config.block.width;

    // var points = GeometryUtils.hilbert3D( new Vector3( 0, 0, 0 ), 1.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );

    // var divisions = Math.round( 12 * points.length );
    // var point = new Vector3();
    // var color = new Color();

    // for ( var i = 0, l = divisions; i < l; i ++ ) {
    //     var t = i / l;
    //     spline.getPoint( t, point );
    //     positions.push( point.x, point.y, point.z );
    //     color.setHSL( t, 1.0, 0.5 );
    //     colors.push( color.r, color.g, color.b );
    // }

    // var geometry = new BufferGeometry().setFromPoints( points );
    // var material = new LineBasicMaterial( { color : 0x000000, emissive: 0xFFFFFF } );
    // var splineObject = new Line( geometry, material );


    // Line2 ( LineGeometry, LineMaterial )
    // var geometry = new LineGeometry();
    // geometry.setPositions( positions );
    // geometry.setColors( colors );

    // let matLine = new LineMaterial( {
    //     color: 0xffffff,
    //     linewidth: 2, // in pixels
    //     vertexColors: false,
    //     //resolution:  // to be set by renderer, eventually
    //     dashed: false
    // } );

    // let line = new Line2( geometry, matLine );
    // line.computeLineDistances();
    // line.scale.set( 1, 1, 1 );

    // var worldWidth = 256, worldDepth = 256,
    //             worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
    
    // var data = generateHeight( worldWidth, worldDepth );
    // var geometry = new PlaneBufferGeometry( 10, 30, worldWidth - 1, worldDepth - 1 );
    // // geometry.rotateZ( -Math.PI / 2 );
    // geometry.rotateX( -Math.PI / 2 );

    // var vertices = geometry.attributes.position.array;

    // for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    //     vertices[ j + 1 ] = data[ i ] * 0.01;
    // }

    // let mesh = new Mesh( geometry, new MeshPhongMaterial( { emissive: 0xffffff, color:0x000000} ) );
    // mesh.position.set(0, -0.3, 0);
    // scene.add( mesh );

    // function generateHeight( width, height ) {
    //     var size = width * height, data = new Uint8Array( size ),
    //         perlin = new ImprovedNoise(), quality = 1, 
    //         // z = Math.random();
    //         z = Math.random() * 10;
    //     for ( var j = 0; j < 4; j ++ ) {
    //         for ( var i = 0; i < size; i ++ ) {
    //             var x = i % width, y = ~ ~ ( i / width );
    //             data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
    //         }
    //         quality *= 5;
    //     }
    //     return data;
    // }


    const url = new URL(window.location.href);
    const c = url.searchParams.get("lights") || Config.block.count;

    const blocks = [];
    for(let i = 0; i < c; i++) {
        if( i === 0 ) {
            const block = new Block(i, audio);
            blocks.push(block);
            scene.add( block.mesh );
        }
        else {
            const block = new Block(i);
            blocks.push(block);
            scene.add(block.mesh);
        }
    }
    
    const ic = new InteractionController(container, listener, blocks);
    
    const audioLoader = new AudioLoader();
    audioLoader.load( S_ballast, function( buffer ) {
        audio.setBuffer( buffer );
        audio.setLoop( true );
        audio.setVolume(0.5);
        audio.play();
        // audio.stop();
    });
    audioLoader.load( S_explosion, function( buffer ) {
        audio2.setBuffer( buffer );
        audio2.setVolume(0.5);
        audio2.play();
        // nice audio bug threejs
        audio2.stop();
        blocks[Config.rectLight.crash.number-1].offSound(audio2);
        blocks[Config.rectLight.crash.number-1].addParticle( particles );
    });

    audioLoader.load( S_breaker, function( buffer ) {
        blocks.forEach(block => {
            const positionalAudio = new PositionalAudio( listener );
            positionalAudio.setBuffer( buffer );
            positionalAudio.setRefDistance( 8 );
            block.addSound(positionalAudio);
        });
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
        TWEEN.update();
        stats.update();
        particles.update(delta);
        ic.update(delta);
        controls.update();

        // let insetWidth = window.innerHeight / 4; // square
        // let insetHeight = window.innerHeight / 4;
        // matLine.resolution.set( insetWidth, insetHeight ); // resolution of the inset viewport
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
