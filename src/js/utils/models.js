import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { 
    TextureLoader, 
    Color,
    MeshStandardMaterial, 
    DoubleSide, 
    sRGBEncoding, 
    PointLight, 
    Mesh, 
    BoxBufferGeometry, 
    ObjectLoader} from 'three';

import lanternColor from "../../models/lantern/textures/lantern_Base_Color.jpg";
import lanternMetallic from "../../models/lantern/textures/lantern_Metallic.jpg";
import lanternAO from "../../models/lantern/textures/lantern_Mixed_AO.jpg";
import lanternNormal from "../../models/lantern/textures/lantern_Normal_OpenGL.jpg";
import lanternOpacity from "../../models/lantern/textures/lantern_Opacity.jpg";
import lanternRoughness from "../../models/lantern/textures/lantern_Roughness.jpg";

export default function (scene) {

    // roman statue
    // let path = "models/statue_v1/";
    // new MTLLoader()
    // .setPath( path )
    // .load( '12330_Statue_v1_L2.mtl', function ( materials ) {
    //     materials.preload();
    //     new OBJLoader()
    //         .setMaterials( materials )
    //         .setPath( path )
    //         .load( '12330_Statue_v1_L2.obj', function ( object ) {
    //             object.position.y = 0.4;
    //             object.children[0].geometry.rotateX(THREE.Math.degToRad( -90 ))
    //             object.scale.multiplyScalar(0.01);
    //             scene.add( object );
    //         });
    // } );

    // const herculesMTL = require("../../models/Models_E0119A043/hercules.mtl");
    // const herculesOBJ = require("../../models/Models_E0119A043/hercules.obj");
    // roman bust
    // let path = "models/Models_E0119A043/";
    // new MTLLoader(loader.manager)
    // // .setPath( "../../models/Models_E0119A043/" )
    // .load( path + "hercules.mtl", function ( materials ) {
    //     materials.preload();
    //     new OBJLoader(loader.manager)
    //         .setMaterials( materials )
    //         // .setPath( path )
    //         .load( path + "hercules.obj", function ( object ) {
    //             object.position.set( 1.5, 0.4, -2);
    //             object.scale.multiplyScalar(0.1);

    //             object.children[0].onBeforeRender = () => { 
    //                 object.children[0].rotation.y += 0.01; 
    //             };

    //             scene.add( object );
    //         });
    // } );

    let tloader = new TextureLoader();

    let path = "models/lantern/";
    new MTLLoader()
    // .setPath( "../../models/Models_E0119A043/" )
    .load( path + "lantern_obj.mtl", function ( materials ) {
        materials.preload();
        new OBJLoader()
            .setMaterials( materials )
            // .setPath( path )
            .load( path + "lantern_obj.obj", function ( object ) {
                object.position.set( 1, 0.1, 30);
                object.scale.multiplyScalar(0.005);
                // object.children[0].onBeforeRender = () => { 
                //     object.children[0].rotation.y += 0.01; 
                // };
                let pM = new MeshStandardMaterial({ 
                    map: tloader.load(lanternColor),
                    normalMap: tloader.load(lanternNormal),
                    metalnessMap: tloader.load(lanternMetallic),
                    roughnessMap: tloader.load(lanternRoughness),
                    aoMap: tloader.load(lanternAO),
                    alphaMap: tloader.load( lanternOpacity ),
                });
                object.children.forEach(child => {
                    child.material = pM;
                    if(child.name == "glass lantern") {
                        child.material = child.material.clone();
                        child.material.transparent = true;
                        child.material.emissive.setHex(0xaa8800);
                        // depthWrite: false,
                        // child.material.side = DoubleSide;
                        // fix transparent see through
                        child.renderOrder = 1;
                    }
                })
                let pl = new PointLight(0xFFAA00, 0.2, 15, 5);
                pl.position.set(0, 0.4, 0);
                object.add(pl);
                // scene.add(pl);
                // let x = new Mesh(new BoxBufferGeometry(0.5,0.5,0.5));
                // x.position.copy(pl.position);
                // scene.add(x);
                scene.add( object );
            });
    } );

}