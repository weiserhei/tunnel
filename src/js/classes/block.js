
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
    Object3D
} from "three";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import T_205_diffuse from "../../textures/pattern_205/diffuse.jpg";
import T_205_normal from "../../textures/pattern_205/normal.jpg";
import T_205_specular from "../../textures/pattern_205/specular.jpg";

import T_207_diffuse from "../../textures/pattern_207/diffuse.jpg";
import T_207_normal from "../../textures/pattern_207/normal.jpg";
import T_207_specular from "../../textures/pattern_207/specular.jpg";

export default class Block {
    constructor(depth) {

        const width = 4;
        const height = 2.5;
        const thickness = 0.2;

        const textureloader = new TextureLoader();

        const geometryFloor = new BoxGeometry(width,thickness,depth);
        const geometryWall = new BoxGeometry(thickness,height,depth);
        geometryWall.applyMatrix(new Matrix4().makeTranslation(width/2, height/2, 0));
        const material = new MeshPhysicalMaterial({
            color:0xFFFFFF,
            map: textureloader.load(T_205_diffuse),
            normalMap: textureloader.load(T_205_normal),
            metalnessMap: textureloader.load(T_205_specular),
            roughness: 0.4
        });

        material.map.wrapS = material.map.wrapT = RepeatWrapping;
        material.map.repeat.set( 1, 1 );
        material.map.anisotropy = 16;
        material.normalMap.anisotropy = 16;
        // geometry.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI / 2 ) );
        geometryFloor.merge(geometryWall, geometryWall.matrix);
        const geo2 = geometryFloor.clone();
        geo2.applyMatrix(new Matrix4().makeRotationZ(Math.PI ));
        geo2.applyMatrix(new Matrix4().makeTranslation(0, height, 0));
        geometryFloor.merge(geo2, geo2.matrix);
        // const geometry = geometryFloor.merge(geometryWall, geometryWall.matrix);
        const tunnel = new Mesh(geometryFloor, material);
        // scene.add(tunnel);
        const lamp = new Mesh(
            new BoxBufferGeometry(1,0.05,0.1),
            new MeshPhongMaterial({color:0xFFFFAA, emissive:0x666633})
            );
        lamp.position.set(0,height-thickness+0.1,0);
        // scene.add(lamp);
        // lamp.add( positionalAudio );
        // positionalAudio.position.copy(lamp.position);

        RectAreaLightUniformsLib.init();

        const rectLight = new RectAreaLight( 0xFFFFAA, 8, 2, 0.5 );
        rectLight.position.set( 0, height-thickness+0.01, 0 );
        rectLight.rotation.set( -Math.PI / 2,0, 0);
        // scene.add( rectLight );

        // var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.DoubleSide } ) );
        // rectLightMesh.scale.x = rectLight.width;
        // rectLightMesh.scale.y = rectLight.height;
        // rectLight.add( rectLightMesh );

        const block = new Object3D();
        block.add( tunnel );
        block.add( rectLight );
        block.userData.lamp = lamp;
        block.userData.light = rectLight;
        block.add( lamp );
        // scene.add( block);

        return block;

    }
}