import { BoxGeometry, PlaneGeometry } from "three";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const shadowScene = new IvyScene('Shadow Scene');

shadowScene.add(new IvyObject({
  geometry: new BoxGeometry(10, 1, 10),
  name: 'floor',
}))

shadowScene.add(new IvyObject({
  name: 'box',
}))

export default shadowScene;