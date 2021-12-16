import { BoxGeometry, Color, Euler, Vector3 } from "three";
import { Box } from "../ivy-core/Elements/Box";
import Scene from "../ivy-core/Scene/Scene";

const testScene = new Scene()

const box = new Box({
  color: new Color(0x00ff00),
  position: new Vector3(0, 2, 0),
  scale: new Vector3(0.5, 0.5, 4),
});
const box2 = new Box({
  position: new Vector3(0, -1, 0),
  color: new Color(0x00ffff)
});
const floor = new Box({
  geometry: new BoxGeometry(10, 0.1, 10),
  position: new Vector3(0, -2, 0),
});

testScene.add([floor, box, box2]);

box.draw = ({mesh: {position, rotation}}) => {
  const delta = Math.sin(Date.now() / 1000) * 2;
  position.set(delta, 2, delta);
  rotation.setFromVector3(position);
}

box2.draw = ({mesh: {rotation}}) => {
  rotation.x = Math.sin(Date.now() / 1000) * 2;
}


export default testScene;