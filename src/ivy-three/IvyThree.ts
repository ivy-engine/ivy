import IvyRenderer from "../ivy-core/renderer";
import { Box } from "../ivy-core/Elements/Box";
import { AmbientLight, BoxGeometry, DirectionalLight, HemisphereLight, Mesh, PCFSoftShadowMap, PerspectiveCamera, Scene, SpotLight, WebGLRenderer } from "three";

var scene = new Scene();
const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 400 );
camera.position.set( 0, 2, 16 );


scene.add( new AmbientLight( 0x666666 ) );

const light = new DirectionalLight( 0xdfebff, 1.75 );
light.position.set( 0, 8, 0 );

scene.add(light)

light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.far = 20;

// scene.add( new AxesHelper(500));

var renderer = new WebGLRenderer({
  antialias: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

export default class IvyThree implements IvyRenderer{
  constructor(element: HTMLElement) {
    this.mount(element);
  }

  mount(element: HTMLElement): void {
    renderer.setSize( window.innerWidth, window.innerHeight );
    element.appendChild( renderer.domElement );
  }

  drawBox(box: Box): Mesh {
    const {mesh} = box;
    mesh.material = box.material;
    mesh.castShadow = true; 
    mesh.receiveShadow = true; 
    scene.add( mesh );
    return mesh;
  }

  render(): void {
    renderer.render( scene, camera );
  }


  setSize(width: number, height: number): void {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
  }

  setPixelRatio(ratio: number): void {
    renderer.setPixelRatio( ratio );
  }
}