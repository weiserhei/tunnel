import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init();

import {
    Mesh,
    BoxBufferGeometry,
    MeshPhongMaterial,
    RectAreaLight
} from "three";

import Config from '../../data/config';

export default class RectLight {
    constructor(block) {

        const rlc = Config.rectLight;

        const mesh = new Mesh(
            new BoxBufferGeometry(
                rlc.mesh.width,
                rlc.mesh.height,
                rlc.mesh.depth
                ),
            new MeshPhongMaterial({
                color:rlc.mesh.color,
                emissive:rlc.mesh.emissive
                })
            );

        mesh.position.set( rlc.position.x, Config.block.height-0.01,rlc.position.z );
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        const rectLight = new RectAreaLight( 
            rlc.color,
            rlc.intensity,
            rlc.width,
            rlc.height
            );
        rectLight.position.set( rlc.position.x, Config.block.height-0.05, rlc.position.z );
        rectLight.rotation.set( -Math.PI / 2,0, 0);
        // scene.add( rectLight );

        block.add(mesh);
        block.add(rectLight);

        this.add = function(sound) {
            mesh.add(sound);
        }

        this.on = function() {
            mesh.material.emissive.setHex(rlc.mesh.emissive);
            rectLight.intensity = rlc.intensity;
        }

        this.off = function() {
            mesh.material.emissive.setHex(rlc.mesh.offEmissive);
            rectLight.intensity = 0;
        }

    }
}