import { Euler, Matrix4, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyCamera } from "../ivy-core/Elements/IvyCamera";
import { IvyLight } from "../ivy-core/Elements/IvyLight";
import IvyScene, { defaultLights } from "../ivy-core/Scene/IvyScene";

const instancedScene = new IvyScene({
  physics: true,
  camera: new IvyCamera({
    position: new Vector3(0, -14, 12),
  }),
  elements: [new IvyLight()],
  controls: "orbit",
});

const position = new Vector3();
const rotation = new Euler();

const scale = 220;
const createInstance = (matrix: Matrix4): Matrix4 => {
  position.x = Math.random() * scale - scale / 2;
  position.y = Math.random() * scale - scale / 2;
  position.z = Math.random() * scale - scale / 2;

  rotation.x = Math.random() * 2 * Math.PI;
  rotation.y = Math.random() * 2 * Math.PI;
  rotation.z = Math.random() * 2 * Math.PI;

  matrix.makeTranslation(position.x, position.y, position.z);
  matrix.multiply(new Matrix4().makeRotationFromEuler(rotation));
  return matrix;
};

const InstancedBox = new IvyBox({
  material: new MeshStandardMaterial({ color: 0x22ddaa }),
  instanced: {
    count: 50000,
    createInstance,
  },
});

const matrix = new Matrix4();
const r = new Euler(0, 0, 0.005);
InstancedBox.draw = ({
  instanceCount,
  instanceMesh,
  instanceData = new Float32Array(0),
}) => { 
  for (let i = 0; i < instanceCount; i++) {
    const m = matrix.fromArray(instanceData, i * 16);
    m.multiply(new Matrix4().makeRotationFromEuler(r));
    instanceData.set(m.elements, i * 16); 
    instanceMesh.setMatrixAt(i, m);
  }

  instanceMesh.rotation.y += 0.0002;
  instanceMesh.instanceMatrix.needsUpdate = true;
};

instancedScene.add([InstancedBox]);

export default instancedScene;
