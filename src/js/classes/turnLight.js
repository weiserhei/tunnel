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

        const tlc = Config.turnLight;
        const ypos = Config.block.height;
    
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
            spotLight.target.position.z = tlc.position.z + Math.cos(temp);
            // spotLight.target.position.y = ypos + Math.sin(temp * 2);
            // spotLight.target.position.y = ypos + 2;
            spotLight.target.position.x = tlc.position.x + Math.sin(temp);
        }
        spotLight.position.set(tlc.position.x, ypos, tlc.position.z);
        spotLight.target.position.set( tlc.position.x,ypos-1.5,tlc.position.z );
        block.add( spotLight );
        block.add( spotLight.target );

        const size = 0.08;
        const darkSide = new SphereGeometry(size, 16, 16);
        const matrix = new Matrix4().makeTranslation( 0, 0, -0.01 );
        darkSide.merge(darkSide, matrix, 1);
        const lightMaterial = new MeshLambertMaterial({ color:0x444444, emissive: tlc.material.emissive });
        const darkMaterial = new MeshLambertMaterial({ color: 0x442200, emissive: 0x050500 });
        const bulb = new Mesh( darkSide, [
            lightMaterial, darkMaterial
        ] );
        // light.geometry.faces.forEach(function(face) {face.materialIndex = 0; console.log("fa", face)});
        bulb.position.set(0, -size, 0);
        
        const baseMat = new MeshLambertMaterial({ color: 0x888888, emissive: 0x000000 });
        const base = new Mesh(new CylinderBufferGeometry(size*2+0.1, size*2, size+0.05, 8, 2), baseMat);
        block.add(base);
        base.add(bulb);
        base.position.set( tlc.position.x, ypos, tlc.position.z );
        base.matrixAutoUpdate = false;
        base.updateMatrix();
        const tempVec = new Vector3();

        this.on = function() {
            lightMaterial.emissive.setHex(tlc.material.emissive);
            spotLight.intensity = tlc.intensity;
            this.turning = true;
        }

        this.off = function() {
            lightMaterial.emissive.setHex(tlc.material.offEmissive);
            spotLight.intensity = 0;
            this.turning = false;
        }

        this.update = function(delta) {
            if (!this.turning) return;
            spotLight.userData.update(delta);
            bulb.lookAt(spotLight.target.getWorldPosition(tempVec).x, ypos-0.5, spotLight.target.getWorldPosition(tempVec).z);
            // bulb.lookAt(spotLight.target.getWorldPosition(tempVec));
        }

    }
}