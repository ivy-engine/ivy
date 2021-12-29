import { AmbientLight, BoxGeometry, Camera, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, Scene } from "three";
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
    this.mounted = true;
    if (this.core?.mainCamera) {
      this.onMount?.(this.core?.mainCamera);
    }
    for (const object of this.objectStack) {
      object.mount();
    }
  }

  update = () => {
    for (const object of this.objectStack) {
      object.update?.(object);
    }
  }

  destroy = () => {
    this.onDestroy?.();
    
    for (const object of this.threeScene.children) {
      destroyObject(object);
    }
    
    for (const object of this.objectStack) {
      object.destroy();
    }
    this.mounted = false;
  }

  removeFromStack = async (object: IvyObject) => {
    if (object.initialItem) return 

    const index = this.objectStack.indexOf(object);
    if (index === -1) return;
    this.objectStack.splice(index, 1);
  }
}