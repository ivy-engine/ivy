import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, Scene } from "three";
import Ivy from "../Ivy";
import IvyObject from "../ivy-object/IvyObject";

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
  onMount?: () => void;
  onDestroy?: () => void;

  constructor(name: string, options: IvySceneOptions = {}) {
    this.loadedAt = 0;
    this.options = options;
    this.name = name;
   
    console.log('new scene 99')

    const lightA = new AmbientLight(0xffffff, 0.2);
    const lightB = new DirectionalLight(0xffffff, 1)
    this.threeScene.add(lightA, lightB);
  }
 
  add = (...objects: IvyObject[]) => {
    for (const object of objects) {
      object.scene = this;
      this.objectStack.push(object);
      if (this.mounted) object.mount();
    }
  }
 
  mount = () => {
    this.destroy();
    this.mounted = true;
    this.onMount?.();
    for (const object of this.objectStack) {
      object.mount();
    }
  }

  update = () => {
    for (const object of this.objectStack) {
      object.update?.();
    }
    this.objectStack = [];
  }

  destroy = () => {
    this.mounted = false;
    this.onDestroy?.();
    for (const object of this.objectStack) {
      object.destroy();
    }
  }
}