import * as THREE from 'three';
import SPE from "shader-particle-engine";

import cloud from "../../images/cloud.png";
import soundSteam from "../../media/steam.ogg";

export default class Particles {
    constructor(scene, sound) {

        // Create particle group and emitter
        let particleGroup = new SPE.Group({
            texture: {
                value: new THREE.TextureLoader().load(cloud)
            },
            blending: THREE.NormalBlending,
            maxParticleCount: 500,
            fog: false
        });
        
        let smokeEmitter = new SPE.Emitter({
            particleCount: 500,
            maxAge: {
                value: 3,
            },
            position: {
                value: new THREE.Vector3( 0, -0.3, 0 ),
                // value: new THREE.Vector3( -6.5, 0, 10 ),
                spread: new THREE.Vector3( 10, 0.5, 8 )
            },
            velocity: {
                value: new THREE.Vector3( 0, 0.7, 0 )
            },
            wiggle: {
                spread: 5
            },
            size: {
                value: 10,
                spread: 15
            },
            opacity: {
                value: [ 0, 0.6, 0 ]
            },
            color: {
                value: [new THREE.Color( 0.5,0.5,0.5 ), new THREE.Color(1,1,1)],
                spread: new THREE.Color( 0.1, 0.1, 0.1 )
            },
            angle: {
                value: [ 0, Math.PI * 0.125 ]
            }
        });
        
        smokeEmitter.disable();
        particleGroup.addEmitter( smokeEmitter );
        scene.add( particleGroup.mesh );
        // particleGroup.mesh.frustumCulled = false;
        this.emitter = smokeEmitter;
        this.particleGroup = particleGroup;

        this.stop = function() {
            smokeEmitter.disable();
        }

        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( soundSteam, function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( false );
            sound.setVolume( 0.5 );
        });
        
        this.start = function() {
            sound.play();
            smokeEmitter.enable();
        }

        this.update = function ( delta ) {
            if( particleGroup ) {
                particleGroup.tick( delta );
            }
        }

    }


}