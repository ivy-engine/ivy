import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshNormalMaterial,
  Object3D,
  PerspectiveCamera,
  Scene as ThreeScene,
} from "three";
import Element, { ElementBaseOption } from "../Elements/Element";
import IvyRenderer from "../renderer";

var scene = new ThreeScene();
const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.25,
  400
);
camera.position.set(0, 2, 12);
camera.rotateX(-Math.PI / 20);

scene.add(new AmbientLight(0x666666));

const light = new DirectionalLight(0xdfebff, 1.75);
light.position.set(0, 8, 0);

scene.add(light);

light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.far = 20;

type StackItem = Element<ElementBaseOption>;
export default class Scene {
  stack: Element<ElementBaseOption>[] = [];
  rawScene = scene;
  camera = camera;

  constructor() {}

  add(element: StackItem | Element<ElementBaseOption>[]): void {
    let list = Array.isArray(element) ? element : [element];
    list.forEach((element) => {
        console.log('scene add', element)
        if (element.group) {
            this.rawScene.add(element.group);
        } else {
            this.rawScene.add(element.mesh);
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
    this.stack.forEach((element) => {
      element.update();
    });
  };

  setSize = (width: number, height: number) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
}
