import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Euler,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  SphereGeometry,
  Vector3,
} from "three";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";
import createSky from "../lib/createSky";

const cam = new PerspectiveCamera();
cam.position.copy(new Vector3(0, 0, 13));

const skyScene = new IvyScene("Shadow Scene", {
  camera: cam,
});

skyScene.add(
  new IvyObject({
    pos: new Vector3(50, 5.6, -30),
    light: new DirectionalLight(0xffeeee, 1),
    shadow: true,
  }),
  new IvyObject({
    light: new AmbientLight(0xeeefff, 0.2),
  }),
  new IvyObject({ shadow: true,
   pos: new Vector3(0, -1, 0), 
    geometry: new SphereGeometry(1, 40, 40, 2),
    material: new MeshStandardMaterial({ color: 0x88d22a, roughness: 0, metalness: 0.1 }),
    }),
  new IvyObject({
    shadow: true,
    pos: new Vector3(0, -2.1, 0),
    geometry: new PlaneGeometry(2000, 2000, 1, 1),
    material: new MeshStandardMaterial({ color: 0xf0ccae, metalness: 0.6 }),
    rot: new Euler(-Math.PI / 2, 0, 0),
  }),
  new IvyObject({
    object: createSky(),
  }),
);

skyScene.onMount = (scene) => {
  if (scene.core?.controls) {
    scene.core.controls.autoRotate = true;
  }
};

export default skyScene;
