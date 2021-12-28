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

xScene.add(new IvyObject({
  name: 'box',
  shadow: true, 
  color: 0xaaafff,
}))

export default xScene;