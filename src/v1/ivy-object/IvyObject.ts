import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  Euler,
  Float32BufferAttribute,
  Group,
  Light,
  Material,
  Mesh,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  Points,
  Vector3,
} from "three";
import type { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
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
  surfaceScattering?: {
    count: number; 
    sampler: typeof MeshSurfaceSampler;
    pointMaterial: Material;
  };
}

export default class IvyObject {
  name: string;
  options: IvyObjectOptions;
  initialItem = false;
  object?: Object3D;
  scene?: IvyScene;
  update?: (object: IvyObject) => void;
  pos: Vector3;
  rot: Euler;
  scale?: Vector3;
  material?: Material;
  geometry?: BufferGeometry;
  group?: Group;

  constructor(options: IvyObjectOptions) {
    this.options = options;
    this.name = options.name ?? "unnamed";
    this.pos = options.pos ?? new Vector3();
    this.rot = options.rot ?? new Euler();
    this.scale = options.scale;

    if (!options.light) {
      this.material =
        options.material ?? new MeshStandardMaterial({ color: options.color });
      this.geometry = options.geometry ?? new BoxGeometry(1, 1, 1);

      if (this.material && this.geometry) {
        this.object = new Mesh(this.geometry, this.material);
      }
    }

    if (options.group) {
      this.group = new Group();
    }
   
    if (options.surfaceScattering) {
      this.initSurfaceScattering(options.surfaceScattering);
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
    const geometry = this.geometry;
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

  initSurfaceScattering = ({ sampler, pointMaterial, count }: any) => {
    if (!this.group) {
      throw Error("Surface scattering requires a group");
    }

    const samplerInstance = new sampler(this.object).build();

    const vertices = new Float32Array(count * 3);
    const tmpPos = new Vector3();
    for (let i = 0; i < count; i++) {
      samplerInstance.sample(tmpPos);
      vertices.set([tmpPos.x, tmpPos.y, tmpPos.z], i * 3);
    }

    const pointGeo = new BufferGeometry();
    pointGeo.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    const points = new Points(pointGeo, pointMaterial);
    this.group.add(points);
  }

  destroy = (): boolean => {
    this.object && destroyObject(this.object);
    return this.scene?.removeFromStack(this) ?? true;
  };
}
