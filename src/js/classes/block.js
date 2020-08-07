
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
    CircleBufferGeometry,
    PlaneBufferGeometry,
    CircleGeometry,
    MeshBasicMaterial,
    Scene,
    Vector3,
    CatmullRomCurve3,
    TubeBufferGeometry,
    Color,
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

        const emergency_color = new Color(0xAA5555);
        // const normal_color = new Color(0xFF8800);
        const normal_color = new Color(0xAAAA55);
        // const normal_color = new Color(0xFFFF66);
        // const normal_color = new Color(0xffff00);
        // const normal_color = new Color(0x55FF55);

        var points = [
            new Vector3(0, 0, -10), 
            new Vector3(0, 0, -0.4), 
            new Vector3(0.01, 1.1, 0.1), 
            // new Vector3(0, 0, 0), 
            // new Vector3(0, 0, 24),
            // new Vector3(0, 0, 25),
        ];
    
        var spline = new CatmullRomCurve3( points, false, "catmullrom", 0.2 );

        var tubeGeometry = new TubeBufferGeometry( spline, 300, 0.01, 12, false );
        var cable_material = new MeshPhongMaterial( { color : 0x999999, emissive: 0x999955 } );
        // var cable_material = new MeshPhongMaterial( { color : 0x999999, emissive: normal_color } );
        var line = new Mesh( tubeGeometry, cable_material );
        line.position.set(-width/2-0.0, 0.2, 1);
        line.userData.emergency = function() {
            // line.material.emissive.set(0xAA5555);
            // line.material.emissive.set(0x999955);
            line.material.emissive.set(material.emissive);
        }
        line.userData.normal = function() {
            // line.material.emissive.set(material.emissive);
            line.material.emissive.set(0x999955);
        }

        let x;
        // add every X blocks a junction box
        if( counter % 4 === 0) {
            tunnel.add( line );

            // const x = new Mesh(new BoxBufferGeometry(0.2, 0.6, 0.45), new MeshPhongMaterial({ color:0xffffff, emissive: 0x555555 }));
            x = new Mesh(new BoxBufferGeometry(0.1, 0.6, 0.45), material.clone());
            x.material.color.set(0xCCCCCC);
            x.material.map = undefined;

            let circle_geometry = new CircleBufferGeometry( 0.01, 32 );
            var circle = new Mesh( circle_geometry, new MeshPhongMaterial({ emissive: normal_color }) );
            circle.rotation.y = Math.PI/2;
            // circle.position.set(0.051, 0.05, 0.15);
            // circle.position.set(0.051, 0.15, 0);
            circle.position.set(0.051, -0.15, 0);
            x.add( circle );

            let geometry = new PlaneBufferGeometry(0.2, 0.02);
            var m = new Mesh( geometry, new MeshPhongMaterial({ emissive: normal_color }) );
            m.rotation.y = Math.PI/2;
            m.position.set(0.051, 0.2, 0);
            x.add( m );

            tunnel.add( x );
            // x.position.set(-width/2, 1.4, 6);
            x.position.set(-width/2, 1.4, 1);

            x.userData.emergency = function() {
                circle.material.emissive.set(emergency_color);
                m.material.emissive.set(emergency_color);
            }
            x.userData.normal = function() {
                circle.material.emissive.set(normal_color);
                m.material.emissive.set(normal_color);
            }
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
        this.addParticle = function(particle) {
            particles = particle;
        }

        this.update = function(delta) {
            if( turnLight ) turnLight.update(delta);
            if( rectLight && special ) rectLight.update(delta);
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
            if( x ) x.userData.normal();
            if( line ) line.userData.normal();
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
        let self = this;
        this.off = function() {
            if( x ) x.userData.emergency();
            if( line ) line.userData.emergency();
            if( rectLight ) rectLight.off();
            if( turnLight ) turnLight.on();
            if( audio ) audio.stop();
            if( offSound ) offSound.play();
            if( !special ) {
                // dont play breaker sound when explosion
                this.sounds.forEach(sound => sound.play() );
            }
            if (this.bonusSounds) {
                if(particles) particles.start();
                this.bonusSounds.forEach(sound => sound.play());
            }
        }

    }
}