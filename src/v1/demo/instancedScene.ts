import {
  BoxGeometry,
  MeshStandardMaterial,
  PerspectiveCamera,
  Vector3,
} from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const camera = new PerspectiveCamera();
camera.position.copy(new Vector3(30, 30, 40));
const scene = new IvyScene("Instanced Scene", {
  camera,
});

scene.add(...defaultLights());

const count = 20;
const total = count ** 3;

const item = new IvyObject({
  geometry: new BoxGeometry(),
  instanced: total,
  material: new MeshStandardMaterial({color: 0xeeeeee}),
});

const space = 1.6;
const offset = new Vector3().setScalar(count * space / 2);
console.time("instancing");
for (let x = 0; x < count; x++) {
  for (let y = 0; y < count; y++) {
    for (let z = 0; z < count; z++) {
      item.addInstance({
        pos: new Vector3(x * space, y * space, z * space).sub(offset),
      });
    }
  }
}
console.timeEnd("instancing");

scene.add(item);

scene.onMount = () => {
  if (scene.core?.controls) {
    scene.core.controls.autoRotate = true;
  }
};

const instancedScene = scene;
export default instancedScene;
