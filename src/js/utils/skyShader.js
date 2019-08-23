import { Vector3 } from "three";
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import Config from '../../data/config';

export default function skyShader() {

    const skyConfig = Config.sky;

    const sky = new Sky();
    sky.scale.setScalar( skyConfig.size );
    
    var uniforms = sky.material.uniforms;
    uniforms[ "turbidity" ].value = skyConfig.turbidity;
    uniforms[ "rayleigh" ].value = skyConfig.rayleigh;
    uniforms[ "luminance" ].value = skyConfig.luminance;
    uniforms[ "mieCoefficient" ].value = skyConfig.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = skyConfig.mieDirectionalG;
    uniforms[ "sunPosition" ].value.copy( new Vector3(skyConfig.sunPosition.x,skyConfig.sunPosition.y,skyConfig.sunPosition.z) );

    return sky;

}