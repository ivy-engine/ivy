import { Object3D, Vector3 } from "three";
import IScene from "../Scene/IScene";
import type IGroup from "./Elements/IGroup";

export interface IElOptions {
 pos?: Vector3 
}

export default class IEl {
  object?: Object3D; 
  parent?: IScene | IGroup;
  o: IElOptions;
  initiated = false;
  pos: Vector3; 

  constructor(options: IElOptions) {
    this.o = options;
    this.pos = options.pos ?? new Vector3();
  }
 
  init() {
    this.initiated = true;
   console.log('init', this) 
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

  dispose() {}
}