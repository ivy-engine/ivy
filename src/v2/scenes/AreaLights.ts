import { Euler, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, RectAreaLight, TorusKnotGeometry, Vector3 } from "three";
import {RectAreaLightUniformsLib} from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import IGroup from "../core/El/Elements/IGroup";
import ILight from "../core/El/Elements/ILight";
import IMesh from "../core/El/Elements/IMesh";
import IScene from "../core/Scene/IScene";

RectAreaLightUniformsLib.init();

const lightGroup = (x: number, color: number) => new IGroup({
  items: [
    new IMesh({
      geometry: new PlaneGeometry(4, 10),
      material: new MeshBasicMaterial({ color }), 
      rot: new Euler(0, Math.PI, 0), 
    }),
    new ILight({
      light: new RectAreaLight(color, 1, 4, 10),
    })
  ],
  pos: new Vector3(x * 2.1, 0, -1),
  rot: new Euler(0, Math.PI, 0),
})

const l1 = lightGroup(0, 0xff0000);
const l2 = lightGroup(2, 0x00ff00);
const l3 = lightGroup(-2, 0x0000ff);

const o = new IMesh({
  geometry: new TorusKnotGeometry(2.2, 0.3, 200, 20, 3, 2),
  material: new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0,
  }),
  rot: new Euler(Math.PI / 2, 0, 0), 
  pos: new Vector3(0, 0, 2.2), 
})

const mainCamera = new PerspectiveCamera();
mainCamera.position.copy(new Vector3(0, 0, 13));
const AreaLight = new IScene({
  camera: mainCamera
});
AreaLight.add(l1, l2, l3, o);

export default AreaLight;