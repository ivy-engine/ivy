import { ContactMaterial, Material } from "cannon-es";
import { BoxGeometry, Color, Euler, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyCamera } from "../ivy-core/Elements/IvyCamera";
import { IvyLight } from "../ivy-core/Elements/IvyLight";
import IvyScene from "../ivy-core/Scene/IvyScene";

const physicsScene = new IvyScene({
  physics: true,
  camera: new IvyCamera({
    position: new Vector3(0, 10, 8),
    rotation: new Euler(-Math.PI / 3.5, 0, 0),
  }),
});

const light = new IvyLight();
const ambient = new IvyLight({ type: "ambient", intensity: 0.4 });
physicsScene.add([light, ambient]);

const floorMaterial = new Material("tile");
const floor = new IvyBox({
  geometry: new BoxGeometry(12, 0.1, 12),
  physicsMaterial: floorMaterial,
  mass: 0,
});

const tileMaterial = new Material("tile");

const tileContact = new ContactMaterial(tileMaterial, tileMaterial, {
  friction: 0.006,
});

const floorTileContact = new ContactMaterial(floorMaterial, tileMaterial, {
  contactEquationStiffness: 1000,
});

physicsScene.physicsWorld?.addContactMaterial(tileContact);
physicsScene.physicsWorld?.addContactMaterial(floorTileContact);

const tiles = 18;
const r = tiles / 6;
const theta = Math.PI / tiles;
const T = Math.PI * 2;
const max = T / theta;

const cubes = Array.from({ length: max }, (_, i) => {
  const x = r * Math.cos(theta * i);
  const y = r * Math.sin(theta * i);
  const rotate = -((i * Math.PI) / max) * 2 + Math.PI / 2;
  return new IvyBox({
    position: new Vector3(x, 1, y),
    geometry: new BoxGeometry(0.1, 1.2, 0.5),
    rotation: new Euler(0, rotate, 0),
    physicsMaterial: tileMaterial,
    color: new Color(Math.random() * (0xffffff / 2)),
    mass: 1,
  });
});

cubes[0].mesh.rotation.z = 3;

physicsScene.add([floor, ...cubes]);

export default physicsScene;
