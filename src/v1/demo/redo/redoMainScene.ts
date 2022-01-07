import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Euler,
  ExtrudeGeometry,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  MeshPhongMaterial,
  PerspectiveCamera,
  Shape,
  Vector3,
} from "three";
import defaultLights from "../../defaultLights";
import IvyObject from "../../ivy-object/IvyObject";
import IvyScene from "../../ivy-scene/IvyScene";

const camera = new PerspectiveCamera();
camera.position.copy(new Vector3(0, 15, 0));
const scene = new IvyScene("Instanced Scene", {
  camera: camera,
});

scene.add(...defaultLights());

const SQ2d3 = 0.86602540378;
const hexSize = 2;
const bezelSize = 0.05;

const finalHexSize = hexSize - bezelSize * 2.2999999999999998;
const a = finalHexSize / 2;

const createHexagon = (): Shape => {
  const shape = new Shape();

  for (let i = 0; i < 6; i++) {
    const x = Math.cos((i * Math.PI) / 3) * a;
    const y = Math.sin((i * Math.PI) / 3) * a;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  return shape;
};

const extrudeSettings = {
  depth: 1,
  bevelSegments: 1,
  steps: 1,
  bevelSize: bezelSize,
  bevelThickness: bezelSize,
};

const geometry = new ExtrudeGeometry(createHexagon(), extrudeSettings);

const floor = new IvyObject({
  name: "floor",
  addToScene: false,
  group: true,
});

const perRow = 30;
const perColumn = 30;

const item = new IvyObject({
  name: 'grid' ,
  geometry,
  instanced: perRow * perColumn,
});


const offsetX = SQ2d3 * -1 + SQ2d3 * perRow;
const offsetY = (0.75 * hexSize * perColumn) / 2;

for (let i = 0; i < perRow; i++) {
  for (let j = 0; j < perColumn; j++) {
    const oddOffset = j % 2 === 0 ? SQ2d3 * -0.5 : SQ2d3 * 0.5;

    const pos = new Vector3(
      i * SQ2d3 * hexSize - offsetX + oddOffset,
      0,
      j * (0.75 * hexSize) - offsetY
    );

    item.addInstance({
      pos: [pos.x, pos.y, pos.z],
      rot: [Math.PI / 2, 0, Math.PI / 6],
      color: 0xffffff,
    });
  }
}

floor.add(item);
scene.add(floor);

const redoMainScene = scene;
export default redoMainScene;
