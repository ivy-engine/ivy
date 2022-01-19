import { Euler, Object3D, Vector3 } from "three";
import IScene from "../Scene/IScene";
import type IGroup from "./Elements/IGroup";

export interface IElOptions {
  pos?: Vector3; 
  rot?: Euler;
  update?: (el: IEl) => void; 
}

export default class IEl {
  object?: Object3D; 
  parent?: IScene | IGroup;
  o: IElOptions;
  initiated = false;
  pos: Vector3; 
  rot: Euler; 

  constructor(options: IElOptions) {
    this.o = options;
    this.pos = options.pos ?? new Vector3();
    this.rot = options.rot ?? new Euler();
   
    this.update = options.update;
  }
 
  init() {
    this.initiated = true;
    console.log('init', this) 
    
    if (!this.object) return;
    this.object.position.copy(this.pos);
    this.pos = this.object.position;

    this.object.rotation.copy(this.rot);
    this.rot = this.object.rotation;
  }
 
  mount() {
    if (!this.object) return;
    
    if (this.parent instanceof IScene) { 
      this.parent.threeScene.add(this.object);
    } else if (typeof this.parent?.group !== 'undefined') { 
      this.parent.group.add(this.object);
    }
  }
 
  clone(options: IElOptions = {}) {
    return new IEl({ ...this.o, ...options });
  }

  dispose() { }
 
  update?: (el: IEl) => void;
}