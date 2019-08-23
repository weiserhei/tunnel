
import { 
    TextureLoader,
    BoxGeometry,
    Matrix4,
    MeshPhysicalMaterial,
    MeshPhongMaterial,
    Mesh,
    BoxBufferGeometry,
    RepeatWrapping,
    RectAreaLight,
    Object3D,
    DoubleSide,
    PlaneBufferGeometry,
    MeshBasicMaterial
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
    color:0xFFFFFF,
    map: colorMap,
    normalMap: normalMap,
    metalnessMap: specularMap,
    roughness: 0.4,
});

export default class Block {
    constructor(counter) {
        this.sounds = [];

        const depth = Config.block.depth;
        const width = Config.block.width;
        const height = Config.block.height;
        const thickness = Config.block.thickness;

        const geometryFloor = new BoxGeometry(width,thickness,depth);
        const geometryWall = new BoxGeometry(thickness,height,depth);
        geometryWall.applyMatrix(new Matrix4().makeTranslation(width/2, height/2, 0));

        material.map.wrapS = material.map.wrapT = RepeatWrapping;
        material.map.repeat.set( 1, 1 );
        material.map.anisotropy = Config.maxAnisotropy;
        material.normalMap.anisotropy = Config.maxAnisotropy;
        // geometry.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI / 2 ) );
        geometryFloor.merge(geometryWall, geometryWall.matrix);
        const geo2 = geometryFloor.clone();
        geo2.applyMatrix(new Matrix4().makeRotationZ(Math.PI ));
        geo2.applyMatrix(new Matrix4().makeTranslation(0, height, 0));
        geometryFloor.merge(geo2, geo2.matrix);
        // const geometry = geometryFloor.merge(geometryWall, geometryWall.matrix);
        const tunnel = new Mesh(geometryFloor, material);
        tunnel.matrixAutoUpdate = false;
        tunnel.updateMatrix();
        // scene.add(tunnel);


        const block = new Object3D();
        block.position.set(0, 0, counter * depth);
        block.matrixAutoUpdate = false;
        block.updateMatrix();

        block.add( tunnel );
        // scene.add( block);
        this.mesh = block;

        if( counter % 3 === 0) {
            var turnLight = new TurnLight(block, counter);
            turnLight.off();
        }
        const rectLight = new RectLight(block, height, thickness);
        // rectLight.off();

        this.update = function(delta) {
            if( turnLight ) turnLight.update(delta);
            // turnLight.update(delta);
        }

        this.addSound = function(sound) {
            this.sounds.push(sound);
            // rectLight.add(sound);
        }

        this.addBonusSound = function(sound) {
            this.bonusSound = sound;
            block.add(sound);
        }

        this.on = function() {
            rectLight.on();
            if( turnLight ) turnLight.off();
            this.sounds.forEach(sound => sound.play() );
            // this.sounds[0].play();
        }
        
        this.off = function() {
            rectLight.off();
            if( turnLight ) turnLight.on();
            this.sounds.forEach(sound => sound.play() );
            if (this.bonusSound) this.bonusSound.play();
        }

    }
}