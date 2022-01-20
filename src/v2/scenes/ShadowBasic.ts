import {
  CircleGeometry,
  DirectionalLight,
  Euler,
  TorusKnotGeometry,
  Vector3,
} from "three";
import ILight from "../core/El/Elements/ILight";
import IMesh from "../core/El/Elements/IMesh";
import IScene from "../core/Scene/IScene";

// Mesh to cast shadow
const torus = new IMesh({
  geometry: new TorusKnotGeometry(1.5, 0.15, 300, 20, 1, 3),
  rot: new Euler(0, Math.PI / 2, 0),
  pos: new Vector3(0, 1, 0), 
  shadow: true,
  update: ({ rot }) => {
    rot.x += .006;
    rot.y += .006;
  },
});

// floor to catch shadow
const floor = new IMesh({
  geometry: new CircleGeometry(3, 100),
  rot: new Euler(-Math.PI / 2, 0, 0),
  pos: new Vector3(0, -2, 0),
  shadow: 'receive',
});

// light from top down
const light = new ILight({
  light: new DirectionalLight(0xffffff, 1),
  pos: new Vector3(0, 10, 0),
  mapSize: {
    width: 1024,
    height: 1024,
  }, 
  shadow: true,
});

const ShadowBasic = new IScene();

ShadowBasic.add(torus, floor, light);

export default ShadowBasic;
