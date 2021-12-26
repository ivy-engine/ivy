import { Euler, Intersection, Matrix4, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyCamera } from "../ivy-core/Elements/IvyCamera";
import { IvyLight } from "../ivy-core/Elements/IvyLight";
import IvyScene, { defaultLights } from "../ivy-core/Scene/IvyScene";

const interactionScene = new IvyScene({
  controls: "orbit",
  elements: defaultLights(),
});

const box = new IvyBox({
  // material: new MeshStandardMaterial({ color: 0x22ddaa }),
});

box.onIntersectedEnter = (event) => {
  const mesh = event.object;
  mesh.currentHex = mesh.material.emissive.getHex();
  mesh.material.emissive.setHex( 0xff0000 );
}
box.onIntersectedLeave = (event) => {
  const mesh = event.object;
  mesh.material.emissive.setHex( mesh.currentHex );
}

interactionScene.add([box]);

export default interactionScene;
