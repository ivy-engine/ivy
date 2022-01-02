import IvyScene from "../../ivy-scene/IvyScene";
import defaultLights from "../../defaultLights";
import IvyObject from "../../ivy-object/IvyObject";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { PointsMaterial, Vector3 } from "three";

const ivyScene = new IvyScene('Text Scene');
ivyScene.add(...defaultLights());

const ivyText = new IvyObject({
  text: 'Ivy',
  pos: new Vector3(0, 1, 0), 
  font: {
    ttfFile: 'Audiowide-Regular.ttf',
    size: 12,
    height: 4,
  },
  addToScene: false,
  surfaceScattering: {
    count: 60000, 
    sampler: MeshSurfaceSampler,
    pointMaterial: new PointsMaterial({
      size: 0.01,
    }),
    color: 0x22E822,
  }
});

ivyScene.add(ivyText);

ivyScene.onMount = (scene) => {
  if (scene.core?.controls) {
    scene.core.controls.autoRotate = true;
  }
};

const testScatterScene = ivyScene;
export default testScatterScene;