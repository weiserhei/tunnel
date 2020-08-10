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
    MeshNormalMaterial,
    MeshBasicMaterial,
    Scene,
    Vector3,
} from "three";
import TWEEN from "@tweenjs/tween.js";

import Config from '../../data/config';
import TurnLight from "./turnLight";
import RectLight from "./rectLight";
import Pipe from "./pipe";
import JunctionBox from "./junction_box";
import ScreenShake from "three-screenshake";

import T_205_diffuse from "../../textures/pattern_205/diffuse.jpg";
import T_205_normal from "../../textures/pattern_205/normal.jpg";
import T_205_specular from "../../textures/pattern_205/specular.jpg";

// import T_207_diffuse from "../../textures/pattern_207/diffuse.jpg";
// import T_207_normal from "../../textures/pattern_207/normal.jpg";
// import T_207_specular from "../../textures/pattern_207/specular.jpg";

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
    wireframe:false
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
    constructor(counter, audio) {

        this.sounds = [];
        this.bonusSounds = [];
        this.sound_switch = [];

        let offSound = undefined;

        const depth = Config.block.depth;
        const width = Config.block.width;
        const height = Config.block.height;
        const thickness = Config.block.thickness;

        const geometryWall = new BoxGeometry(thickness,height,depth);
        const geometryFloor = new BoxGeometry(width,thickness,depth);
        geometryFloor.applyMatrix4( new Matrix4().makeTranslation(0, -thickness/2, 0));
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

        let junction_box = false;
        // add every X blocks a junction box
        if( counter % 4 === 0) {
            junction_box = new JunctionBox(material, this.sound_switch);
            tunnel.add( junction_box );
            this.button = junction_box.userData.button;
        }

        let turnLight = false;
        // add every X blocks an alarm light
        if( counter % 3 === 0) {
            turnLight = new TurnLight(tunnel, counter);
            turnLight.off();
        }

        const special = Config.rectLight.crash.enabled && counter === Config.rectLight.crash.number-1;
        const rectLight = new RectLight(tunnel, special);
        // rectLight.off();

        let particles;
        let screenShake;
        this.addParticle = function(particle, cam) {
            // add particles and camera shake for explosion
            particles = particle;
            screenShake = new ScreenShake(cam);
        }

        this.update = function(delta) {
            if( turnLight ) turnLight.update(delta);
            if( rectLight && special ) rectLight.update(delta);
            if( screenShake ) {
                screenShake.update();
            }
        }

        this.offSound = function(sound) {
            offSound = sound;
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
            if( junction_box ) junction_box.userData.normal();
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
            if( junction_box ) junction_box.userData.emergency();
            if( rectLight ) rectLight.off();
            if( turnLight ) turnLight.on();
            if( audio ) audio.stop();
            if( offSound ) offSound.play();
            if( !special ) {
                // dont play breaker sound when explosion
                this.sounds.forEach(sound => sound.play() );
            }
            if (this.bonusSounds) {
                if(particles) {
                    // explosion happening
                    particles.start();
                    screenShake.shake( new Vector3(Math.random(), 0.1, 0.2), 300 /* ms */ );
                }
                this.bonusSounds.forEach(sound => sound.play());
            }
        }

    }
}