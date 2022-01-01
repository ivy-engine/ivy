import { Vector3 } from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const xScene = new IvyScene('Shadow Scene');

xScene.add(...defaultLights());

const x = new IvyObject({
  name: 'box',
  pos: new Vector3(0.5, 0, 0), 
  shadow: true, 
  color: 0xaaafff,
})
xScene.add(x);

export default xScene;
