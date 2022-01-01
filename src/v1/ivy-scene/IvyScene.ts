import { AmbientLight, BoxGeometry, Camera, Clock, DirectionalLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, MeshToonMaterial, PerspectiveCamera, Scene } from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass";
import Ivy from "../Ivy";
import IvyObject from "../ivy-object/IvyObject";
import destroyObject from "../lib/destroyObject";

interface IvySceneOptions {
  physics?: boolean;
  gravity?: number;
  controls?: "orbit";
  camera?: Camera;
}

export default class IvyScene {
  loadedAt: number;
  name: string;
  options: IvySceneOptions;
  objectStack: Array<IvyObject | undefined> = [];
  threeScene = new Scene();
  core?: Ivy; 
  mounted = false;  
  onUpdate?: (scene: IvyScene) => void;
  onMount?: (scene: IvyScene) => void;
  onDestroy?: (scene: IvyScene) => void;
  _tidyInterval = 0;

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
 
  addComposerPass(pass: Pass) {
    if (this.core?.composer) {
      this.core.composer.addPass(pass);
      this.core.composerLayers.push(pass);
      this.core.updateSize(); 
    }
  }
 
  mount = () => {
    this.destroy(); 

    if (this.options.camera) {
      this.setMainCamera(this.options.camera);
    }

    this.mounted = true;
    for (const object of this.objectStack) {
      object?.mount();
    }
    this.onMount?.(this);
  }

  update = (clock: Clock) => {
    for (const object of this.objectStack) {
      object?._active && object.update?.(object, clock);
    }
    this.onUpdate?.(this);
  }
 
  setMainCamera = (camera: Camera) => {
    this.core?.setMainCamera(camera);
  }

  destroy = () => {
    this.mounted = false;
    this.onDestroy?.(this);
   
    const children = this.threeScene.children;
    for (const object of children) {
      destroyObject(object);
    }
    
    for (const object of this.objectStack) {
      object?.destroy();
    }

    this.objectStack = this.objectStack.filter(o => o?.initialItem);
  }
}