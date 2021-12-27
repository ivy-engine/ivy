import { Euler, Vector3 } from "three";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const basicScene = new IvyScene('basicScene');



let intv;
basicScene.onMount = () => {
   console.log('on Mount now') 
  intv = setInterval(() => {
    const scale = 2;
    const box = new IvyObject({
      name: 'box 3',
      color: Math.random() * 0xffffff,
      pos: new Vector3(Math.random() * scale - scale/2, Math.random() * scale - scale/2, Math.random() * scale - scale/2),
      rot: new Euler(Math.random() * scale - scale/2, Math.random() * scale - scale/2, Math.random() * scale - scale/2),
      scale: new Vector3(0.5, 0.5, 0.1), 
    });
    basicScene.add(box);

    setTimeout(() => {
      box.destroy();
    }, 400)
  }, 16);
}

basicScene.onDestroy = () => {
  console.log('on destroy')
  clearInterval(intv);
}

export default basicScene;