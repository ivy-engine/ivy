import { ConeGeometry, Euler } from "three";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const scene = new IvyScene("Line edges");

scene.add(
  new IvyObject({
    color: 0x00ff00,
    geometry: new ConeGeometry(6, 6, 10),
    line: { type: "segments" },
  })
);

scene.add(
  new IvyObject({
    color: 0xff2244,
    rot: new Euler(Math.PI, 0.3, 0), 
    geometry: new ConeGeometry(6, 6, 10),
    line: { type: "segments", dashed: true, dashSize: 0.03, gapSize: 0.01 },
  })
);

scene.onMount = () => {
  if (scene.core?.controls) {
    scene.core.controls.autoRotate = true;
  }
};

const lineEdges = scene;
export default lineEdges;
