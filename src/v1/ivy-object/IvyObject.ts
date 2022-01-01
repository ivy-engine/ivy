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
  PointsMaterial,
  Vector3,
} from "three";
import type { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import IvyScene from "../ivy-scene/IvyScene";
import createText from "../lib/createText";
import destroyObject from "../lib/destroyObject";
import loadFont from "../lib/loadFont";
import surfaceSampler, { SurfaceScatteringOptions } from "./surfaceSampler";

export interface IvyObjectFontOptions {
  ttfFile: string;
  centerX?: boolean;
  centerY?: boolean;
  centerZ?: boolean;
  scale?: number;
  size?: number;
  height?: number;
  curveSegments?: number;
   bevelEnabled?: boolean;
   bevelSegments?: number;
   bevelSize?: number;
   bevelThickness?: number;
}
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
  surfaceScattering?: SurfaceScatteringOptions;
  font?: IvyObjectFontOptions;
  text?: string;
  props?: { [key: string]: any }; 
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
  scale: Vector3;
  material?: Material;
  geometry?: BufferGeometry;
  group?: Group;
  props: { [key: string]: any };
  _active = false;

  get _target() {
    return this.group ?? this.scene?.threeScene;
  }

  constructor(options: IvyObjectOptions = {}) {
    this.options = options;
    this.name = options.name ?? "unnamed";
    this.pos = options.pos ?? new Vector3();
    this.rot = options.rot ?? new Euler();
    this.scale = options.scale ?? new Vector3(1, 1, 1);
    this.geometry = options.geometry;
    this.props = options.props ?? {};

    this.initGeneral();
  }

  initGeneral() {
    if (this.options.group) {
      this.setupGroup();
    }

    this.material =
      this.options.material ??
      new MeshStandardMaterial({ color: this.options.color ?? 0xffffff });
  }

  initAsLight() {}

  initAsText() {
    const {ttfFile} = this.options.font ?? {};
    const text = this.options.text!;

    this.setupGroup();
    

    if (!ttfFile) {
      throw new Error("No font file provided: `font.ttfFile`");
    };

    loadFont(ttfFile).then((font) => {
      if (!this.material) {
        throw new Error("Text requires material");
      }; 
      const {object, position} = createText(text, font, this.material, this.options.font!)
      this.object = object;
      this.mountObject();

      if (this.options.surfaceScattering) {
        this.initSurfaceScattering(this.options.surfaceScattering, position);
      }
    });
  }

  initAsObject() {
    if (!this.geometry) {
      this.geometry = new BoxGeometry(1, 1, 1);
    }

    if (this.material && this.geometry) {
      this.object = new Mesh(this.geometry, this.material);
    }

    if (this.options.surfaceScattering) {
      this.initSurfaceScattering(this.options.surfaceScattering);
    }
  }
 
  setupGroup(): Group {
    if (!this.group) {
      this.group = new Group();
      this.setObjectSize();
    }

    return this.group;
  }

  mount = () => {
    this.destroy();

    const light = this.options.light;
    if (this.options.light) {
      this.initAsLight();
    } else if (this.options.text) {
      this.initAsText();
    } else {
      this.initAsObject();
    }

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
    const target = this.group ?? this.object;

    target.position.copy(this.pos ?? this.options.pos);
    this.pos = target.position;

    target.rotation.copy(this.rot ?? this.options.rot);
    this.rot = target.rotation;

    target.scale.copy(this.scale ?? this.options.scale);
    this.scale = target.scale;
  };

  mountLight = () => {
    const light = this.options.light;
    if (!light) return;
    this.object = light;
    light.position.copy(this.options.pos ?? this.pos);

    if (this.options.addToScene !== false) {
      this._target?.add(this.object);
    }

    light.castShadow = this.options.shadow ?? false;

    this.setObjectSize();
  };

  mountObject = () => {
    this._active = true;
    const geometry = this.geometry;
    this.geometry = geometry;
    const material = this.material;
    this.material = material;

    if (this.object && this.options.addToScene !== false) {
      this._target?.add(this.object);
      if (this.options.shadow) {
        this.object.castShadow = true;
        this.object.receiveShadow = true;
      }
    }

    this.setObjectSize();
  };

  initSurfaceScattering = (options: SurfaceScatteringOptions, position: Vector3 = new Vector3()) => {
    const group = this.setupGroup();
    if (!this.object) {
      throw Error("Surface scattering requires an object");
    }

    const points = surfaceSampler(this.object, options, position);
    group.add(points);
  };

  destroy = () => {
    this._active = false; 
    this.object && destroyObject(this.object);
    this.group && destroyObject(this.group); 
  };
}
