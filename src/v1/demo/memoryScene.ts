import { AmbientLight, BoxGeometry, DirectionalLight, Euler, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, PointLight, Vector3 } from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const memoryScene = new IvyScene("Shadow Scene");

memoryScene.add(new IvyObject({
    name: "lightA",
    pos: new Vector3(0, 0, -2),
    light: new PointLight(0xffffff, 0.8),
    shadow: true,
}),
new IvyObject({
    name: "lightA",
    pos: new Vector3(0, 0, 2),
    light: new PointLight(0xaa0033, 1),
    shadow: true,
}),
new IvyObject({
  name: "lightA",
  light: new AmbientLight(0xffffff, 0.1),
}))

let to: any = 0;
memoryScene.onMount = () => {
  to = setInterval(() => {
    const b = new IvyObject({
      material: new MeshPhongMaterial( { 
        color: 0xffffff * Math.random(),
        // envMap: envMap, // optional environment map
        specular: 0xffffff * Math.random(),
        shininess: 50 * Math.random() + 50
    } ) ,
    
      pos: new Vector3(
        0,
        15,
        // ((i / 10) - 5) * -1,
      ),
     
      scale: new Vector3(5,.15,.1),
    });
    b.update = (o) => {
      if (o.pos.y < -15) {
        o.destroy();
      }
      o.pos.y -= 0.15;
    }
    memoryScene.add(b);
  },5);
};

memoryScene.onDestroy = () => {
  clearInterval(to);
}

export default memoryScene;
