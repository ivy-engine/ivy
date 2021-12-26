import { BoxGeometry, Color, DirectionalLight, Euler, Group, Object3D, Scene, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyLight } from "../ivy-core/Elements/IvyLight";
import IvyScene, { defaultLights } from "../ivy-core/Scene/IvyScene";



const memoryScene = new IvyScene({
  elements: defaultLights(),
  controls: "orbit",
});


memoryScene.onSceneReady = () => {
setInterval(() => {
  const randomRotation = new Euler(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  );
 const randomPos = new Vector3(
    Math.random() * 6 - 3,
    Math.random() * 6 - 3,
    Math.random() * 6 - 3
 ); 
  const box = new IvyBox({
    name: 'box 1',
    group: true, 
    color: new Color(0x00ff00 + Math.random() * 0xffffff),
    scale: new Vector3(0.5, 0.5, 4),
    position: randomPos,
    rotation: randomRotation,
  });
  
  memoryScene.add([box]);
 
  setTimeout(() => {
    box.dispose();
  }, 200)
}, 1)
}

export default memoryScene;