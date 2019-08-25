import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init();

import {
    Mesh,
    BoxBufferGeometry,
    MeshPhongMaterial,
    RectAreaLight,
    Matrix4,
    Math as TMath,
    Vector3
} from "three";

import TWEEN from "@tweenjs/tween.js";

import Config from '../../data/config';

export default class RectLight {
    constructor(block, special) {

        const rlc = Config.rectLight;
        const speed = 3;
        const amp = 5;
        const angle = 90;
        let swinging = false;
        let tick = 0;

        const material = new MeshPhongMaterial({
            color:rlc.mesh.color,
            emissive:rlc.mesh.emissive
            });
        
        // const materialBack = new MeshPhongMaterial({
        //     color: 0x442200,
        //     emissive: 0x050505
        // });

        const mesh = new Mesh(
            new BoxBufferGeometry(
                rlc.mesh.width,
                rlc.mesh.height,
                rlc.mesh.depth
                ),
                [ 
                    // material, material, materialBack,
                    material, material, material,
                    material, material, material,
                    // material, material, materialBack,
                ]
            );

        mesh.position.set( rlc.position.x, Config.block.height-0.01,rlc.position.z );

        const rectLight = new RectAreaLight( 
            rlc.color,
            rlc.intensity,
            rlc.width,
            rlc.height
            );
        // rectLight.position.set( rlc.position.x, Config.block.height-0.05, rlc.position.z );
        rectLight.rotation.set( -Math.PI / 2,0, 0);
        mesh.add( rectLight );

        // tilt lights random
        let matrix = new Matrix4();
        let position = new Vector3();
        let deg = Math.random() * (2 - 0) + 0;
        const tiltRight = Math.random() < 0.5;

        if(tiltRight) {
            matrix.makeTranslation( rlc.mesh.width / 2, 0, 0 );
            position.set( rlc.position.x - rlc.mesh.width / 2, Config.block.height,rlc.position.z );
            rectLight.position.set( rlc.position.x + rlc.mesh.width / 2, -0.05, 0 );
            deg = deg * (-1);
        } else {
            matrix.makeTranslation( - rlc.mesh.width / 2, 0, 0 );
            position.set( rlc.position.x + rlc.mesh.width / 2, Config.block.height,rlc.position.z );
            rectLight.position.set( rlc.position.x - rlc.mesh.width / 2, -0.05, 0 );
        }
        mesh.rotation.z = TMath.degToRad( deg );
        mesh.geometry.applyMatrix( matrix );
        mesh.position.copy( position );
        
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        
        block.add(mesh);
        // block.add(rectLight);

        function getRotZ( tick ) {
            const swing = Math.sin( tick * speed );
            let rotZ = angle+swing * amp;
            if ( tiltRight ) rotZ = rotZ * (-1);
            return TMath.degToRad( rotZ );
        }
        
        function tilt() {
            // delay animation for explosion sound
            setTimeout(function(){ 
                new TWEEN.Tween(mesh.rotation).to({
                    z: getRotZ( tick )
                }, 2000)
                .easing( TWEEN.Easing.Elastic.Out )
                .onUpdate(function() {
                    mesh.updateMatrix();
                })
                .onComplete(function() {
                    swinging = true;
                })
                .start();
            }, 100);
        }

        function resetTilt() {
            swinging = false;
            tick = 0;
            // if(tiltRight) { 
            //     deg = deg * (-1); 
            // }
            mesh.rotation.z = TMath.degToRad( deg );
            mesh.updateMatrix();
        }

        this.update = function(delta) {
            if(!swinging) return;
            tick += delta;
            mesh.rotation.z = getRotZ( tick );
            mesh.updateMatrix();
        }

        this.add = function(sound) {
            mesh.add(sound);
        }

        this.on = function() {
            // mesh.material.emissive.setHex(rlc.mesh.emissive);
            material.emissive.setHex(rlc.mesh.emissive);
            rectLight.intensity = rlc.intensity;

            if ( special ) resetTilt();
        }

        this.off = function() {
            // mesh.material.emissive.setHex(rlc.mesh.offEmissive);
            if( special ) {
                tilt();
                return;
            }
            material.emissive.setHex(rlc.mesh.offEmissive);
            rectLight.intensity = 0;
        }

    }
}