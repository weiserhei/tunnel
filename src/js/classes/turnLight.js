import {
    Mesh,
    Matrix4,
    SpotLight,
    SphereGeometry,
    CylinderBufferGeometry,
    MeshLambertMaterial,
    Vector3
} from "three";

import Config from '../../data/config';

export default class TurnLight {
    constructor(block) {

        const zpos = 0;
        // const zpos = counter * depth - 1;
        const ypos = 2.4;
        const xpos = 0;
    
        const spotLight = new SpotLight(0xff4400, 1, 8, Math.PI/2.5, 1, 1 );
        let temp = 0;
        spotLight.userData.update = function(delta) {
            // x.rotateZ += 0.1;
            temp += delta * 4;
            spotLight.target.position.z = zpos + Math.cos(temp);
            // x.target.position.y = ypos + Math.sin(counter);
            spotLight.target.position.x = xpos + Math.sin(temp);
        }
        spotLight.position.set(xpos, ypos-0.1, zpos);
        spotLight.target.position.set(xpos,ypos-1,zpos);
        block.add( spotLight );
        block.add( spotLight.target );

        // const darkSide = new THREE.BoxGeometry(0.05, 0.2, 0.1);
        const darkSide = new SphereGeometry(0.1, 16, 16);
        darkSide.applyMatrix( new Matrix4().makeTranslation( -0.025, 0, 0 ));
        const lightSide = darkSide.clone();
        const matrix = new Matrix4().makeTranslation( 0.025, 0, 0 );
        darkSide.merge(lightSide, matrix, 6);
        const lightMaterial = new MeshLambertMaterial({ color:0x884400, emissive: 0xff8800 });
        const darkMaterial = new MeshLambertMaterial({ color: 0x000000, emissive: 0x000000 });
        const baseMat = new MeshLambertMaterial({ color: 0x555555, emissive: 0x000000 });
        
        const turnLight = new Mesh( darkSide, [
            lightMaterial, lightMaterial, lightMaterial, lightMaterial, lightMaterial, lightMaterial,
            darkMaterial, darkMaterial, darkMaterial, darkMaterial, darkMaterial, darkMaterial,
        ] );
        // light.geometry.faces.forEach(function(face) {face.materialIndex = 0; console.log("fa", face)});
        turnLight.position.set(0, -0.1, 0);
    
        const base = new Mesh(new CylinderBufferGeometry(0.25, 0.20, 0.15, 16, 4), baseMat);
        block.add(base);
        base.add(turnLight);
        base.position.set(0, 2.37, zpos);
        const tempVec = new Vector3();

        this.update = function(delta) {
            spotLight.userData.update(delta);
            // turnLight.lookAt(spotLight.target.position.x, turnLight.position.y, spotLight.target.position.z);
            turnLight.lookAt(spotLight.target.getWorldPosition(tempVec).x, turnLight.position.y, spotLight.target.getWorldPosition(tempVec).z);
        }

    }
}