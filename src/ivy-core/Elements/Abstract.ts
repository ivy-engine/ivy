import { Euler, Group, Object3D, Vector3, Scene as ThreeScene } from "three";
import IvyRenderer from "../renderer";
import IvyScene from "../Scene/IvyScene";

export interface AbstractBaseOption {
  name?: string;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  group?: boolean;
}

export default abstract class Abstract<TOptions extends AbstractBaseOption> {
  name: string;
  object?: Object3D;
  options: TOptions;
  children: Abstract<any>[] = [];
  group?: Group;
  scene?: IvyScene;
  parentGroup?: Group;

  constructor(options: TOptions) {
    this.options = options;
    this.name = options.name ?? "element";
  }

  setPosition() {
    let positioned = this.object;
    if (!positioned) return;

    if (this.options.group) {
      this.group = new Group();
      this.group.add(positioned);
      positioned = this.group;
    }

    positioned.position.copy(this.options.position ?? new Vector3());
    positioned.position.copy(this.options.position ?? new Vector3());
    positioned.rotation.copy(this.options.rotation ?? new Euler());
  }

  add = (element: Abstract<any>) => {
    if (!this.group) {
      throw new Error(
        "Cannot add child to non-group element, add `group: true` to the element options"
      );
    }

    console.log("group add", element);

    let positioned = this.object;
    if (element.group) {
      positioned = element.group;
      this.group.add(positioned);
    }

    element.parentGroup = this.group;
    this.children.push(element);
  };

  update = () => {
    this.draw?.(this);
    this.drawChildren();
  };

  drawChildren = () => {
    if (this.group) {
      for (const element of this.children) {
        element.update();
      };
    }
  };

  setup(renderer: IvyRenderer, scene?: ThreeScene) {}

  addToScene(renderer: IvyRenderer, scene?: ThreeScene) {
    if (!this.object) return;
    

    if (this.group) {
      for (const item of this.children) {
        item.create(renderer)
      }
      scene?.add(this.group);
    } else if (this.parentGroup) {
      this.parentGroup.add(this.group ?? this.object);
    } else {
      scene?.add(this.object);
    }
  }

  create(renderer: IvyRenderer, scene?: ThreeScene): void {
    this.setup(renderer, scene);
    this.addToScene(renderer, scene);
  }

  draw?(element: Abstract<TOptions>): void;
}
