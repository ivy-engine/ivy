import {Color, PointsMaterial, TextureLoader, TorusKnotGeometry, Vector3 } from "three";
import {MeshSurfaceSampler} from 'three/examples/jsm/math/MeshSurfaceSampler'
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";
import dotTexture from "../textures/dotTexture";

const scene = new IvyScene('Shadow Scene');
const colorPalette = [
  new Color(0xaa3D68),
  new Color(0xFFA824),
  new Color(0x22E822), 
]

const obj = new IvyObject({
  geometry: new TorusKnotGeometry(3, 1.4, 100, 20, 2, 1) ,
  addToScene: false,
  group: true,
  surfaceScattering: {
    count: 30000, 
    sampler: MeshSurfaceSampler,
    pointMaterial: new PointsMaterial({
      size: 0.08,
      alphaTest: 0.6, 
      map: new TextureLoader().load(dotTexture),
    }),
    color: (_, pos) => {
      let x = new Color(colorPalette[0]).lerp(colorPalette[1], pos.y / 5);
      x = x.lerp(colorPalette[2], pos.z / 4);
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