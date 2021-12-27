import IvyRenderer from "./renderer";
import IvyScene from "./Scene/IvyScene";
import Stats from "stats.js";
import IvyThree from "../v0/ivy-three/IvyThreeree";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
const el = document.createElement("div");
el.id = "stats";
el.appendChild(stats.dom);
document.body.appendChild(el);

interface IvyCoreOptions {
  renderer: IvyThree;
}

export default class IvyCore {
  private options: IvyCoreOptions;
  element: HTMLElement;
  activeScene?: IvyScene;
  running = false;

  constructor(options: IvyCoreOptions) {
    this.options = options;
    this.element = options.renderer.loadPCSS;
    this.init();
  }

  init() {
    this.setupResponsiveScreen();
  }

  loadScene = (scene: IvyScene) => {
    this.activeScene?.discard();
    this.activeScene = scene;
    this.activeScene.create({ renderer: this.options.renderer });
    if (!this.running) {
      this.running = true;
      this.refresh();
    }
  };

  refresh = () => {
    stats.begin();
    if (this.activeScene) {
      const camera = this.activeScene.camera;
      if (!camera || !camera.object) return;

      this.activeScene.render();
      this.options.renderer.render(this.activeScene.rawScene, camera.object);
      requestAnimationFrame(this.refresh);
    }
    stats.end();
  };

  setupResponsiveScreen = () => {
    const el = this.options.renderer.element;
    this.options.renderer.setSize(el.clientWidth, el.clientHeight);
    this.options.renderer.setPixelRatio(window.devicePixelRatio);
  };
}
