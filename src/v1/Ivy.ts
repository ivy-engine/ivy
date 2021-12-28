import { PerspectiveCamera, WebGLRenderer } from "three";
import IvyScene from "./ivy-scene/IvyScene";
import Stats from "stats.js";
import { OrbitControls } from "../v0/ivy-three/controls/OrbitControls";

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
  mainCamera: PerspectiveCamera;
  scene?: IvyScene;


  constructor(options: IvyOptions) {
    this.mainCamera = new PerspectiveCamera();
    this.mainCamera.position.z = -15; 
    this.mainCamera.position.y = 5; 
    this.mainCamera.lookAt(0, 0, 0); 

    this.target = options.target;
    this.mount();
    this.renderer.shadowMap.enabled = true;
    window.removeEventListener("resize", this.updateSize);
    window.addEventListener("resize", this.updateSize);
  }
 
  updateSize = () => {
      this.setSize(this.target.clientWidth, this.target.clientHeight);
  }

  loadScene = (scene: IvyScene) => {
    this.loadedSceneAt = Date.now();
    const sameScene = scene.loadedAt === this.loadedSceneAt;
    this.scene?.destroy();

    this.scene = scene;
    scene.core = this;

    if (!sameScene) {
      scene.loadedAt = Date.now();
      scene.threeScene.add(this.mainCamera);
      scene.mount();
    }
   
   
    if (!window.ivyRunning) {
      this.refresh();
      window.ivyRunning = true;
      new OrbitControls(this.mainCamera, this.target);
    }
  }

  mount(): void {
    this.setSize(this.target.clientWidth, this.target.clientHeight);
    this.target.appendChild(this.renderer.domElement);
  }

  render(): void {
    if (this.scene) {
      this.scene.update();
      this.renderer.render(this.scene.threeScene, this.mainCamera);
    }
  }

  setSize(width: number, height: number): void {
    this.mainCamera.aspect = width / height
    this.mainCamera.updateProjectionMatrix()
    this.renderer.setSize(width, height);
  }

  setPixelRatio(ratio: number): void {
    this.renderer.setPixelRatio(ratio);
  }
 
  refresh = () => {
    stats.begin();
    if (this.scene) {
      this.render();
      requestAnimationFrame(this.refresh);
    }
    stats.end();
  };
}