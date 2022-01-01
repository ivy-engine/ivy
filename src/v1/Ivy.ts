import { Camera, Clock, PerspectiveCamera, WebGLRenderer } from "three";
import IvyScene from "./ivy-scene/IvyScene";
import Stats from "stats.js";
import { OrbitControls } from "./ivy-three/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { Pass } from "three/examples/jsm/postprocessing/Pass";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
const el = document.createElement("div");
el.id = "stats";
el.appendChild(stats.dom);
document.body.appendChild(el);

interface IvyOptions {
  target: HTMLElement;
}

export default class Ivy {
  target: HTMLElement;
  loadedSceneAt = 0;
  renderer = new WebGLRenderer({
    antialias: true,
  });
  mainCamera: Camera;
  scene?: IvyScene;
  alive = true;
  controls?: OrbitControls;
  clock = new Clock();
  composer?: EffectComposer;
  renderScene?: Pass;
  composerLayers: Pass[] = [];

  constructor(options: IvyOptions) {
    this.mainCamera = new PerspectiveCamera();
    this.resetCamera();

    this.target = options.target;
    this.target.innerHTML = "";
    this.target.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;

    window.removeEventListener("resize", this.updateSize);
    window.addEventListener("resize", this.updateSize);

    this.refresh();
  }

  resetCamera(): void {
    this.mainCamera = new PerspectiveCamera();
    this.mainCamera.position.z = 15;
    this.mainCamera.position.y = 5;
    this.mainCamera.lookAt(0, 0, 0);
    if (this.scene) {
      this.scene.threeScene.add(this.mainCamera);
      this.controls?.dispose();
      this.controls = new OrbitControls(
        this.mainCamera,
        this.renderer.domElement
      );
    } else {
      console.warn("No scene to add camera to");
    }
  }

  setMainCamera = (camera: Camera) => {
    this.mainCamera = camera;
    this.scene?.threeScene.remove(this.mainCamera);
    this.scene?.threeScene.add(this.mainCamera);
    this.controls?.dispose();
    this.controls = new OrbitControls(
      this.mainCamera,
      this.renderer.domElement
    );
    this.updateSize();
    this.setupComposer();
  };

  destroy = () => {
    this.alive = false;
    this.scene?.destroy();
    this.scene = undefined;
    this.target.innerHTML = "";
    window.removeEventListener("resize", this.updateSize);
    this.renderer.dispose();
  };

  loadScene = (scene: IvyScene) => {
    this.loadedSceneAt = Date.now();
    scene.loadedAt = this.loadedSceneAt;

    this.scene?.destroy();

    this.scene = scene;
    scene.core = this;


    this.resetCamera();
    this.updateSize();
    
    this.setupComposer();

    scene.mount();
    this.render();
  };

  setupComposer(): void {
    if (!this.scene) return;

    this.renderScene = new RenderPass(this.scene.threeScene, this.mainCamera);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);

    this.composerLayers = [this.renderScene];
  }

  render(): void {
    if (this.scene) {
      this.scene.update(this.clock);
      this.composer?.render();
    }
    if (this.controls) {
      this.controls.update?.();
    }
  }

  setSize(width: number, height: number): void {
    if (this.mainCamera instanceof PerspectiveCamera) {
      this.mainCamera.aspect = width / height;
      this.mainCamera.updateProjectionMatrix();
    }
    this.renderer.setSize(width, height);
    for (const layer of this.composerLayers) {
      layer.setSize(width, height);
    }
  }

  updateSize = () => {
    this.setSize(this.target.clientWidth, this.target.clientHeight);
  };

  setPixelRatio(ratio: number): void {
    this.renderer.setPixelRatio(ratio);
  }

  refresh = () => {
    stats.begin();
    if (this.scene) {
      this.render();
    }
    if (this.alive) requestAnimationFrame(this.refresh);
    stats.end();
  };
}
