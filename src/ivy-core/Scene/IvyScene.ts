import IvyAbstract from "../Elements/IvyAbstract";
import { IvyCamera } from "../Elements/IvyCamera";
import IvyElement, { ElementBaseOption } from "../Elements/IvyElement";
import IvyRenderer from "../renderer";
import { Clock, Intersection, Object3D, Raycaster, Scene, Vector2 } from "three";
import { World } from "cannon-es";
import { OrbitControls } from "../../ivy-three/controls/OrbitControls";
import { IvyLight } from "../Elements/IvyLight";

type StackItem = IvyElement<ElementBaseOption>;

export const defaultLights = () => {
  const light = new IvyLight();
  const ambient = new IvyLight({ type: "ambient", intensity: 0.4 });
  return [light, ambient];
}
export default class IvyScene {
  stack: IvyAbstract<ElementBaseOption>[] = [];
  clock = new Clock()
  rawScene = new Scene();
  camera: IvyCamera;
  delta: number = 0;
  physics: boolean; 
  physicsWorld?: World;
  initialElements: IvyAbstract<any>[] = [];
  initialRender = true; 
  gravity = -9.82;
  controls = 'none';
  pointer = new Vector2(-999, -999);
  raycaster = new Raycaster();
  _intersected: Intersection<Object3D> | null = null;

  constructor(options: {camera?: IvyCamera, physics?: boolean, gravity?: number, controls? : 'orbit', elements?: IvyAbstract<any>[]} = {}) {
    const { camera = new IvyCamera() } = options;

    this.camera = camera
    this.physics = Boolean(options.physics);
    this.gravity = options.gravity ?? this.gravity;
    this.controls = options.controls ?? this.controls;
    this.controls = options.controls ?? this.controls;
    this.initialElements = options.elements ?? [];
    this.setupPhysics();
    this.addInitialElements(); 
  }

  setupControls(renderer: IvyRenderer) {
    if (this.controls === 'orbit') {
      new OrbitControls( this.camera.object, renderer.renderer?.domElement );
    }
  }

  setupPhysics() {
    if (this.physics) {
      this.physicsWorld = new World()
      this.physicsWorld.gravity.set(0, this.gravity, 0)
    }
  }

  addInitialElements() {
    this.add(this.initialElements);
  }

  add(element: StackItem | IvyAbstract<ElementBaseOption>[]): void {
    let list = Array.isArray(element) ? element : [element];
    for (const element of list) {
        element.scene = this;
        if (element.group) {
            this.rawScene.add(element.group);
        } else {
          if (element.object) {
            this.rawScene.add(element.object);
          }
        }

        element.scene = this;
        this.stack.push(element);
    };
  }

  create(options: { renderer: IvyRenderer }) {
    this.setupControls(options.renderer); 
    document.addEventListener( 'mousemove', this.onPointerMove );
    for (const element of this.stack) {
      element.create(options.renderer, this.rawScene);
    };
  }

  render = () => {
    this.updateIntersected();
    this.delta = this.clock.getDelta()
    if (this.physicsWorld) {
      this.physicsWorld.step(this.delta)  
    }
    for (const element of this.stack) {
      element.update();
    };

    if (this.initialRender) {
      this.initialRender = false;
      this.onSceneReady();
    }
  };

  onSceneReady = () => {}

  onPointerMove = ( event ) => {
    this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  updateIntersected = () => {
    if (!this.camera.object) return

    this.raycaster.setFromCamera( this.pointer, this.camera.object );
    const intersects = this.raycaster.intersectObjects( this.rawScene.children, false );

    if ( intersects.length > 0 ) {
      if ( this._intersected?.object != intersects[ 0 ].object ) {
        if ( this._intersected ) this._intersected.onIntersectedLeave(this._intersected);

        this._intersected = intersects[ 0 ];
        this._intersected.object.ivyElement.onIntersectedEnter(this._intersected);
      }

    } else {
      if ( this._intersected ) this._intersected.object.ivyElement.onIntersectedLeave(this._intersected);
      this._intersected = null;
    }
  }

  // setSize = (width: number, height: number) => {
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  // };
}
