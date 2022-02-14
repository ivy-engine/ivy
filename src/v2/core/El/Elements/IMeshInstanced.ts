import {
  BufferGeometry,
  Clock,
  Euler,
  InstancedMesh,
  Material,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from "three";
import IScene from "../../Scene/IScene";
import IEl, { IElOptions } from "../IEl";

interface IMeshInstancedOptions extends IElOptions {
  geometry: BufferGeometry;
  material?: Material | Material[];
  count: number;
  updateMatrix?: (
    index: number,
    options: {
      position: Vector3;
      // rotation: Euler;
      scale: Vector3;
      quaternion: Quaternion;
    }
  ) => void;
  setupMatrix: (
    index: number,
    options: {
      position: Vector3;
      rotation: Euler;
      scale: Vector3;
      quaternion: Quaternion;
    }
  ) => void;
}

const DEFAULT_MATERIAL = new MeshStandardMaterial({ color: 0xffffff });

// const randomizeMatrix = function () {

//   const position = new Vector3();
//   const rotation = new Euler();
//   const quaternion = new Quaternion();
//   const scale = new Vector3();

//   return function ( matrix: Matrix4 ) {

//     position.x = Math.random() * 40 - 20;
//     position.y = Math.random() * 40 - 20;
//     position.z = Math.random() * 40 - 20;

//     rotation.x = Math.random() * 2 * Math.PI;
//     rotation.y = Math.random() * 2 * Math.PI;
//     rotation.z = Math.random() * 2 * Math.PI;

//     quaternion.setFromEuler( rotation );

//     scale.x = scale.y = scale.z = Math.random() * 1;

//     matrix.compose( position, quaternion, scale );

//   };

// }();

export default class IMeshInstanced extends IEl {
  o: IMeshInstancedOptions;
  geometry: BufferGeometry;
  material: Material | Material[];
  mesh: InstancedMesh;

  constructor(options: IMeshInstancedOptions) {
    super(options);
    this.o = options;
    this.geometry = options.geometry;
    this.mesh = new InstancedMesh(
      this.geometry,
      options.material ?? DEFAULT_MATERIAL,
      options.count
    );
    this.material = this.mesh.material;
    this.object = this.mesh;
  }

  init() {
    super.init();
  }

  mount(scene: IScene) {
    super.mount(scene);
    const matrix = new Matrix4();
    const quaternion = new Quaternion();
    const position = new Vector3();
    const rotation = new Euler();
    const scale = new Vector3();

    for (let i = 0; i < this.o.count; i++) {
      this.o.setupMatrix(i, {
        position,
        rotation,
        scale,
        quaternion,
      });

      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      this.mesh.setMatrixAt(i, matrix);
    }
  }
 
  render(el: IEl, clock: Clock) {
    super.render(el, clock);

    if (this.o.updateMatrix) {
      const matrix = new Matrix4();
      const quaternion = new Quaternion();
      const position = new Vector3();
      // const rotation = new Euler();
      const scale = new Vector3();

      for (let i = 0; i < this.o.count; i++) {
        // get matrix at index i
        this.mesh.getMatrixAt(i, matrix);
        matrix.decompose(position, quaternion, scale);
        
        // set rotation from quaternion
        // rotation.setFromQuaternion(quaternion);

        this.o.updateMatrix(i, {
          position,
          scale,
          quaternion,
        });

       
        // rotate matrix
        // quaternion.setFromEuler(rotation);

        // quaternion.setFromEuler(rotation);
        matrix.compose(position, quaternion, scale);
        this.mesh.setMatrixAt(i, matrix);
      }

      this.mesh.instanceMatrix.needsUpdate = true;
      // notify update

    }

  }

  setMaterial(material: Material | Material[]) {
    this.mesh.material = material;
    this.material = material;
  }

  dispose(): void {
    super.dispose();
    this.geometry.dispose();
    if (Array.isArray(this.material)) {
      for (const m of this.material) {
        m.dispose();
      }
    } else {
      this.material.dispose();
    }
  }
}
