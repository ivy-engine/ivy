import IvyRenderer, { IvyRendererOptions } from "../ivy-core/renderer";
import { AmbientLight, BoxGeometry, Camera, DirectionalLight, HemisphereLight, Mesh, Object3D, PCFSoftShadowMap, PerspectiveCamera, Scene, ShaderChunk, SpotLight, WebGLRenderer } from "three";
import initPCSS from "./shaders/PCSS/initPCSS";

// scene.add( new AxesHelper(500));

// renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

export default class IvyThree implements IvyRenderer{
  renderer= new WebGLRenderer({
    antialias: true
  }); 
  constructor(element: HTMLElement, options: IvyRendererOptions = {}) {
    if (options.shadowmapPreset === 'pcss') {
      this.loadPCSS();
    }

    this.mount(element);
    this.renderer.shadowMap.enabled = true;
  }
 
  loadPCSS = () => {
    initPCSS();   
  }

  mount(element: HTMLElement): void {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    element.appendChild( this.renderer.domElement );
  }

  render(scene: Object3D, camera: Camera): void {
    this.renderer.render( scene, camera );
  }

  setSize(width: number, height: number): void {
    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  setPixelRatio(ratio: number): void {
    this.renderer.setPixelRatio( ratio );
  }
}