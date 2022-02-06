import {
  Camera,
  Clock,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";
import Stats from "stats.js";
import IScene from "./Scene/IScene";
import { OrbitControls } from "../../helpers/OrbitControls";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
const el = document.createElement("div");
el.id = "stats";
el.appendChild(stats.dom);
document.body.appendChild(el);

interface IvyOptions {
  target: HTMLElement;
  physics?: boolean;
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
  clock = new Clock();

  constructor(options: IvyOptions) {
    this.o = options;
    this.target = options.target;

    this.mainCamera = this.createCamera();
    this.setMainCamera(this.mainCamera);

    this.target = options.target;
    this.target.innerHTML = "";
    this.target.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;

    window.removeEventListener("resize", this.updateSize);
    window.addEventListener("resize", this.updateSize);
    this.updateSize();
  }

  createCamera(): Camera {
    const camera = new PerspectiveCamera();
    camera.position.z = 12;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);
    return camera;
  }

  loadScene(scene: IScene) {
    const initial = this.activeScene === undefined;
    this.activeScene?.dispose();
    this.activeScene = scene;
    scene.core = this;
    this.setMainCamera(this.mainCamera);
    scene.mount();

    if (initial) this.render();
  }

  render = () => {
    if (!this.activeScene) return;

    stats.begin();
    this.activeScene.render(this.clock);
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

  setMainCamera = (camera: Camera) => {
    this.mainCamera = camera;
    this.activeScene?.threeScene.remove(this.mainCamera);
    this.activeScene?.threeScene.add(this.mainCamera);
    this.controls?.dispose();

    if (this.activeScene?.controls === "orbit") {
      this.controls = new OrbitControls(
        this.mainCamera,
        this.renderer.domElement
      );
     
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.4;
      this.controls.screenSpacePanning = false;
    }

    this.updateSize();
  };
}
