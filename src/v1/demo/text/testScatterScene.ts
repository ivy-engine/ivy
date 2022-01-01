import IvyScene from "../../ivy-scene/IvyScene";
import defaultLights from "../../defaultLights";
import IvyObject from "../../ivy-object/IvyObject";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { PointsMaterial, Vector3 } from "three";

const ivyScene = new IvyScene('Text Scene');
ivyScene.add(...defaultLights());

const ivyText = new IvyObject({
  text: 'Ivy',
  pos: new Vector3(0, 2.5, 0), 
  font: {
    ttfFile: 'Audiowide-Regular.ttf',
    size: 20,
    height: 2,
    bevelThickness: 2,
    bevelSize: 0.2
  },
  addToScene: false,
  surfaceScattering: {
    count: 50000, 
    sampler: MeshSurfaceSampler,
    pointMaterial: new PointsMaterial({
      size: 0.01,
    }),
    color: 0x22E822,
  }
});

ivyScene.add(ivyText);

ivyText.update = ({rot}) => { 
  rot.y += 0.01;
}

const testScatterScene = ivyScene;
export default testScatterScene;