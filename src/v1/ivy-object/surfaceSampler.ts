import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Material,
  Object3D,
  Points,
  Vector3,
} from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import IvyObject from "./IvyObject";

export interface SurfaceScatteringOptions {
  count: number;
  sampler: typeof MeshSurfaceSampler;
  pointMaterial: Material;
  color?:
    | number
    | Color
    | ((i: number, pos: Vector3, obj: IvyObject) => [number, number, number]);
}

export default function surfaceSampler(
  object: Object3D,
  { sampler, pointMaterial, count, color = 0xffffff }: any
): Points {
  let uniqueColor = typeof color === "function";
  let colors: Float32Array = new Float32Array(0);

  if (uniqueColor) {
    colors = new Float32Array(count * 3);
    pointMaterial.vertexColors = true;
  } else {
    pointMaterial.color.set(color);
  }

  const samplerInstance = new sampler(object).build();

  const vertices = new Float32Array(count * 3);
  const tmpPos = new Vector3();

  const pointGeo = new BufferGeometry();

  for (let i = 0; i < count; i++) {
    samplerInstance.sample(tmpPos);
    vertices.set([tmpPos.x, tmpPos.y, tmpPos.z], i * 3);

    if (uniqueColor) {
      colors.set(color(i, tmpPos), i * 3);
    }
  }

  pointGeo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  pointGeo.setAttribute("color", new Float32BufferAttribute(colors, 3));

  return new Points(pointGeo, pointMaterial);
}
