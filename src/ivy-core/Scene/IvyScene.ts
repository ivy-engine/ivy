import IvyAbstract from "../Elements/IvyAbstract";
import { IvyCamera } from "../Elements/IvyCamera";
import IvyElement, { ElementBaseOption } from "../Elements/IvyElement";
import IvyRenderer from "../renderer";
import {
  Clock,
  Intersection,
  Object3D,
  Raycaster,
  Scene,
  Vector2,
} from "three";
import { World } from "cannon-es";
import { OrbitControls } from "../../ivy-three/controls/OrbitControls";
import { IvyLight } from "../Elements/IvyLight";
import IvyThree from "../../ivy-three/IvyThree";

type StackItem = IvyElement<ElementBaseOption>;

export const defaultLights = () => {
  const light = new IvyLight();
  const ambient = new IvyLight({ type: "ambient", intensity: 0.4 });
  return [light, ambient];
};

interface EventListener {
  fn: (event: any) => void;
  event: string;
  object: Object3D;
}

interface IvySceneOptions {
  name?: string;
  camera?: IvyCamera;
  physics?: boolean;
  gravity?: number;
  controls?: "orbit";
  elements?: IvyAbstract<any>[];
}
export default class IvyScene {
  name: string;
  stack: IvyAbstract<ElementBaseOption>[] = [];
  clock = new Clock();
  rawScene = new Scene();
  camera?: IvyCamera;
  delta: number = 0;
  physics?: boolean;
  physicsWorld?: World;
  initialElements: IvyAbstract<any>[] = [];
  initialRender = true;
  gravity = -9.82;
  controls = "none";
  pointer = new Vector2(-999, -999);
  renderer?: IvyThree;
  raycaster = new Raycaster();
  _intersected: Intersection<Object3D> | null = null;
  eventListeners: EventListener[] = [];
  options: IvySceneOptions;

  constructor(
    options: IvySceneOptions = {}
  ) {
    this.options = options;
    // const cameraInstance = options.camera ?? new IvyCamera();
    // const camera = cameraInstance.create(options.renderer, this.rawScene);

    this.initialElements = options.elements ?? [];
    this.name = options.name ?? "untitled scene";
  }
 
  discard() {
    const rs = this?.rawScene;

    if (rs) {
      let list = this.stack;

      for (const element of list) {
        element.dispose();
      }

      // for (var i = rs.children.length - 1; i >= 0; i--) {
      //   const obj = rs.children[i];
      //   rs.remove(obj);
      // }
    }
    
    // this.stack= [];
    this.clock = new Clock();
    // this.rawScene = new Scene();
    this.camera = undefined;
    this.delta = 0;
    // this.physicsWorld = undefined;
    this.initialRender = true;
    this.pointer = new Vector2(-999, -999);
    this._intersected = null;
  }

  setupControls(renderer: IvyThree) {
    if (this.controls === "orbit" && this.camera) {
      new OrbitControls(this.camera.object, renderer.renderer?.domElement);
    }
  }

  setupPhysics() {
    if (this.physics) {
      this.physicsWorld = new World();
      this.physicsWorld.gravity.set(0, this.gravity, 0);
    }
  }

  addInitialElements() {
    this.add(this.initialElements);
  }

  addEventListener(listener: EventListener) {
    this.eventListeners.push(listener)
  }

  add(element: StackItem | IvyAbstract<ElementBaseOption>[]): void {
    let list = Array.isArray(element) ? element : [element];

    for (const element of list) {
      element.scene = this;
      element.setup(this.renderer, this.rawScene)

      if (element.group) {
        this.rawScene.add(element.group);
      } else {
        if (element.object) {
          this.rawScene.add(element.object);
        }
      }

      element.scene = this;
      this.stack.push(element);

      if (this.renderer) {
        element.create(this.renderer, this.rawScene);
      }
    }
  }

  create(options: { renderer: IvyThree }) {
    this.discard();
    const {camera = new IvyCamera(), physics, gravity, controls, elements} = this.options;
    this.renderer = options.renderer;

    this.camera = camera;
    camera.create(this.renderer, this.rawScene) 
    this.physics = Boolean(physics);
    this.gravity = gravity ?? this.gravity;
    this.controls = controls ?? this.controls;
    this.controls = controls ?? this.controls;
    this.setupPhysics();

    // this.setupControls(options.renderer);
    
    // document.addEventListener("mousemove", this.onPointerMove);
    // document.addEventListener("click", this.onClick);
    
  //  console.log(this.stack) 

    this.addInitialElements();
  
    // for (const element of this.stack) {
    //   // console.log('el', element)
    //   // element.create(options.renderer, this.rawScene);
    // }
  }

  render = () => {
    this.updateIntersected();
    this.delta = this.clock.getDelta();
    
    if (this.physicsWorld) {
      this.physicsWorld.step(this.delta);
    }
    for (const element of this.stack) {
      element.update();
    }

    if (this.initialRender) {
      this.initialRender = false;
      this.onSceneReady();
    }
  };

  onSceneReady = () => {};

  onPointerMove = (event) => { 
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  onClick = () => {
    for (const l of this.eventListeners) {
      if (l.event === "click" && l.object === this._intersected?.object) {
        l.fn(this._intersected);
      }
    }
  };

  updateIntersected = () => {
    if (!this.camera.object) return;

    this.raycaster.setFromCamera(this.pointer, this.camera.object);
    const intersects = this.raycaster.intersectObjects(
      this.rawScene.children,
      false
    );

    if (intersects.length > 0) {
      if (this._intersected?.object != intersects[0].object) {
        if (this._intersected)
          this._intersected.onIntersectedLeave?.(this._intersected);

        this._intersected = intersects[0];
        this._intersected.object.ivyElement?.onIntersectedEnter?.(
          this._intersected
        );
      }
    } else {
      if (this._intersected)
        this._intersected.object.ivyElement?.onIntersectedLeave?.(
          this._intersected
        );
      this._intersected = null;
    }
  };
}
