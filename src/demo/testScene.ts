import { BoxGeometry, Color, Euler, Group, Object3D, Vector3 } from "three";
import { Box } from "../ivy-core/Elements/Box";
import Scene from "../ivy-core/Scene/Scene";

const testScene = new Scene()

const box = new Box({
  name: 'box 1',
  group: true, 
  color: new Color(0x00ff00),
  position: new Vector3(0, 2, 0),
  scale: new Vector3(0.5, 0.5, 4),
});

const box2 = new Box({
  name: 'box 2',
  group: true,
  position: new Vector3(0, 1, 0),
  color: new Color(0x00ffff)
});

const box3 = new Box({
  name: 'box 3',
  position: new Vector3(-1.5, 0, 0),
  color: new Color(0xfff000)
});

box.add(box2);
box2.add(box3)

const floor = new Box({
  geometry: new BoxGeometry(10, 0.1, 10),
  position: new Vector3(0, -2, 0),
});

testScene.add([floor, box]);

box.draw = ({group}) => {
  if (group) {
    const delta = Math.sin(Date.now() / 1000);
    group.position.set(delta, 2, delta);
    group.rotation.setFromVector3(group.position);
  }
}

box2.draw = ({group}) => {
  if (group) {
    group.rotation.y = Math.sin(Date.now() / 2000) * 2;
  }
  // rotation.z = Math.sin(Date.now() / 2000) * 2;
  // position.y = Math.sin(Date.now() / 1000);
}

// box3.draw = ({mesh: {rotation, position}}) => {
//   rotation.y = Math.cos(Date.now() / 2000) * 2;
//   position.y = Math.sin(Date.now() / 2000) * 2;
//   position.y = Math.sin(Date.now() / 1000);
// }


export default testScene;