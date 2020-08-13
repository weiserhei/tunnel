import {
  PositionalAudio,
  AudioLoader,
  TextureLoader,
  Color,
  Vector3,
  AdditiveBlending,
} from "three";
import SPE from "shader-particle-engine";

import T_particle from "../../images/snowflake5.png";
// import cloud from "../../images/smokeparticle.png";
// import soundSteam from "../../media/steam_loop.ogg";
import S_spark from "../../media/256915__squashy555__arc-welding.ogg";

export default class Particles {
  constructor(scene, listener) {
    // Create particle group and emitter
    let particleGroup = new SPE.Group({
      texture: {
        value: new TextureLoader().load(T_particle),
      },
      maxParticleCount: 200,
      fog: false,
      maxAge: 0.4444444444444445,
      hasPerspective: 1,
      colorize: 1,
      transparent: 1,
      alphaTest: 0.5,
      depthWrite: false,
      depthTest: true,
      blending: AdditiveBlending,
    });

    const acceleration = new Vector3(-0.5, -0.5, 1);
    const velocity = new Vector3(0.5, -0.5, 0);

    let emitter = new SPE.Emitter({
      particleCount: 20,
      type: "sphere",
      maxAge: {
        value: 2,
      },
      duration: 0.1,
      position: {
        value: new Vector3(0, 0, -3),
        spread: new Vector3(0, 0, 0),
        radius: 0.02,
      },
      velocity: {
        value: velocity,
        spread: new Vector3(1, 1, 1),
      },
      acceleration: {
        value: acceleration,
      },
      wiggle: {
        spread: 1,
      },
      size: {
        value: [0.1, 0.1, 0],
        spread: 0.3,
      },
      opacity: {
        value: [1, 0.36664, 0],
      },
      color: {
        value: [new Color(0xf99501), new Color(0xffffff), new Color(0xffffff)],
        // spread: new Color(0.1, 0.1, 0.1),
      },
      angle: {
        value: [0, Math.PI / 2],
      },
    });

    emitter.disable();
    // particleGroup.addEmitter(emitter);
    particleGroup.addPool(5, emitter, false);
    scene.add(particleGroup.mesh);
    particleGroup.mesh.frustumCulled = false;
    this.emitter = emitter;
    this.particleGroup = particleGroup;

    this.stop = function () {
      emitter.disable();
      positionalAudio.stop();
    };

    const positionalAudio = new PositionalAudio(listener);
    const audioLoader = new AudioLoader();
    audioLoader.load(S_spark, function (buffer) {
      positionalAudio.setBuffer(buffer);
      positionalAudio.setLoop(false);
      positionalAudio.setVolume(3);
      particleGroup.mesh.add(positionalAudio);
      // positionalAudio.play();
    });

    this.start = function () {
      positionalAudio.play();
      // emitter.enable();
      particleGroup.triggerPoolEmitter(1);
    };

    this.update = function (delta) {
      if (particleGroup) {
        particleGroup.tick(delta);
      }
    };
  }
}
