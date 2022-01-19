import { Camera, Scene } from "three";
import IEl from "../El/IEl";
import Ivy from "../Ivy";

interface ISceneOptions {
  camera?: Camera; 
  controls?: 'orbit';
}

export default class IScene {
  o: ISceneOptions;
  threeScene = new Scene(); 
  elList: IEl[] = []; 
  core?: Ivy;
  controls?: string;

  constructor(options: ISceneOptions = {}) {
    this.o = options;
    this.controls = options.controls || 'orbit';
  }
 
  add(...els: IEl[]) {
    for (let el of els) {
      this.elList.push(el);
      el.parent = this; 
      el.init(); 
    }
  }
 
  mount() { 
    if (this.o.camera) {
      this.core?.setMainCamera(this.o.camera); 
    }

    this.elList.forEach(el => el.mount());
    // if (this.core && this.o.camera) {
    //  console.log(this.core, this.o.camera) 
    //   this.core.mainCamera = this.o.camera;
    // }
  }
 
  render() {
    this.elList.forEach(el => el.update?.(el));
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