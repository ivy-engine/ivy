import {
  BoxGeometry,
  BufferGeometry,
  Clock,
  Color,
  EdgesGeometry,
  Euler,
  Group,
  InstancedMesh,
  Light,
  Material,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  Scene,
  Vector3,
} from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";
import { WireframeGeometry2 } from "three/examples/jsm/lines/WireframeGeometry2";
import { Wireframe } from "three/examples/jsm/lines/Wireframe";
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

export type posXYZ = [x: number, y: number, z: number];
export type colRGB = [r: number, g: number, b: number];
export interface IvyObjectLineOptions {
  points?: Vector3[];
  type?: "outline" | "wireframe";
  linewidth?: number;
  worldUnits?: boolean;
  color?: (position: posXYZ) => colRGB;
  dashed?: boolean;
  dashOffset?: number;
  dashSize?: number;
  gapSize?: number;
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
  object?: Object3D;
  line?: IvyObjectLineOptions;
  instanced?: number;
}

export default class IvyObject {
  name: string;
  options: IvyObjectOptions;
  initialItem = false;
  object?: Object3D;
  scene?: IvyScene;
  update?: (object: IvyObject, clock: Clock) => void;
  pos: Vector3;
  rot: Euler;
  scale: Vector3;
  material?: Material;
  geometry?: BufferGeometry;
  group?: Group;
  props: { [key: string]: any };
  children: IvyObject[] = [];
  parent?: IvyObject;
  _dummyObject = new Object3D();
  _instanceCount = 0;
  _active = false;

  get _target(): Group | Scene | undefined {
    if (this.parent) {
      return this.parent._target;
    }
    return this.group ?? this.scene?.threeScene;
  }
 
  get _sceneElement(): Group | Object3D | undefined {
    return this.group ?? this.object;
  }

  constructor(options: IvyObjectOptions = {}) {
    this.options = options;
    this.name = options.name ?? "";
    this.pos = options.pos ?? new Vector3();
    this.rot = options.rot ?? new Euler();
    this.scale = options.scale ?? new Vector3(1, 1, 1);
    this.geometry = options.geometry;
    this.props = options.props ?? {};
    this.object = options.object;

    this.initGeneral();
  }

  initGeneral() {
    if (this.options.group) {
      this.setupGroup();
    }

    if (this.options.object) {
      return;
    }

    this.material =
      this.options.material ??
      new MeshStandardMaterial({ color: this.options.color ?? 0xffffff });

    if (this.options.instanced) {
      this.object = new InstancedMesh(
        this.geometry,
        this.material,
        this.options.instanced
      );
    }
  }

  initAsLight() {}

  initAsLine() {
    const lineOptions = this.options.line;
    if (!lineOptions) {
      throw new Error("No line options provided");
    }
    const origin = this.object?.position ?? new Vector3();
    const positions: number[] = [];
    const colors: number[] = [];
    const color = new Color();

    let points = lineOptions.points ?? [];
    const vertexColors = Boolean(lineOptions.color);

    const material = new LineMaterial({
      color: vertexColors ? undefined : this.material?.color,
      linewidth: lineOptions.linewidth ?? 0.04, // in world units with size attenuation, pixels otherwise
      vertexColors,
      worldUnits: lineOptions.worldUnits ?? true,

      // resolution:  // to be set by renderer, eventually
      dashed: lineOptions.dashed ?? false,
      dashOffset: lineOptions.dashOffset ?? 0,
      dashSize: lineOptions.dashSize ?? 0.1,
      gapSize: lineOptions.gapSize ?? 0.1,
      alphaToCoverage: true,
    });

    if (lineOptions.type === "outline" || lineOptions.type === "wireframe") {
      if (lineOptions.type === "outline") {
        const edges = new EdgesGeometry(this.geometry);
        const g = new LineSegmentsGeometry();
        const pos = edges.getAttribute("position");

        for (let i = 0; i < pos.count; i++) {
          const relative: colRGB = [pos.getX(i), pos.getY(i), pos.getZ(i)];
          const point: posXYZ = [
            relative[0] + origin.x,
            relative[1] + origin.y,
            relative[2] + origin.z,
          ];
          positions.push(...point);
          if (lineOptions.color) {
            const col = lineOptions.color(relative);
            colors.push(...col);
          }
        }

        g.setPositions(positions);
        if (lineOptions.color) {
          g.setColors(colors);
        }
        const l = new LineSegments2(g, material);
        l.computeLineDistances();
        l.scale.set(1, 1, 1);
        this.object = l;
      } else if (lineOptions.type === "wireframe") {
        if (this.options.text) {
          throw new Error("Wireframe not supported for text, use outline");
        }

        const geometry = new WireframeGeometry2(this.geometry);
        this.geometry = geometry;
        const wireframe = new Wireframe(geometry, material);
        wireframe.computeLineDistances();
        wireframe.scale.set(1, 1, 1);
        this.object = wireframe;
      }
    } else {
      for (let i = 0, l = points.length; i < l; i++) {
        const point = points[i];
        const pointPos: posXYZ = [
          point.x + origin.x,
          point.y + origin.y,
          point.z + origin.z,
        ];
        positions.push(...pointPos);
        if (lineOptions.color) {
          const col = lineOptions.color(pointPos);
          colors.push(...col);
        }
      }

      const geometry = new LineGeometry();
      this.geometry = geometry;
      geometry.setPositions(positions);
      if (lineOptions.color) {
        geometry.setColors(colors);
      }

      const line = new Line2(geometry, material);
      line.computeLineDistances();
      line.scale.set(1, 1, 1);
      this.object = line;
    }
  }

  initAsText() {
    const { ttfFile } = this.options.font ?? {};
    const text = this.options.text!;

    this.setupGroup();

    if (!ttfFile) {
      throw new Error("No font file provided: `font.ttfFile`");
    }

    loadFont(ttfFile).then((font) => {
      if (!this.material) {
        throw new Error("Text requires material");
      }
      const { object, position } = createText(
        text,
        font,
        this.material,
        this.options.font!
      );
      this.object = object;
      this.geometry = object.geometry;

      if (this.options.line) {
        this.initAsLine();
      }

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

    if (!this.object && this.material && this.geometry) {
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

  mount() {
    this.destroy();

    const light = this.options.light;

    if (this.object) {
      this._target?.add(this.object);
      return;
    }

    if (this.options.light) {
      this.initAsLight();
    } else if (this.options.text) {
      this.initAsText();
    } else if (this.options.line) {
      this.initAsLine();
    } else {
      this.initAsObject();
    }

    if (this.group) {
      this.scene?.threeScene.add(this.group);
      this.setObjectSize();
    }

    if (light) {
      this.mountLight();
    } else {
      this.mountObject();
    }

    for (const child of this.children) {
      child.scene = this.scene;
      child.mount();
    }
  }

  setObjectSize = () => {
    const target = this.group ?? this.object;
    if (!target) return;

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

    console.log('light', this);
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

  initSurfaceScattering = (
    options: SurfaceScatteringOptions,
    position: Vector3 = new Vector3()
  ) => {
    const group = this.setupGroup();
    if (!this.object) {
      throw Error("Surface scattering requires an object");
    }

    const points = surfaceSampler(this.object, options, position);
    group.add(points);
  };

  add(object: IvyObject) {
    if (!this.group) {
      throw new Error("Object have a group for adding children");
    }

    object.parent = this;

    if (!this.scene?.mounted) {
      object.initialItem = true;
    }

    this.children.push(object);
  };

  addInstance = (options: {
    pos?: Vector3;
    rot?: Euler;
    color?: number;
  }) => {
    const mesh = this.object as InstancedMesh;
    const o = this._dummyObject;
    if (!(mesh instanceof InstancedMesh)) {
      console.warn("No instance mesh");
      return;
    }
    if (options.pos) o.position.copy(options.pos);
    if (options.rot) o.rotation.copy(options.rot);
    o.updateMatrix(); 
    mesh.setMatrixAt(this._instanceCount, o.matrix);
    mesh.setColorAt(this._instanceCount, new Color());
    this._instanceCount++;
  };

  destroy = () => {
    this._active = false;
    for (const child of this.children) {
      child.destroy();
    }
    this.object && destroyObject(this.object);
    this.group && destroyObject(this.group);
  };
}
