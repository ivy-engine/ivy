import { Camera, Clock, Euler, Scene, Vector3 } from "three";
import IEl from "../El/IEl";
import Ivy from "../Ivy";

interface ISceneOptions {
  camera?: Camera;
  controls?: "orbit";
}

export default class IScene {
  o: ISceneOptions;
  threeScene = new Scene();
  elList: IEl[] = [];
  core?: Ivy;
  controls?: string;

  constructor(options: ISceneOptions = {}) {
    this.o = options;
    this.controls = options.controls || "orbit";
  }

  add(...els: IEl[]) {
    for (let el of els) {
      this.elList.push(el);
      el.parent = this;
      el.init();
    }
  }

  mount() {
    const camera = this.o.camera || this.core?.createCamera();
    if (camera) this.core?.setMainCamera(camera);

    this.elList.forEach((el) => el.mount(this));
  }

  render(clock: Clock) {
    this.elList.forEach((el) => el.render(el, clock));
  }

  remove(el: IEl) {
    this.elList.splice(this.elList.indexOf(el), 1);
  }

  removeAll() {
    this.elList = [];
  }

  dispose() {
    for (let el of this.elList) {
      el.dispose();
    }
  }
}
