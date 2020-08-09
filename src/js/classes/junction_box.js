import {
    Mesh,
    BoxBufferGeometry,
    MeshPhongMaterial,
    CircleBufferGeometry,
    TubeBufferGeometry,
    Color,
    Vector3,
    CatmullRomCurve3,
    PlaneBufferGeometry,
    MeshNormalMaterial,
} from "three";
import TWEEN from '@tweenjs/tween.js';

import Config from '../../data/config';


export default class JunctionBox {
    constructor(material, sound) {

        // const pc = Config.pipe;

        const emergency_color = new Color(0xAA5555);
        // const normal_color = new Color(0xFF8800);
        const normal_color = new Color(0xAAAA55);
        // const normal_color = new Color(0xFFFF66);
        // const normal_color = new Color(0xffff00);
        // const normal_color = new Color(0x55FF55);

        const width = Config.block.width;
        const height = Config.block.height;

        const mesh = new Mesh(new BoxBufferGeometry(0.1, 0.6, 0.45), material.clone());
        mesh.material.color.set(0xCCCCCC);
        mesh.material.map = undefined;
        
        // x.position.set(-width/2, 1.4, 6);
        
        // window.addEventListener('resize', replace, false);
        function replace() {
            if(window.innerHeight > window.innerWidth){
                mesh.position.set(-width/2, height/2 + 0.2, 1);
            } else {
                mesh.position.set(-width/2, height/2 + 0.2, -1);
            }
        }
        replace();

        const button_normal_color = normal_color.clone();
        const button_emergency_color = emergency_color.clone();
        const buttonMaterial = new MeshPhongMaterial({});
        const button = new Mesh(new BoxBufferGeometry(0.2, 0.1, 0.3), buttonMaterial);
        mesh.userData.button = button;
        // button.material.emissive = normal_color;
        // const button = new Mesh(new BoxBufferGeometry(0.2, 0.1, 0.3), new MeshPhongMaterial({ }));
        button.layers.enable( 1 );
        mesh.add( button );
        button.material.emissive = button_normal_color;

        let tween = new TWEEN.Tween(button_normal_color)
            // .to(new Color(0x55FF555), 2000)
            .to(new Color(0x33AA33), 2000)
            .yoyo( true )
            .repeat( Infinity )
            .easing(TWEEN.Easing.Quartic.In)

        let emergency_tween = new TWEEN.Tween(button_emergency_color)
            .to(new Color(0xFF3333), 2000)
            .yoyo( true )
            .repeat( Infinity )
            .easing(TWEEN.Easing.Quartic.In)

        // tween.chain(tweenBack);
        // emergency_tween.start();
        tween.start();

        button.userData.normal = function() {
            emergency_tween.stop();
            // button.material.emissive = normal_color;
            button.material.emissive = button_normal_color;
            tween.start();
        }

        button.userData.emergency = function() {
            tween.stop();
            button.material.emissive = button_emergency_color;
            emergency_tween.start();
        }

        button.userData.isAnimating = false;
        button.userData.move = function(reverse) {
            if(this.isAnimating) {
                return;
            }
            this.isAnimating = true;
            sound[0].play();
            new TWEEN.Tween(button.position).to({
                x: -0.03
            }, 200)
            .easing( TWEEN.Easing.Elastic.Out )
            .yoyo(true)
            .repeat(1)
            .onStart(() => {
                    if(reverse) {
                        button.userData.normal();
                    } else {
                        button.userData.emergency();
                    }
            })
            .onComplete(() => {
                this.isAnimating = false
            })
            .start();
        }

        mesh.userData.emergency = function() {
            circle.material.emissive.set(emergency_color);
            m.material.emissive.set(emergency_color);
            line.userData.emergency();
            button.userData.emergency();
        }
        mesh.userData.normal = function() {
            circle.material.emissive.set(normal_color);
            m.material.emissive.set(normal_color);
            line.userData.normal();
            button.userData.normal();
        }

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        let circle_geometry = new CircleBufferGeometry( 0.01, 32 );
        var circle = new Mesh( circle_geometry, new MeshPhongMaterial({ emissive: normal_color }) );
        circle.rotation.y = Math.PI/2;
        // circle.position.set(0.051, 0.05, 0.15);
        // circle.position.set(0.051, 0.15, 0);
        circle.position.set(0.051, -0.15, 0);
        mesh.add( circle );

        let geometry = new PlaneBufferGeometry(0.2, 0.02);
        var m = new Mesh( geometry, new MeshPhongMaterial({ emissive: normal_color }) );
        m.rotation.y = Math.PI/2;
        m.position.set(0.051, 0.2, 0);
        mesh.add( m );

        var points = [
            new Vector3(0, -0.5, -10), 
            new Vector3(0, 0, -10), 
            new Vector3(0, 0, -0.4), 
            new Vector3(0.01, 1.1, 0.1), 
        ];

        var spline = new CatmullRomCurve3( points, false, "catmullrom", 0.2 );

        var tubeGeometry = new TubeBufferGeometry( spline, 300, 0.01, 12, false );
        var cable_material = new MeshPhongMaterial( { color : 0x999999, emissive: 0x999955 } );
        // var cable_material = new MeshPhongMaterial( { color : 0x999999, emissive: normal_color } );
        var line = new Mesh( tubeGeometry, cable_material );
        // line.position.set(-width/2-0.0, 0.2, 1);
        line.position.set(0, -height/2, 0);

        line.userData.emergency = function() {
            // line.material.emissive.set(0xAA5555);
            // line.material.emissive.set(0x999955);
            line.material.emissive.set(material.emissive);
        }
        line.userData.normal = function() {
            // line.material.emissive.set(material.emissive);
            line.material.emissive.set(0x999955);
        }
        mesh.add(line);

        // Position and THREE.Color Data

        // var positions = [];
        // var colors = [];
        // var points = GeometryUtils.hilbert3D( new Vector3( 0, 0, 0 ), 1.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );

        // var divisions = Math.round( 12 * points.length );
        // var point = new Vector3();
        // var color = new Color();

        // for ( var i = 0, l = divisions; i < l; i ++ ) {
        //     var t = i / l;
        //     spline.getPoint( t, point );
        //     positions.push( point.x, point.y, point.z );
        //     color.setHSL( t, 1.0, 0.5 );
        //     colors.push( color.r, color.g, color.b );
        // }

        // var geometry = new BufferGeometry().setFromPoints( points );
        // var material = new LineBasicMaterial( { color : 0x000000, emissive: 0xFFFFFF } );
        // var splineObject = new Line( geometry, material );


        // Line2 ( LineGeometry, LineMaterial )
        // var geometry = new LineGeometry();
        // geometry.setPositions( positions );
        // geometry.setColors( colors );

        // let matLine = new LineMaterial( {
        //     color: 0xffffff,
        //     linewidth: 2, // in pixels
        //     vertexColors: false,
        //     //resolution:  // to be set by renderer, eventually
        //     dashed: false
        // } );

        // let line = new Line2( geometry, matLine );
        // line.computeLineDistances();
        // line.scale.set( 1, 1, 1 );

            
        // const perlin = new ImprovedNoise();

        // var worldWidth = 256, worldDepth = 256,
        //             worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
        
        // var data = generateHeight( worldWidth, worldDepth );
        // var geometry = new PlaneBufferGeometry( 10, 30, worldWidth - 1, worldDepth - 1 );
        // // geometry.rotateZ( -Math.PI / 2 );
        // geometry.rotateX( -Math.PI / 2 );

        // var vertices = geometry.attributes.position.array;

        // for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        //     vertices[ j + 1 ] = data[ i ] * 0.01;
        // }

        // let mesh = new Mesh( geometry, new MeshPhongMaterial( { emissive: 0xffffff, color:0x000000} ) );
        // mesh.position.set(0, -0.3, 0);
        // scene.add( mesh );

        // function generateHeight( width, height ) {
        //     var size = width * height, data = new Uint8Array( size ),
        //         perlin = new ImprovedNoise(), quality = 1, 
        //         // z = Math.random();
        //         z = Math.random() * 10;
        //     for ( var j = 0; j < 4; j ++ ) {
        //         for ( var i = 0; i < size; i ++ ) {
        //             var x = i % width, y = ~ ~ ( i / width );
        //             data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
        //         }
        //         quality *= 5;
        //     }
        //     return data;
        // }


        return mesh;

    }
}