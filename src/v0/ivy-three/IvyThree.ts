import IvyRenderer, { IvyRendererOptions } from "../ivy-core/rendererrer";
import {
  AmbientLight,
  BoxGeometry,
  Camera,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  ShaderChunk,
  SpotLight,
  WebGLRenderer,
} from "three";
import initPCSS from "./shaders/PCSS/initPCSS";

// scene.add( new AxesHelper(500));

// renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

export default class IvyThree implements IvyRenderer {
  element: HTMLElement;
  renderer = new WebGLRenderer({
    antialias: true,
  });

  constructor(element: HTMLElement, options: IvyRendererOptions = {}) {
    if (options.shadowmapPreset === "pcss") {
      this.loadPCSS();
    }

    this.element = element;
    this.mount(element);
    this.renderer.shadowMap.enabled = true;
  }

  loadPCSS = () => {
    initPCSS();
  };

  mount(element: HTMLElement): void {
    this.renderer.setSize(element.clientWidth, element.clientHeight);
    element.appendChild(this.renderer.domElement);
  }

  render(scene: Object3D, camera: Camera): void {
    this.renderer.render(scene, camera);
  }

  setSize(width: number, height: number): void {
    this.renderer.setSize(width, height);
  }

  setPixelRatio(ratio: number): void {
    this.renderer.setPixelRatio(ratio);
  }
}
