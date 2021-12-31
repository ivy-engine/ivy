import { group_outros } from "svelte/internal";
import { BoxGeometry, BufferGeometry, Color, Euler, Float32BufferAttribute, Group, Mesh, PlaneGeometry, Points, PointsMaterial, TextureLoader, TorusKnotGeometry, Vector3 } from "three";
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler'
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";
import dotTexture from "../textures/dotTexture";

const scene = new IvyScene('Shadow Scene');

scene.add(...defaultLights());

const colorPalette = [
  new Color(0xFF3D68),
  new Color(0xFFA824),
]



const obj = new IvyObject({
  geometry: new TorusKnotGeometry(4, 1.3, 100, 16) ,
  addToScene: false,
  pos: new Vector3(0, -.5, 0), 
  group: true,
  surfaceScattering: {
    count: 15000, 
    sampler: MeshSurfaceSampler,
    pointMaterial: new PointsMaterial({
      size: 0.08,
      alphaTest: 0.3, 
      map: new TextureLoader().load(dotTexture),
    }),
    color: (_, pos) => {
      const x = new Color(colorPalette[0]).lerp(colorPalette[1], pos.y / 4);
      return [x.r, x.g, x.b];
    },
  }
})

obj.update = ({rot}) => {
  rot.y += 0.003;
  rot.z -= 0.001;
}

scene.add(obj);

const surfaceScatteringScene = scene;
export default surfaceScatteringScene;