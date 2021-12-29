import { group_outros } from "svelte/internal";
import { BoxGeometry, BufferGeometry, Euler, Float32BufferAttribute, Group, Mesh, PlaneGeometry, Points, PointsMaterial, TorusKnotGeometry, Vector3 } from "three";
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler'
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const scene = new IvyScene('Shadow Scene');

scene.add(...defaultLights());

const obj = new IvyObject({
  geometry: new TorusKnotGeometry(4, 1.3, 100, 16) ,
  addToScene: false,
  group: true,
  scale : new Vector3(0.5, 0.5, 0.5),
  surfaceScattering: {
    count: 10000, 
    sampler: MeshSurfaceSampler,
    pointMaterial: new PointsMaterial({
      color: 0xaaaaaa + Math.random() * 0x222222,
      size: .03,
    })
  }
})

obj.update = ({rot}) => {
  rot.y += 0.001;
  rot.x += 0.001;
}

scene.add(obj);

const surfaceScatteringScene = scene;
export default surfaceScatteringScene;