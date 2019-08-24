
import { 
    TextureLoader,
    BoxGeometry,
    Matrix4,
    MeshPhysicalMaterial,
    MeshPhongMaterial,
    Mesh,
    RepeatWrapping,
    DoubleSide,
    BoxBufferGeometry,
    MeshNormalMaterial,
    SphereBufferGeometry,
} from "three";

import TurnLight from "./turnLight";
import RectLight from "./rectLight";

import T_205_diffuse from "../../textures/pattern_205/diffuse.jpg";
import T_205_normal from "../../textures/pattern_205/normal.jpg";
import T_205_specular from "../../textures/pattern_205/specular.jpg";

// import T_207_diffuse from "../../textures/pattern_207/diffuse.jpg";
// import T_207_normal from "../../textures/pattern_207/normal.jpg";
// import T_207_specular from "../../textures/pattern_207/specular.jpg";
import Config from '../../data/config';

const textureloader = new TextureLoader();
const colorMap = textureloader.load(T_205_diffuse);
const normalMap = textureloader.load(T_205_normal);
const specularMap = textureloader.load(T_205_specular);
const material = new MeshPhysicalMaterial({
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
    constructor(counter, scene) {
        this.sounds = [];
        this.bonusSounds = [];

        // const x = new Mesh(new BoxBufferGeometry(1, 2.4, 1), new MeshNormalMaterial());
        // x.position.set(0.5, 1.2, 0);
        // scene.add( x );
        // const y = new Mesh(new SphereBufferGeometry(0.5, 16, 16), new MeshNormalMaterial());
        // y.position.set(-1, 0.5, 0);
        // scene.add( y );

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

        let turnLight;
        // add every X blocks an alarm light
        if( counter % 3 === 0) {
            turnLight = new TurnLight(tunnel, counter);
            // turnLight.off();
        }
        const rectLight = new RectLight(tunnel, height, thickness);
        rectLight.off();

        this.update = function(delta) {
            if( turnLight ) turnLight.update(delta);
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
            rectLight.on();
            if( turnLight ) turnLight.off();
            this.sounds.forEach(sound => sound.play() );
            if (this.bonusSounds) {
                this.bonusSounds.forEach(sound => sound.stop());
            }
            // this.sounds[0].play();
        }
        
        this.off = function() {
            rectLight.off();
            if( turnLight ) turnLight.on();
            this.sounds.forEach(sound => sound.play() );
            if (this.bonusSounds) {
                this.bonusSounds.forEach(sound => sound.play());
            }
        }

    }
}