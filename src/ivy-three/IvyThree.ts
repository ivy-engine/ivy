import IvyRenderer, { IvyRendererOptions } from "../ivy-core/renderer";
import { Box } from "../ivy-core/Elements/Box";
import { AmbientLight, BoxGeometry, Camera, DirectionalLight, HemisphereLight, Mesh, Object3D, PCFSoftShadowMap, PerspectiveCamera, Scene, ShaderChunk, SpotLight, WebGLRenderer } from "three";
import initPCSS from "./shaders/PCSS/initPCSS";

// scene.add( new AxesHelper(500));

var renderer = new WebGLRenderer({
  antialias: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

export default class IvyThree implements IvyRenderer{
  constructor(element: HTMLElement, options: IvyRendererOptions = {}) {
    if (options.shadowmapPreset === 'pcss') {
      this.loadPCSS();
    }

    this.mount(element);
  }
 
  loadPCSS = () => {
    initPCSS();   
  }

  mount(element: HTMLElement): void {
    renderer.setSize( window.innerWidth, window.innerHeight );
    element.appendChild( renderer.domElement );
  }

  render(scene: Object3D, camera: Camera): void {
    renderer.render( scene, camera );
  }

  setSize(width: number, height: number): void {
    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();

    renderer.setSize( width, height );
  }

  setPixelRatio(ratio: number): void {
    renderer.setPixelRatio( ratio );
  }
}