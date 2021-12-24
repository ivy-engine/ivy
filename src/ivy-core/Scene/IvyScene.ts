import Abstract from "../Elements/Abstract";
import { IvyCamera } from "../Elements/IvyCamera";
import Element, { ElementBaseOption } from "../Elements/Element";
import IvyRenderer from "../renderer";
import { Clock, Scene } from "three";
import { World } from "cannon-es";

var scene = new Scene();
const clock = new Clock()

type StackItem = Element<ElementBaseOption>;
export default class IvyScene {
  stack: Abstract<ElementBaseOption>[] = [];
  rawScene = scene;
  camera: IvyCamera;
  physics: boolean; 
  physicsWorld?: World;
  initialRender = true; 
  gravity = -9.82;

  constructor(options: {camera?: IvyCamera, physics?: boolean, gravity?: number} = {}) {
    const { camera = new IvyCamera() } = options;

    this.camera = camera
    this.physics = Boolean(options.physics);
    this.gravity = options.gravity ?? this.gravity;
    this.setupPhysics();
  }

  setupPhysics() {
    this.physicsWorld = new World()
    this.physicsWorld.gravity.set(0, this.gravity, 0)
  }

  add(element: StackItem | Abstract<ElementBaseOption>[]): void {
    let list = Array.isArray(element) ? element : [element];
    list.forEach((element) => {
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
    });
  }

  create(options: { renderer: IvyRenderer }) {
    this.stack.forEach((element) => {
      element.create(options.renderer, scene);
    });
  }

  render = () => {
    if (this.physicsWorld) {
      const delta = Math.min(clock.getDelta(), 0.1)
      this.physicsWorld.step(delta)  
    }
    this.stack.forEach((element) => {
      element.update();
    });

    if (this.initialRender) {
      this.initialRender = false;
      this.onSceneReady();
    }
  };

  onSceneReady = () => {}

  // setSize = (width: number, height: number) => {
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  // };
}
