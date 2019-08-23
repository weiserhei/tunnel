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
    constructor(block, height, thickness) {

        const lamp = new Mesh(
            new BoxBufferGeometry(1,0.05,0.15),
            // new MeshPhongMaterial({color:0xFFFFAA, emissive:0x666633})
            new MeshPhongMaterial({color:0x886666, emissive:0x666633})
            );
        lamp.position.set(0,height-thickness+0.1,-1);
        lamp.matrixAutoUpdate = false;
        lamp.updateMatrix();
        // scene.add(lamp);
        // lamp.add( positionalAudio );
        // positionalAudio.position.copy(lamp.position);

        const rectLight = new RectAreaLight( 
            Config.rectLight.color,
            Config.rectLight.intensity,
            Config.rectLight.width,
            Config.rectLight.height );
        rectLight.position.set( 0, height-thickness+0.01, 1 );
        rectLight.rotation.set( -Math.PI / 2,0, 0);
        // scene.add( rectLight );

        // var rectLightMesh = new Mesh( new PlaneBufferGeometry(), new MeshBasicMaterial( { side: DoubleSide } ) );
        // rectLightMesh.scale.x = rectLight.width;
        // rectLightMesh.scale.y = rectLight.height;
        // rectLight.add( rectLightMesh );

        block.add(lamp);
        block.add(rectLight);

        this.add = function(sound) {
            lamp.add(sound);
        }

        this.on = function() {
            lamp.material.emissive.setHex(0x666633);
            rectLight.intensity = 16;
        }

        this.off = function() {
            lamp.material.emissive.setHex(0x020202);
            rectLight.intensity = 0;
        }

    }
}