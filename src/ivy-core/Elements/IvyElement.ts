import {
  BoxGeometry,
  Color,
  Euler,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
  Scene as ThreeScene,
  Matrix4,
  InstancedMesh,
  Intersection,
} from "three";
import IvyRenderer from "../renderer";
import IvyAbstract from "./IvyAbstract";
import { Body, Material, Vec3 } from "cannon-es";
import IvyThree from "../../ivy-three/IvyThree";
export interface ElementBaseOption {
  name?: string;
  geometry?: BoxGeometry;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  color?: Color;
  group?: boolean;
  mass?: number;
  physicsMaterial?: Material;
  material?: Material | MeshStandardMaterial;
  instanced?: {
    count: number;
    createInstance: (element: Matrix4) => Matrix4;
  };
}

export default abstract class IvyElement<
  TOptions extends ElementBaseOption
> extends IvyAbstract<TOptions> {
  children: IvyElement<any>[] = [];
  material?: Material | MeshStandardMaterial;
  mesh: Mesh;
  instanceMesh?: InstancedMesh;
  instanceData?: Float32Array;
  instanceCount?: number;
  color?: Color;
  physicsBody?: Body;
  physicsMaterial?: Material;

  constructor(options: TOptions) {
    super(options);

    this.mesh = new Mesh();
    if (this.options.instanced) {
      this.initInstancedMesh();
    } else {
      this.initMesh();
    }
    this.setPosition();
  }

  setup(renderer: IvyThree, scene?: ThreeScene) {
    this.material =
      this.options.material ?? new MeshStandardMaterial({ color: this.color });

    if (this.mesh) {
      this.mesh.material = this.material;
    }
  }

  update = () => {
    this.draw?.(this);
    if (this.mixer) {
      this.mixer.update(0.01);
    }
    this.updatePhysics();
    this.drawChildren();
  };

  draw?(element: IvyElement<TOptions>): void;
  onIntersectedEnter?(intersection: Intersection<Object3D>): void;
  onIntersectedLeave?(intersection: Intersection<Object3D>): void;
  initMesh() {}

  addEventListener(
    event: string,
    fn: (intersection: Intersection<Object3D>) => void
  ) {
    if (this.object && this.scene) {
      this.scene.addEventListener({
        event,
        fn,
        object: this.object,
      });
    }
  }

  /**
   * Instancing
   */
  initInstancedMesh() {
    if (!this.options.instanced) {
      return;
    }

    const { count, createInstance } = this.options.instanced;
    this.instanceCount = count;
    this.instanceMesh = new InstancedMesh(
      this.options.geometry ?? new BoxGeometry(1, 1, 1),
      this.options.material ?? new MeshStandardMaterial({ color: this.color }),
      count
    );
    const matrix = new Matrix4();
    const list = new Float32Array(count * 16);

    for (let i = 0; i < count; i++) {
      const m = createInstance(matrix);
      this.instanceMesh.setMatrixAt(i, m);
      list.set(m.elements, i * 16);
    }

    this.instanceData = list;

    this.object = this.instanceMesh;
  }

  /**
   * Physics
   */
  updatePhysics() {
    const body = this.physicsBody;
    if (body && this.mesh) {
      this.mesh.position.set(body.position.x, body.position.y, body.position.z);
      this.mesh.quaternion.set(
        body.quaternion.x,
        body.quaternion.y,
        body.quaternion.z,
        body.quaternion.w
      );
    }
  }

  applyAngularVelocity(x: number, y: number, z: number) {
    const body = this.physicsBody;
    if (body) {
      var directionVector = new Vec3(x, y, z);
      var directionVector = body.quaternion.vmult(directionVector);

      body.angularVelocity.set(
        directionVector.x,
        directionVector.y,
        directionVector.z
      );
    }
  }

  applyDirectionalVelocity(x: number, y: number, z: number) {
    const body = this.physicsBody;
    if (body) {
      const impulse = new Vec3(z, y, x);
      body.applyLocalImpulse(impulse);
    }
  }
}
