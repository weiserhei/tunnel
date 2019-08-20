import { DoubleSide, sRGBEncoding, NearestFilter, LinearFilter, Matrix4, Vector3 } from "three";
import { BoxBufferGeometry, Mesh } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export default function loadModel( scene, manager, interactionController, modelDefinition, particles ) {

    const model = modelDefinition.model;
    const gltfLoader = new GLTFLoader(manager);
    DRACOLoader.setDecoderPath( 'libs/draco/' );
    const dracoLoader = new DRACOLoader(manager);
    gltfLoader.setDRACOLoader( dracoLoader );

    gltfLoader.setPath(model.path);
    gltfLoader.load( model.filename, function ( gltf ) {

        gltf.scene.rotateY(model.rotation.y);
        gltf.scene.position.set(model.position.x, model.position.y, model.position.z);
        gltf.scene.scale.multiplyScalar(model.scale);

        gltf.scene.matrixAutoUpdate = false;
        gltf.scene.updateMatrix();

        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                // child.material.clippingPlanes = [ localPlane ];
                child.material.side = DoubleSide;
                if(child.material.map) {
                    // child.material.map.encoding = sRGBEncoding;
                    child.material.map.minFilter = NearestFilter;
                    // child.material.map.magFilter = LinearFilter;
                    // child.material.map.anisotropy = Config.maxAnisotropy;
                    child.material.needsUpdate = true;
                }
                // child.castShadow = true;
                // child.receiveShadow = true;
            }
        } );

        if( particles ) {
            const p = modelDefinition.model.position;
            particles.particleGroup.mesh.position.set(p.x+2, p.y, p.z+2);
            // particles.emitter.position.value = new Vector3(p.x+3, p.y, p.z+4);
            // particles.particleGroup.emitters[0].position.value = particles.particleGroup.emitters[0].position.value;
            // particles.particleGroup.emitters[0].updateFlags.position = true;
        }

        let collisionGroup = [];
        if(model.name === "Keller") {
            // fake Geometry for pin occlusion
            const a = new Mesh(new BoxBufferGeometry(18, 5, 2));
            a.position.set(-8, -1, -5.5);

            const b = new Mesh(new BoxBufferGeometry(20, 7, 2));
            b.position.set(-8, -0.5, -19);

            const c = new Mesh(new BoxBufferGeometry(2, 5, 12));
            c.position.set(-17, -1, -12);

            const d = new Mesh(new BoxBufferGeometry(1, 8, 8));
            d.position.set(1.5, 0.5, -10);
            const e = new Mesh(new BoxBufferGeometry(1, 4.5, 8));
            e.position.set(-3, -1, -9);

            const f = new Mesh(new BoxBufferGeometry(20, 0.5, 12));
            f.position.set(-8,-4,-12);

            collisionGroup = [a, b, c, d, e, f];
            scene.add( ...collisionGroup);
            collisionGroup.forEach(mesh => {
                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
                mesh.material.visible = false
            });
        }
        
        interactionController.changeModel( 
            gltf, 
            modelDefinition,
            collisionGroup
        );

        scene.add( gltf.scene );
    });
}