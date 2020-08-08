// https://github.com/felixmariotto/three-screenshake
import { Vector3 } from "three";

export default class ScreenShake {
    constructor(camera) {

		// When a function outside ScreenShake handle the camera, it should
		// always check that ScreenShake.enabled is false before.
		this.enabled = false,
		this._timestampStart = undefined,
		this._timestampEnd = undefined,
		this._startPoint = undefined,
		this._endPoint = undefined,

		// update(camera) must be called in the loop function of the renderer,
		// it will re-position the camera according to the requested shaking.
		this.update = function update() {
			if ( this.enabled == true ) {
				const now = Date.now();
				if ( this._timestampEnd > now ) {
					let interval = (Date.now() - this._timestampStart) / 
						(this._timestampEnd - this._timestampStart) ;
					this.computePosition( interval );
				} else {
					camera.position.copy(this._startPoint);
					this.enabled = false;
				};
			};
		},

		// This initialize the values of the shaking.
		// vecToAdd param is the offset of the camera position at the climax of its wave.
		this.shake = function shake(vecToAdd, milliseconds) {
			this.enabled = true ;
			this._timestampStart = Date.now();
			this._timestampEnd = this._timestampStart + milliseconds;
			this._startPoint = new Vector3().copy(camera.position);
			this._endPoint = new Vector3().addVectors( camera.position, vecToAdd );
		},

		this.computePosition = function computePosition(interval) {

			// This creates the wavy movement of the camera along the interval.
			// The first bloc call this.getQuadra() with a positive indice between
			// 0 and 1, then the second call it again with a negative indice between
			// 0 and -1, etc. Variable position will get the sign of the indice, and
			// get wavy.
			if (interval < 0.4) {
				var position = this.getQuadra( interval / 0.4 );
			} else if (interval < 0.7) {
				var position = this.getQuadra( (interval-0.4) / 0.3 ) * -0.6;
			} else if (interval < 0.9) {
				var position = this.getQuadra( (interval-0.7) / 0.2 ) * 0.3;
			} else {
				var position = this.getQuadra( (interval-0.9) / 0.1 ) * -0.1;
			}
			
			// Here the camera is positioned according to the wavy 'position' variable.
			camera.position.lerpVectors( this._startPoint, this._endPoint, position );
		},

		// This is a quadratic function that return 0 at first, then return 0.5 when t=0.5,
		// then return 0 when t=1 ;
		this.getQuadra = function getQuadra(t) {
			return 9.436896e-16 + (4*t) - (4*(t*t)) ;
		}

	}

}