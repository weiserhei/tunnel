import { PointLight } from "three";
import Config from '../../data/config';

export default class Pointlight {
    constructor() {
        // Point light
        const pointLight = new PointLight(
            Config.pointLight.color,
            Config.pointLight.intensity,
            Config.pointLight.distance
        );
        pointLight.position.set(Config.pointLight.x, Config.pointLight.y, Config.pointLight.z);
        pointLight.intensity = 0;
        pointLight.castShadow = Config.pointLight.castShadow;
    
        pointLight.shadow.mapSize.width = 2048;  // default
        pointLight.shadow.mapSize.height = 2048; // default
        pointLight.shadow.camera.near = 0.5;       // default
        pointLight.shadow.camera.far = 50      // default

        return pointLight;
    }
}