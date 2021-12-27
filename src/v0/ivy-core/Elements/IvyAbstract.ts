import { Euler, Group, Object3D, Vector3, Scene as ThreeScene, AnimationMixer } from "three";
import IvyThree from "../../v0/ivy-three/IvyThreeree";
import IvyRenderer from "../renderer";
import IvyScene from "../Scene/IvyScene";

export interface AbstractBaseOption {
  name?: string;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  group?: boolean;
}

export default abstract class IvyAbstract<TOptions extends AbstractBaseOption> {
  mixer?: AnimationMixer;
  name: string;
  object?: Object3D;
  options: TOptions;
  children: IvyAbstract<any>[] = [];
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

  add = (element: IvyAbstract<any>) => {
    if (!this.group) {
      throw new Error(
        "Cannot add child to non-group element, add `group: true` to the element options"
      );
    }

    let positioned = this.object;
    if (element.group) {
      positioned = element.group;
      this.group.add(positioned);
    }

    element.parentGroup = this.group;
    element.setup();
    this.children.push(element);
  };

  update = () => {
    if (this.scene && this.mixer) {
      this.mixer.update(this.scene?.delta);
    }
    // this.scene.del

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

  setup() {}
 
  dispose() {
    const object = this.object;
    if (!(object instanceof Object3D)) return false;
    // for better memory management and performance
    if (object.geometry) {
        object.geometry.dispose();
    }
    if (object.material) {
        if (object.material instanceof Array) {
            // for better memory management and performance
            object.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object.material.dispose();
        }
    }
    if (object.parent) {
        object.parent.remove(object);
    }

    if (this.children) {
      this.children.forEach(child => {
          child.dispose();
      });
    }
  }

  addToScene(renderer: IvyThree, scene?: ThreeScene) {
    if (!this.object) return;
    

    if (this.group) {
      for (const item of this.children) {
        // item.setup(renderer)
        // item.create(renderer)
      }
      // scene?.add(this.group);
    } else if (this.parentGroup) {
      // this.parentGroup.add(this.group ?? this.object);
    } else {
      // scene?.add(this.object);
    }
  }

  create(renderer: IvyThree, scene?: ThreeScene): void {
    if (this.object) return;
    
    this.setup(renderer, scene);
    this.addToScene(renderer, scene);
  }

  draw?(element: IvyAbstract<TOptions>): void;
}
