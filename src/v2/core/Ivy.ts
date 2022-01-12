import { Camera, PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "../../v1/ivy-three/controls/OrbitControls";
import Stats from "stats.js";
import IScene from "./Scene/IScene";

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
  o: IvyOptions;
  activeScene?: IScene;
  target: HTMLElement;
  controls?: OrbitControls;
  renderer = new WebGLRenderer({
    antialias: true,
  });
  mainCamera: Camera;

  constructor(options: IvyOptions) {
    this.o = options;
    this.target = options.target;
    this.mainCamera = new PerspectiveCamera();
    this.mainCamera.position.z = 15;
    this.mainCamera.position.y = 8;

    this.controls = new OrbitControls(
      this.mainCamera,
      this.renderer.domElement
    );

    this.target = options.target;
    this.target.innerHTML = "";
    this.target.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;

    window.removeEventListener("resize", this.updateSize);
    window.addEventListener("resize", this.updateSize);
    this.updateSize();

    // this.refresh();
  }

  loadScene(scene: IScene) {
    const initial = this.activeScene === undefined;
    this.activeScene = scene;
    scene.core = this;
    scene.mount();
    
    console.log('load scene')
    if (initial) this.render();
  }

  render = () => {
    if (!this.activeScene) return;

    stats.begin();
    this.renderer.render(this.activeScene.threeScene, this.mainCamera);
    stats.end();

    requestAnimationFrame(this.render);
  };

  dispose() {
    this.activeScene?.dispose();
    this.activeScene = undefined;
  }

  updateSize = () => {
    this.setSize(this.target.clientWidth, this.target.clientHeight);
  };

  setSize(width: number, height: number): void {
    if (this.mainCamera instanceof PerspectiveCamera) {
      this.mainCamera.aspect = width / height;
      this.mainCamera.updateProjectionMatrix();
    }
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}
