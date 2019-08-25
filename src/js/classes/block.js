
import { 
    TextureLoader,
    BoxGeometry,
    Matrix4,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    Mesh,
    RepeatWrapping,
    DoubleSide,
    BoxBufferGeometry,
    MeshNormalMaterial,
    SphereBufferGeometry,
} from "three";

import TurnLight from "./turnLight";
import RectLight from "./rectLight";
import Pipe from "./pipe";

import T_205_diffuse from "../../textures/pattern_205/diffuse.jpg";
import T_205_normal from "../../textures/pattern_205/normal.jpg";
import T_205_specular from "../../textures/pattern_205/specular.jpg";

// import T_207_diffuse from "../../textures/pattern_207/diffuse.jpg";
// import T_207_normal from "../../textures/pattern_207/normal.jpg";
// import T_207_specular from "../../textures/pattern_207/specular.jpg";
import Config from '../../data/config';

import TWEEN from "@tweenjs/tween.js";

const textureloader = new TextureLoader();
const colorMap = textureloader.load(T_205_diffuse);
const normalMap = textureloader.load(T_205_normal);
const specularMap = textureloader.load(T_205_specular);
const material = new MeshStandardMaterial({
    color:0xffffff,
    map: colorMap,
    normalMap: normalMap,
    metalnessMap: specularMap,
    roughness: 0.4,
});

const repeatx = 2;
const repeaty = 2;
material.map.wrapS = material.map.wrapT = RepeatWrapping;
material.normalMap.wrapS = material.normalMap.wrapT = RepeatWrapping;
material.metalnessMap.wrapS = material.metalnessMap.wrapT = RepeatWrapping;
material.map.repeat.set( repeatx, repeaty );
material.normalMap.repeat.set( repeatx, repeaty );
material.metalnessMap.repeat.set( repeatx, repeaty );
material.map.anisotropy = Config.maxAnisotropy;
material.normalMap.anisotropy = Config.maxAnisotropy;
material.metalnessMap.anisotropy = Config.maxAnisotropy;

export default class Block {
    constructor(counter, audio, audio2) {
        this.sounds = [];
        this.bonusSounds = [];

        const depth = Config.block.depth;
        const width = Config.block.width;
        const height = Config.block.height;
        const thickness = Config.block.thickness;

        const geometryWall = new BoxGeometry(thickness,height,depth);
        const geometryFloor = new BoxGeometry(width,thickness,depth);
        geometryFloor.applyMatrix( new Matrix4().makeTranslation(0, -thickness/2, 0));
        geometryFloor.merge(geometryFloor, new Matrix4().makeTranslation(0, height+thickness, 0));
        geometryFloor.merge(geometryWall, new Matrix4().makeTranslation(width/2+thickness/2, height/2, 0));
        geometryFloor.merge(geometryWall, new Matrix4().makeTranslation(-width/2-thickness/2, height/2, 0));

        const tunnel = new Mesh(geometryFloor,material);
        tunnel.matrixAutoUpdate = false;
        // scene.add(tunnel);
        
        tunnel.position.set(0, 0, counter * depth);
        tunnel.updateMatrix();
        this.mesh = tunnel;

        const pipe = new Pipe();
        tunnel.add(pipe);

        let turnLight = false;
        // add every X blocks an alarm light
        if( counter % 3 === 0) {
            turnLight = new TurnLight(tunnel, counter);
            turnLight.off();
        }

        const special = Config.rectLight.crash.enabled && counter === Config.rectLight.crash.id-1;
        const rectLight = new RectLight(tunnel, special, audio2);
        // rectLight.off();

        let particles;
        this.addParticle = function(particle) {
            particles = particle;
        }

        this.update = function(delta) {
            if( turnLight ) turnLight.update(delta);
            if( rectLight && special ) rectLight.update(delta);
        }

        this.addSound = function(sound) {
            this.sounds.push(sound);
            if(rectLight) rectLight.add(sound);
        }

        this.addBonusSound = function(sound) {
            this.bonusSounds.push(sound);
            tunnel.add(sound);
        }

        this.on = function() {
            if( rectLight ) rectLight.on();
            if( turnLight ) turnLight.off();
            if( audio ) {
                audio.play();

                const volume = {x : 0};
                new TWEEN.Tween(volume).to({
                    x: 1
                }, 1000).onUpdate(function() {
                    audio.setVolume(volume.x);
                }).onComplete(function() {
                    // audio.stop();
                }).start();
            }

            if (this.bonusSounds) {
                this.bonusSounds.forEach(sound => sound.stop());
                if( particles ) particles.stop();
            }
            // if( special ) return; // no sound because its still turned on?
            this.sounds.forEach(sound => sound.play() );
        }
        
        this.off = function() {
            if( rectLight ) rectLight.off();
            if( turnLight ) turnLight.on();
            if ( audio ) audio.stop();
            this.sounds.forEach(sound => sound.play() );
            if (this.bonusSounds) {
                if(particles) particles.start();
                this.bonusSounds.forEach(sound => sound.play());
            }
        }

    }
}