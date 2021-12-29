import { AmbientLight, BoxGeometry, Camera, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, PerspectiveCamera, Scene } from "three";
import Ivy from "../Ivy";
import IvyObject from "../ivy-object/IvyObject";
import destroyObject from "../lib/destroyObject";

interface IvySceneOptions {
  physics?: boolean;
  gravity?: number;
  controls?: "orbit";
}

export default class IvyScene {
  loadedAt: number;
  name: string;
  options: IvySceneOptions;
  objectStack: IvyObject[] = [];
  threeScene = new Scene();
  core?: Ivy; 
  mounted = false; 
  onMount?: (camera: Camera) => void;
  onDestroy?: () => void;

  constructor(name: string, options: IvySceneOptions = {}) {
    this.loadedAt = 0;
    this.options = options;
    this.name = name;
  }
 
  add = (...objects: IvyObject[]) => {
    for (const object of objects) {
      object.scene = this;
      this.objectStack.push(object);

      if (this.mounted) {
        object.mount()
      } else {
        object.initialItem = true;
      }
    }
  }
 
  mount = () => {
    this.destroy(); 

    this.mounted = true;
    for (const object of this.objectStack) {
      object.mount();
    }
    if (this.core?.mainCamera) {
      this.onMount?.(this.core?.mainCamera);
    }
  }

  update = () => {
    for (const object of this.objectStack) {
      object.update?.(object);
    }
  }

  destroy = () => {
    this.mounted = false;
    this.onDestroy?.();
   
    const children = this.threeScene.children;
    for (const object of children) {
      destroyObject(object);
    }
    
    for (const object of this.objectStack) {
      object.destroy();
    }

    this.objectStack = this.objectStack.filter(o => o.initialItem);
  }

  removeFromStack = (object: IvyObject) => {
    if (object.initialItem) return 

    const index = this.objectStack.indexOf(object);
    if (index === -1) return;
    this.objectStack.splice(index, 1);
  }
}