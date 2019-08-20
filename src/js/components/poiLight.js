import { SpotLight, SpotLightHelper, Scene } from "three";
import Config from '../../data/config';

export default class PoiLight {
    constructor() {

        const spotlight = new SpotLight(
            Config.spotlight.color,
            Config.spotlight.intensity,
            Config.spotlight.distance,
            Config.spotlight.angle,
            Config.spotlight.penumbra
        );
        spotlight.position.set(Config.spotlight.x, Config.spotlight.y, Config.spotlight.z);
        // spotlight.intensity = 0;
        spotlight.castShadow = Config.spotlight.castShadow;
    
        // spotlight.shadow.mapSize.width = 2048;  // default
        // spotlight.shadow.mapSize.height = 2048; // default
        // spotlight.shadow.camera.near = 0.5;       // default
        // spotlight.shadow.camera.far = 50      // default
        return spotlight;
    }
}