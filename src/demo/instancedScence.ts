import {
  BoxGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Vector3,
} from "three";
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

const randomizeMatrix = (function () {
  const position = new Vector3();
  const rotation = new Euler();

  return function (matrix) {
    position.x = Math.random() * 100 - 50;
    position.y = Math.random() * 100 - 50;
    position.z = Math.random() * 100 - 50;

    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    matrix.makeTranslation(position.x, position.y, position.z);
    matrix.premultiply(new Matrix4().makeRotationFromEuler(rotation));
  };
})();


  const geometry = new BoxGeometry(0.1, 0.1, 0.5);
  const material = new MeshStandardMaterial({color: 0xffffff});

  const amount = 60000;

  const matrix = new Matrix4();
  const mesh = new InstancedMesh(geometry, material, amount);

instancedScene.onSceneReady = () => {

  const scene = instancedScene.rawScene;

  for (let i = 0; i < amount; i++) {
    randomizeMatrix( matrix );
    mesh.setMatrixAt( i, matrix );
  }

    scene.add(mesh);
};


export default instancedScene;
