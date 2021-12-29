import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  Euler,
  Group,
  Light,
  Material,
  Mesh,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  Vector3,
} from "three";
import IvyScene from "../ivy-scene/IvyScene";
import destroyObject from "../lib/destroyObject";

export interface IvyObjectOptions {
  name?: string;
  pos?: Vector3;
  rot?: Euler;
  scale?: Vector3;
  color?: number | Color;
  material?: Material;
  geometry?: BufferGeometry;
  shadow?: boolean;
  light?: Light;
  addToScene?: boolean;
  group?: boolean;
}

export default class IvyObject {
  name: string;
  options: IvyObjectOptions;
  initialItem = false;
  object?: Object3D;
  scene?: IvyScene;
  update?: (object: IvyObject) => void;
  pos: Vector3 = new Vector3();
  rot: Euler = new Euler();
  scale?: Vector3;
  material?: Material;
  geometry?: BufferGeometry;
  group?: Group;

  constructor(options: IvyObjectOptions) {
    this.options = options;
    this.name = options.name ?? "unnamed";
    if (options.pos) {
      this.pos.copy(options.pos);
    }
    if (options.rot) {
      this.rot.copy(options.rot);
    }
    if (options.scale) {
      this.scale = options.scale;
    }
    this.material =
      options.material ??
      new MeshStandardMaterial({ color: options.color ?? 0x00ff00 });
    if (options.geometry) {
      this.geometry = options.geometry;
    }

    console.log(this.material, this.geometry);
    if (this.material && this.geometry) {
      this.object = new Mesh(this.geometry, this.material);
    }

    if (options.group) {
      this.group = new Group();
    }
  }

  mount = () => {
    const light = this.options.light;
    if (this.group) {
      this.scene?.threeScene.add(this.group);
    }

    if (light) {
      this.mountLight();
    } else {
      this.mountObject();
    }
  };

  setObjectSize = () => {
    if (!this.object) return;
    const target = this.group ? this.group : this.object;

    target.position.copy(this.options.pos ?? this.pos);
    this.pos = target.position;

    target.rotation.copy(this.options.rot ?? this.rot);
    this.rot = target.rotation;

    target.scale.copy(this.options.scale ?? new Vector3(1, 1, 1));
    this.scale = target.scale;
  };

  mountLight = () => {
    const light = this.options.light;
    if (!light) return;
    this.object = light;
    light.position.copy(this.options.pos ?? this.pos);

    if (this.options.addToScene !== false) {
      const target = this.group ? this.group : this.scene?.threeScene;
      target?.add(this.object);
    }

    light.castShadow = this.options.shadow ?? false;

    this.setObjectSize();
  };

  mountObject = () => {
    const geometry = this.geometry ?? new BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    const material = this.material;
    this.material = material;
    this.object = this.object ?? new Mesh(geometry, material);

    if (this.options.addToScene !== false) {
      const target = this.group ? this.group : this.scene?.threeScene;

      target?.add(this.object);
      if (this.options.shadow) {
        this.object.castShadow = true;
        this.object.receiveShadow = true;
      }
    }

    this.setObjectSize();
  };

  destroy = (): boolean => {
    this.object && destroyObject(this.object);
    return this.scene?.removeFromStack(this) ?? true;
  };
}
