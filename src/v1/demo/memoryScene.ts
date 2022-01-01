import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Euler,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  Vector3,
} from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const memoryScene = new IvyScene("Shadow Scene");

memoryScene.add(
  new IvyObject({
    pos: new Vector3(0, 0, 1),
    light: new PointLight(0x000ddd, 0.8),
    shadow: true,
  }),
  new IvyObject({
    pos: new Vector3(0, 0, -1),
    light: new PointLight(0xdd00aa, 0.8),
    shadow: true,
  }),
  new IvyObject({
    pos: new Vector3(0, 5, 0),
    light: new PointLight(0xffffff, 0.8),
    shadow: true,
  }),
  new IvyObject({
    pos: new Vector3(0, -5, 0),
    light: new PointLight(0xaa00aa, 1),
    shadow: true,
  }),
);

let to: any = 0;
memoryScene.onMount = () => {
  to = setInterval(() => {
    const b = new IvyObject({
      name: "box",
      material: new MeshPhongMaterial(),
      pos: new Vector3(Math.random() * 10 - 5, 7, Math.random() * 2 - 1),
      scale: new Vector3(0.08, 0.5, 0.08),
      props: {
        speed: Math.random() * 0.2 - 0.1,
      }
    });

    b.update = (o) => {
      if (o.pos.y < -8) {
        o.destroy();
      }
      o.pos.y -= 0.3 * Math.abs(o.props.speed) + 0.06;
      o.rot.y += o.props.speed;
    };

    memoryScene.add(b);
  });
};

memoryScene.onDestroy = () => {
  clearInterval(to);
};

export default memoryScene;
