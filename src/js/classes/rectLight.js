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

import Config from '../../data/config';

export default class RectLight {
    constructor(block, special) {

        const rlc = Config.rectLight;

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
            mesh.rotation.z = TMath.degToRad( -deg );
        } else {
            matrix.makeTranslation( - rlc.mesh.width / 2, 0, 0 );
            position.set( rlc.position.x + rlc.mesh.width / 2, Config.block.height,rlc.position.z );
            rectLight.position.set( rlc.position.x - rlc.mesh.width / 2, -0.05, 0 );
            mesh.rotation.z = TMath.degToRad( deg );
        }
        mesh.geometry.applyMatrix( matrix );
        mesh.position.copy( position );
        
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        let tilt = false;
        this.crash = function() {
            tilt = true;
        }

        let temp = 0;
        this.update = function(delta) {
            // return;
            if(!tilt) {
                return;
            }
            temp += delta;
            const angle = Math.sin( temp );
            let rotZ = 90+angle;
            if ( !tiltRight ) rotZ = rotZ * (-1);
            mesh.rotation.z = TMath.degToRad( rotZ ) * 3;
            mesh.updateMatrix();
        }

        block.add(mesh);
        // block.add(rectLight);

        this.add = function(sound) {
            mesh.add(sound);
        }

        this.on = function() {
            // mesh.material.emissive.setHex(rlc.mesh.emissive);
            material.emissive.setHex(rlc.mesh.emissive);
            rectLight.intensity = rlc.intensity;
        }

        this.off = function() {
            // mesh.material.emissive.setHex(rlc.mesh.offEmissive);
            if( special ) {
                tilt = true;
                return;
            }
            material.emissive.setHex(rlc.mesh.offEmissive);
            rectLight.intensity = 0;
        }

    }
}