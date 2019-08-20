import { MeshBasicMaterial, TextureLoader, PlaneGeometry, Mesh } from "three";
import groundfloor from "../../images/rundgang_start.png";

export default function floormesh( loadingManager ) {
    const tloader = new TextureLoader(loadingManager);
    // var material = new THREE.MeshLambertMaterial({
    const material = new MeshBasicMaterial({
        map: tloader.load(groundfloor)
    });
    const geometry = new PlaneGeometry(100, 100*.5);
    const mesh = new Mesh(geometry, material);
    mesh.rotateX(-Math.PI/2);
    mesh.visible = false;
    // mesh.rotateZ(Math.PI/2);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    return mesh;
}