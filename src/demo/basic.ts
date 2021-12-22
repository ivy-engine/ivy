import { BoxGeometry, Color, DirectionalLight, Euler, Group, Object3D, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyLight } from "../ivy-core/Elements/IvyLight";
import IvyScene from "../ivy-core/Scene/IvyScene";

const testScene = new IvyScene();
const light = new IvyLight();
const ambient = new IvyLight({
  type: 'ambient',
  intensity: 0.4,
});
testScene.add([ambient, light]);

const box = new IvyBox({
  name: 'box 1',
  group: true, 
  color: new Color(0x00ff00),
  scale: new Vector3(0.5, 0.5, 4),
  rotation: new Euler(0, Math.PI / 2, 0),
});


const box2 = new IvyBox({
  group: true,
  rotation: new Euler(0, 0, -Math.PI / 2),
  position: new Vector3(0, 0.25, 0),
  geometry: new BoxGeometry(2, 0.2, 0.2),
  color: new Color(0x0000ff)
})
box2.mesh.position.x = -1

const box3 = new IvyBox({
 group: true, 
  position: new Vector3(-2, 0, 0),
  geometry: new BoxGeometry(2, 0.2, 0.2),
  color: new Color(0x00ff00)
});
box3.mesh.position.x = -1

const box4 = new IvyBox({
 group: true, 
  position: new Vector3(-2, 0, 0),
  geometry: new BoxGeometry(2, 0.2, 0.2),
  color: new Color(0xff0000)
});
box4.mesh.position.x = -1

box.add(box2);
box2.add(box3);
box3.add(box4)

const floor = new IvyBox({
  geometry: new BoxGeometry(10, 0.1, 10),
  position: new Vector3(0, -0.5, 0),
});

testScene.add([floor, box]);

box.draw = ({group}) => {
  if (group) {
    group.rotation.y += 0.006;
  }
}

box3.draw = ({group}) => {
  if (group) {
    group.rotation.y = Math.sin(Date.now() / 1000) * 0.5;
  }
}
box4.draw = ({group}) => {
  if (group) {
    group.rotation.y = Math.sin(Date.now() / 1000) * 0.5;
  }
}


export default testScene;