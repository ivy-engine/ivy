import { Camera, Clock, Euler, Scene, Vector3 } from "three";
import IEl from "../El/IEl";
import Ivy from "../Ivy";
import * as CANNON from "cannon-es";

interface ISceneOptions {
  camera?: Camera;
  controls?: "orbit";
  physics?: boolean;
  onReady?: (scene: IScene) => void; 
}

export default class IScene {
  o: ISceneOptions;
  mounted = false;
  threeScene = new Scene();
  elList: IEl[] = [];
  core?: Ivy;
  controls?: string;
  world?: CANNON.World;

  constructor(options: ISceneOptions = {}) {
    this.o = options;
    this.controls = options.controls || "orbit";

    if (options.physics) {
      const world = new CANNON.World();
      this.world = world;
      world.gravity.set(0, -9.82, 0);
      world.broadphase = new CANNON.NaiveBroadphase();
      (world.solver as CANNON.GSSolver).iterations = 20;
      (world.solver as CANNON.GSSolver).tolerance = 10;
      world.allowSleep = true
    }
  }

  add(...els: IEl[]) {
    for (let el of els) {
      this.elList.push(el);
      el.parent = this;
      el.init();
    }
  }

  mount() {
    this.o.onReady?.(this);
    if (this.mounted) return;
    
    const camera = this.o.camera || this.core?.createCamera();

    this.mounted = true;
    if (camera) this.core?.setMainCamera(camera);
    this.elList.forEach((el) => el.mount(this));
  }

  render(clock: Clock) {
    if (!this.core || !this.mounted) return;
    const delta = this.core.clock.getDelta();
    this.world?.step(delta);

    this.elList.forEach((el) => el.render(el, delta, clock));
  }

  remove(el: IEl) {
    this.elList.splice(this.elList.indexOf(el), 1);
  }

  removeAll() {
    this.elList = [];
  }

  dispose() {
    this.mounted = false;
    for (let el of this.elList) {
      el.dispose();
    }
  }
}
