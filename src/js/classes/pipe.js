import {
    Mesh,
    BoxBufferGeometry,
    MeshPhongMaterial,
    CylinderBufferGeometry,
    MeshNormalMaterial,
    TextureLoader,
    RepeatWrapping,
    MeshPhysicalMaterial,
    MeshStandardMaterial
} from "three";
import Config from '../../data/config';

import T_205_diffuse from "../../textures/pattern_205/diffuse.jpg";
import T_205_normal from "../../textures/pattern_205/normal.jpg";
import T_205_specular from "../../textures/pattern_205/specular.jpg";

const textureloader = new TextureLoader();
const colorMap = textureloader.load(T_205_diffuse);
const normalMap = textureloader.load(T_205_normal);
const specularMap = textureloader.load(T_205_specular);

// import T_207_diffuse from "../../textures/pattern_207/diffuse.jpg";
// import T_207_normal from "../../textures/pattern_207/normal.jpg";
// import T_207_specular from "../../textures/pattern_207/specular.jpg";

// const colorMap2 = textureloader.load(T_207_diffuse);
// const normalMap2 = textureloader.load(T_207_normal);
// const specularMap2 = textureloader.load(T_207_specular);

const material = new MeshStandardMaterial({
    color:0xffffff,
    map: colorMap,
    normalMap: normalMap,
    metalnessMap: specularMap,
    roughness: 0.4,
    // emissive: 0x0000ff,
});

const material2 = material.clone();
material.roughness = 0.2;
material.color.setHex(0xaaaaaa);
// material.emissive.setHex(0xFFAA00);

export default class Pipe {
    constructor(block) {

        // const pc = Config.pipe;

        const x = new Mesh(new BoxBufferGeometry(0.2,0.2,0.2), material2);
        
        const mesh = new Mesh(
            new CylinderBufferGeometry(
                0.1,
                0.1,
                Config.block.depth,
                16
                ),
                material
            );
        mesh.geometry.rotateX(Math.PI / 2);
        mesh.position.set( Config.block.width / 2 - 0.2, Config.block.height - 0.2, 0 );
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        // x.position.copy(mesh.position);
        mesh.add( x );
        return mesh;

    }
}