import {
  CatmullRomCurve3,
  Vector3,
} from "three";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";
import * as GeometryUtils from "three/examples/jsm/utils/GeometryUtils.js";

const scene = new IvyScene('Line');

const subdivisions = 10;
const recursion = 1;

const shapeSize = 3;
const points = GeometryUtils.hilbert3D(
  new Vector3(0, 0, 0),
  shapeSize,
  recursion
);
const spline = new CatmullRomCurve3(points);
const samples = spline.getPoints(points.length * subdivisions);

scene.add(
  new IvyObject({
    line: {
      points: samples,
      linewidth: 0.14,
      color: ([, y, z]) => [1, Math.sin(y / 2), Math.sin(z / 2)],
    },
  })
);

scene.onMount = () => {
  if (scene.core?.controls) {
    scene.core.controls.autoRotate = true;
  }
};

const lineScene = scene;
export default lineScene;
