import { Euler, Intersection, Matrix4, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBoximport { IvyCamera } from "../../ivy-core/Elements/IvyCameraort { IvyLight } from "../ivy../ivy-core/Elements/IvyLight IvyScene, { defaultLights } from "../ivy-co../ivy-core/Scene/IvySceneteractionScene = new IvyScene({
  controls: "orbit",
  elements: defaultLights(),
});

const box = new IvyBox({
  position: new Vector3(-2, 0, 0)
});
const box1 = new IvyBox({ });
const box2 = new IvyBox({
  position: new Vector3(2, 0, 0)
});

interactionScene.onSceneReady = () => {
  box.addEventListener('click', (event) => {
    const mesh = event.object;
    mesh.scale.addScalar(0.2);
  })
  box1.addEventListener('click', (event) => {
    const mesh = event.object;
    mesh.scale.addScalar(0.2);
  })
  box2.addEventListener('click', (event) => {
    const mesh = event.object;
    mesh.scale.addScalar(0.2);
  })
}

interactionScene.add([box, box1, box2]);

export default interactionScene;
