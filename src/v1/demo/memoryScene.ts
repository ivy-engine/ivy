import { AmbientLight, BoxGeometry, Euler, PlaneGeometry, Vector3 } from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const memoryScene = new IvyScene("Shadow Scene");

memoryScene.add(...defaultLights());

let to: any = 0;
memoryScene.onMount = () => {
  to = setInterval(() => {
    const b = new IvyObject({
      color: 0xffffff * Math.random(),
      pos: new Vector3(
        Math.random() * 12 - 6,
        Math.random() * 12 - 6,
        Math.random() * 12 - 6
      ),
     
      rot: new Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
     
      scale: new Vector3(8,.1,.1),
    });
    memoryScene.add(b);
    setTimeout(() => {
      b.destroy();
    }, 200);
  });
};

memoryScene.onDestroy = () => {
  clearInterval(to);
}

export default memoryScene;
