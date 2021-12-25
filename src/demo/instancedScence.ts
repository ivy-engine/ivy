import {
  BoxGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyCamera } from "../ivy-core/Elements/IvyCamera";
import IvyScene, { defaultLights } from "../ivy-core/Scene/IvyScene";

const instancedScene = new IvyScene({
  physics: true,
  camera: new IvyCamera({
    position: new Vector3(0, 10, 8),
    rotation: new Euler(-Math.PI / 3.5, 0, 0),
  }),
  elements: [...defaultLights()],
  controls: "orbit",
});

const position = new Vector3();
const rotation = new Euler();

const createInstance = (matrix: Matrix4): Matrix4 => {
  position.x = Math.random() * 200 - 10;
  position.y = Math.random() * 200 - 10;
  position.z = Math.random() * 200 - 10;

  rotation.x = Math.random() * 2 * Math.PI;
  rotation.y = Math.random() * 2 * Math.PI;
  rotation.z = Math.random() * 2 * Math.PI;

  matrix.makeTranslation(position.x, position.y, position.z);
  matrix.premultiply(new Matrix4().makeRotationFromEuler(rotation));
  return matrix;
}

const InstancedBox = new IvyBox({
  material: new MeshStandardMaterial({ color: 0x00ffff }),
  instanced: {
    count: 50000,
    createInstance,
  },
});

const InstancedBox2 = new IvyBox({
  material: new MeshStandardMaterial({ color: 0xff00ff }),
  instanced: {
    count: 50000,
    createInstance,
  },
});

instancedScene.add([InstancedBox, InstancedBox2]);

export default instancedScene;
