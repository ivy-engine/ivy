import { group_outros } from "svelte/internal";
import { BoxGeometry, BufferGeometry, Euler, Float32BufferAttribute, Group, Mesh, PlaneGeometry, Points, PointsMaterial, TorusKnotGeometry, Vector3 } from "three";
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler'
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const scene = new IvyScene('Shadow Scene');

scene.add(...defaultLights());

const obj = new IvyObject({
  name: 'box',
  shadow: true, 
  geometry: new TorusKnotGeometry(4, 1.3, 100, 16) ,
  color: 0x0f20f3,
  addToScene: false,
  group: true,
  scale : new Vector3(0.5, 0.5, 0.5),
})

obj.update = ({rot}) => {
  rot.y += 0.001;
  rot.x += 0.001;
}


scene.core?.mainCamera.position.set(0, 0, 20);

const sampler = new MeshSurfaceSampler(obj.object as Mesh).build();

const num = 20000;
const vertices = new Float32Array(num * 3);
const tmpPos = new Vector3();
for (let i = 0; i < num; i++) {
  sampler.sample(tmpPos);
  vertices.set([tmpPos.x, tmpPos.y, tmpPos.z], i * 3);
}

const pointGeo = new BufferGeometry();
pointGeo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
const pointsMat = new PointsMaterial({
  color: 0xaaaaaa + Math.random() * 0x222222,
  size: 0.03,
})

const points = new Points(pointGeo, pointsMat);
obj.group!.add(points);


scene.add(obj);

const surfaceScatteringScene = scene;
export default surfaceScatteringScene;