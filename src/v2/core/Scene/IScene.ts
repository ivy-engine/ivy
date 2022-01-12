import { Scene } from "three";
import IEl from "../El/IEl";
import Ivy from "../Ivy";

interface ISceneOptions {
}

export default class IScene {
  o: ISceneOptions;
  threeScene = new Scene(); 
  elList: IEl[] = []; 
  core?: Ivy;

  constructor(options: ISceneOptions = {}) {
    this.o = options;
  }
 
  add(...els: IEl[]) {
    for (let el of els) {
      this.elList.push(el);
      el.parent = this; 
      el.init(); 
    }
  }
 
  mount() { 
    this.elList.forEach(el => el.mount());
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