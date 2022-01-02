import {
  BoxGeometry,
  ConeGeometry,
  Euler,
} from "three";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const scene = new IvyScene("Line edges");

scene.add(
  new IvyObject({
    color: 0x00ff00,
    geometry: new ConeGeometry(6, 6, 10),
    line: { type: "outline" },
  })
);

scene.add(
  new IvyObject({
    color: 0xff2244,
    rot: new Euler(Math.PI, 0.3, 0),
    geometry: new ConeGeometry(6, 6, 10),
    line: { type: "wireframe", dashed: true },
  })
);

scene.add(
  new IvyObject({
    color: 0x0022aa,
    geometry: new BoxGeometry(8, 8, 8, 10, 10, 10),
    line: { type: "outline", linewidth: 0.09 },
  })
);

scene.onMount = () => {
  if (scene.core?.controls) {
    scene.core.controls.autoRotate = true;
  }
};

const lineEdges = scene;
export default lineEdges;
