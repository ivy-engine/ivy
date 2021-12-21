import Abstract from "../Elements/Abstract";
import { IvyCamera } from "../Elements/IvyCamera";
import Element, { ElementBaseOption } from "../Elements/Element";
import IvyRenderer from "../renderer";
import { Scene } from "three";

var scene = new Scene();
type StackItem = Element<ElementBaseOption>;
export default class IvyScene {
  stack: Abstract<ElementBaseOption>[] = [];
  rawScene = scene;
  camera: IvyCamera;

  constructor(options: {camera?: IvyCamera} = {}) {
    const { camera = new IvyCamera() } = options;

    this.camera = camera
  }

  add(element: StackItem | Abstract<ElementBaseOption>[]): void {
    let list = Array.isArray(element) ? element : [element];
    list.forEach((element) => {
        console.log('scene add', element)
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
    this.stack.forEach((element) => {
      element.update();
    });
  };

  // setSize = (width: number, height: number) => {
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  // };
}
