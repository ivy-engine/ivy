import { Clock, Euler, Object3D, Vector3 } from "three";
import IScene from "../Scene/IScene";
import * as CANNON from "cannon-es";
import type IGroup from "./Elements/IGroup";
import { Vec3 } from "cannon-es";

export interface IElOptions {
  pos?: Vector3;
  rot?: Euler;
  update?: (el: IEl) => void;
  name?: string;
  staticBody?: boolean;
  physicsMaterial: CANNON.Material; 
  // updatePhysics?: (el: IEl) => void;
}

export default class IEl {
  name: string; 
  object?: Object3D;
  parent?: IScene | IGroup;
  o: IElOptions;
  initiated = false;
  mounted = false; 
  scene?: IScene;
  pos: Vector3;
  rot: Euler;
  staticBody = false; 
  body?: CANNON.Body;

  constructor(options: IElOptions) {
    this.name = options.name ?? "";
    this.o = options;
    this.update = options.update;
    this.pos = options.pos ?? new Vector3();
    this.rot = options.rot ?? new Euler();
    this.staticBody = options.staticBody ?? false;
  }

  init() {
    this.initiated = true;
    if (!this.object) return;
    this.object.position.copy(this.pos);
    this.pos = this.object.position;

    this.object.rotation.copy(this.rot);
   
  }

  mount(scene: IScene) {
    if (this.mounted) return;
    if (!this.object) return;
    this.scene = scene;

    if (this.parent instanceof IScene) {
      this.parent.threeScene.add(this.object);
    } else if (typeof this.parent?.group !== "undefined") {
      this.parent.group.add(this.object);
    }
  }

  getLocalBodyPosition = (pos: Vec3): Vector3 => {
    const { x, y, z } = pos;
    const parentPos =
      this.object?.parent?.getWorldPosition(new Vector3()) ?? new Vector3();
    return new Vector3(
      x - parentPos.x ?? 0,
      y - parentPos.y ?? 0,
      z - parentPos.z ?? 0
    );
  };

  // clone(options: IElOptions = {}) {
  //   return new IEl({ ...this.o, ...options });
  // }

  dispose() {
    this.mounted = false;
  }

  render(el: IEl, clock: Clock) {
    this.updatePhysics?.(el, clock);
    this.update?.(el, clock);
  }

  updatePhysics?: (el: IEl, clock: Clock) => void;
  update?: (el: IEl, clock: Clock) => void;
}
