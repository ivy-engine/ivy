import {
  BoxGeometry,
  Euler,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RectAreaLight,
  TorusKnotGeometry,
  Vector3,
} from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import IGroup from "../core/El/Elements/IGroup";
import ILight from "../core/El/Elements/ILight";
import IMesh from "../core/El/Elements/IMesh";
import IScene from "../core/Scene/IScene";

RectAreaLightUniformsLib.init();

let x = -4;
const lightGroup = (color: number) =>
  new IGroup({
    items: [
      new IMesh({
        geometry: new PlaneGeometry(1.9, 6),
        material: new MeshBasicMaterial({ color }),
        rot: new Euler(0, Math.PI, 0),
      }),
      new ILight({
        light: new RectAreaLight(color, 1, 1.9, 6),
      }),
    ],
    pos: new Vector3((x += 2), 0, -2),
    rot: new Euler(0, Math.PI, 0),
  });

const lightPanes = [0xff0000, 0x00ff00, 0x0000ff].map(lightGroup);

const material = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0,
});

const torus = new IMesh({
  geometry: new TorusKnotGeometry(.9, 0.4, 200, 20, 1, 1),
  material,
  rot: new Euler(0, Math.PI / 2, 0),
  update: ({ rot }) => {
    rot.z += .01;
  },
});

const floor = new IMesh({
  geometry: new PlaneGeometry(200, 200),
  material,
  rot: new Euler(-Math.PI / 2, 0, 0),
  pos: new Vector3(0, -2.8, 98),
});

const mainCamera = new PerspectiveCamera();
mainCamera.position.copy(new Vector3(0, 0, 7));
const AreaLight = new IScene({
  camera: mainCamera,
});

AreaLight.add(...lightPanes, torus, floor);

export default AreaLight;
