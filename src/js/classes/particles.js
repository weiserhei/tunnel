import { PositionalAudio, AudioLoader, TextureLoader, Color, Vector3, NormalBlending } from 'three';
import SPE from "shader-particle-engine";

import cloud from "../../images/cloud.png";
// import cloud from "../../images/smokeparticle.png";
// import soundSteam from "../../media/steam_loop.ogg";
import soundSteam from "../../media/340255__kingof-thelab__steamloopbody.wav";
import Config from '../../data/config';

export default class Particles {
    constructor(scene, listener) {

        // Create particle group and emitter
        let particleGroup = new SPE.Group({
            texture: {
                value: new TextureLoader().load(cloud)
            },
            blending: NormalBlending,
            maxParticleCount: 1000,
            fog: false
        });
        
        // const zpos = -2.2;
        const zpos = -1;
        const xpos = -1.5;
        const acceleration = new Vector3( 0.05, -0.05, 0);
        const velocity = new Vector3( -0.5, 0.1, 0);

        let emitter = new SPE.Emitter({
            particleCount: 500,
            maxAge: {
                value: 3,
            },
            position: {
                value: new Vector3( -xpos, Config.block.height - 1.3, zpos ),
                spread: new Vector3( 0, 0, 0 )
            },
            velocity: {
                value: velocity
            },
            acceleration: {
                value: acceleration
            },
            wiggle: {
                spread: 1
            },
            size: {
                value: [0.01, 0.5],
                spread: 2
            },
            opacity: {
                value: [ 0, 0.01, 0.04, 0 ]
            },
            color: {
                // value: [new Color( 0.5,0.5,0.5 ), new Color(0.8, 0.8, 0.8)],
                value: [new Color( 0.4,0.3, 0.2 ), new Color(0.4, 0.3, 0.2)],
                spread: new Color( 0.1, 0.1, 0.1 )
            },
            angle: {
                value: [ 0, Math.PI ]
            }
        });
        
        emitter.disable();
        particleGroup.addEmitter( emitter );
        scene.add( particleGroup.mesh );
        particleGroup.mesh.frustumCulled = false;
        this.emitter = emitter;
        this.particleGroup = particleGroup;

        this.stop = function() {
            emitter.disable();
            positionalAudio.stop();
        }

        const positionalAudio = new PositionalAudio( listener );
        const audioLoader = new AudioLoader();
        audioLoader.load( soundSteam, function( buffer ) {
            positionalAudio.setBuffer( buffer );
            positionalAudio.setLoop( true );
            positionalAudio.setVolume( 10 );
            particleGroup.mesh.add( positionalAudio );
            // positionalAudio.play();
        });
        
        this.start = function() {
            positionalAudio.play();
            emitter.enable();
        }

        this.update = function ( delta ) {
            if( particleGroup ) {
                particleGroup.tick( delta );
            }
        }

    }


}