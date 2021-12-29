import { BoxGeometry, Euler, PlaneGeometry, Vector3 } from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const xScene = new IvyScene('Shadow Scene');

xScene.add(...defaultLights());

xScene.add(new IvyObject({
  geometry: new BoxGeometry(10, 1, 10),
  pos: new Vector3(0, -2, 0), 
  rot: new Euler(0, 0.1, 0),
  name: 'floor',
  shadow: true, 
}))

const x = new IvyObject({
  name: 'box',
  pos: new Vector3(0.5, 0, 0), 
  shadow: true, 
  color: 0xaaafff,
})
xScene.add(x);


x.update = (o) => {
  o.rot.y -= 0.01;
}

export default xScene;
