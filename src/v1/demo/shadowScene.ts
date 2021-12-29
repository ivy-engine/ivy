import { BoxGeometry, Euler, PlaneGeometry, Vector3 } from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const shadowScene = new IvyScene('Shadow Scene');

shadowScene.add(...defaultLights());

shadowScene.add(new IvyObject({
  geometry: new BoxGeometry(10, 1, 10),
  pos: new Vector3(0, -2, 0), 
  rot: new Euler(0, 0.1, 0),
  name: 'floor',
  shadow: true, 
}))

shadowScene.add(new IvyObject({
  name: 'box',
  pos: new Vector3(-0.5, 0, 0), 
  shadow: true, 
  color: 0x0f20f3,
}))

export default shadowScene;