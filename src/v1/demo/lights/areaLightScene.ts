import IvyScene from "../../ivy-scene/IvyScene";
import defaultLights from "../../defaultLights";
import IvyObject from "../../ivy-object/IvyObject";
import {RectAreaLightUniformsLib} from "three/examples/jsm/lights/RectAreaLightUniformsLib";
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

const cam = new PerspectiveCamera();
cam.position.copy(new Vector3(0, 0, 13));

const ivyScene = new IvyScene("Area Light", {
  camera: cam,
});

const renderLightPlane = true;

const createLight = (pos: Vector3, color: number) => {
  const width = 6;
  const height = 20;
  const o = new IvyObject({
    name: `Color Group ${color}`, 
    pos,
    group: true, 
    addToScene: false, 
    rot: new Euler(0, Math.PI, 0), 
  });

  o.add(new IvyObject({
    name: `Light ${color}`,
    light: new RectAreaLight(color, 5, width, height),
  }))

  if (renderLightPlane) o.add(new IvyObject({
    name: `Light Plane ${color}`, 
    geometry: new PlaneGeometry(width, height, 1, 1),
    rot: new Euler(0, Math.PI, 0), 
    material: new MeshBasicMaterial({ color: color }),
  }));

  return o;
};

RectAreaLightUniformsLib.init();

const lights = [
  createLight(new Vector3(-7, 0, -5), 0xff0000),
  createLight(new Vector3(0, 0, -5), 0x0000ff),
  createLight(new Vector3(7, 0, -5), 0x00ff00),
];

const obj = new IvyObject({
  geometry: new TorusKnotGeometry(3, 0.26, 200, 20, 3, 4),
  material: new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0,
  }),
  rot: new Euler(Math.PI / 2, 0, 0), 
});

ivyScene.add(obj, ...lights);

obj.update = ({ rot }) => {
  rot.z += 0.005;
};

const areaLightScene = ivyScene;
export default areaLightScene;
