import {
    Mesh,
    Matrix4,
    SpotLight,
    SphereGeometry,
    CylinderBufferGeometry,
    MeshLambertMaterial,
    Vector3,
    MeshBasicMaterial,
} from "three";

import Config from '../../data/config';

export default class TurnLight {
    constructor(block, counter) {

        this.turning = true;

        const zpos = 4;
        // const zpos = counter * depth - 1;
        const ypos = 2.4;
        const xpos = 0;
    
        const spotLight = new SpotLight(
            Config.turnLight.color,
            Config.turnLight.intensity,
            Config.turnLight.distance,
            Config.turnLight.angle,
            Config.turnLight.exponent,
            Config.turnLight.decay );
        let temp = counter * Math.PI / 2;
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
        // darkSide.applyMatrix( new Matrix4().makeTranslation( 0, 0, 0.025 ));
        const lightSide = darkSide.clone();
        const matrix = new Matrix4().makeTranslation( 0, 0, -0.01 );
        darkSide.merge(lightSide, matrix, 1);
        // const lightMaterial = new MeshLambertMaterial({ color:0x884400, emissive: 0xff8800 });
        const lightMaterial = new MeshLambertMaterial({ color:0x884400, emissive: Config.turnLight.material.emissive });
        const darkMaterial = new MeshLambertMaterial({ color: 0x442200, emissive: 0x050500 });
        const baseMat = new MeshLambertMaterial({ color: 0x555555, emissive: 0x000000 });
        
        const bulb = new Mesh( darkSide, [
            lightMaterial, darkMaterial
            // lightMaterial, lightMaterial, lightMaterial, lightMaterial, lightMaterial, lightMaterial,
            // darkMaterial, darkMaterial, darkMaterial, darkMaterial, darkMaterial, darkMaterial,
        ] );
        // light.geometry.faces.forEach(function(face) {face.materialIndex = 0; console.log("fa", face)});
        bulb.position.set(0, -.1, 0);
    
        const base = new Mesh(new CylinderBufferGeometry(0.25, 0.20, 0.15, 16, 4), baseMat);
        block.add(base);
        base.add(bulb);
        base.position.set(0, 2.37, zpos);
        const tempVec = new Vector3();

        this.on = function() {
            lightMaterial.emissive.setHex(0xFF8800);
            spotLight.intensity = 1;
            this.turning = true;
        }

        this.off = function() {
            lightMaterial.emissive.setHex(0x050500);
            spotLight.intensity = 0;
            this.turning = false;
        }

        this.update = function(delta) {
            if (!this.turning) return;
            spotLight.userData.update(delta);
            bulb.lookAt(spotLight.target.getWorldPosition(tempVec).x, bulb.position.y+2, spotLight.target.getWorldPosition(tempVec).z);
        }

    }
}