import {
  BoxGeometry,
  MeshStandardMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from "three";
import IGroup from "../core/El/Elements/IGroup";
import IMesh from "../core/El/Elements/IMesh";
import defaultLights from "../core/lib/defaultLights";
import IScene from "../core/Scene/IScene";
import image from "../core/debug.jpg";
import { Vec3 } from "cannon-es";

const ball = (x: number) =>
  new IMesh({
    geometry: new SphereGeometry(1, 32, 32),
    pos: new Vector3(x, 4, 0),
    mass: 1,
    shadow: true,
    update: ({ body }) => {
      if (body) {
        if (
          body.position.y < -10 ||
          body.position.x < -10 ||
          body.position.x > 10 ||
          body.position.z < -10 ||
          body.position.z > 10
        ) {
          // reset
          body.position = new Vec3(x, 4, 0);
          body.velocity = new Vec3(0, 0, 0);
          body.angularVelocity = new Vec3(0, 0, 0);
          body.quaternion.set(0, 0, 0, 1);
        }
      }
    },
  });

const balls = [ball(-1.9), ball(1.9)];

const floorSize = 10;
const pipeSize = 1;
const gap = 0.4;
const floor = new IGroup({
  pos: new Vector3(
    -(floorSize * pipeSize) / 2,
    -2,
    -(floorSize * pipeSize) / 2
  ),
});

const floorMaterial = new MeshStandardMaterial({ color: 0x7e2aaa });

for (let i = 0; i < floorSize; i++) {
  for (let j = 0; j < floorSize; j++) {
    const offset = Math.random() - 0.5;
    const el = new IMesh({
      geometry:
        offset > 0
          ? new SphereGeometry((pipeSize - gap) / 2)
          : new BoxGeometry(pipeSize - gap, 0.2, pipeSize - gap),
      pos: new Vector3(i * pipeSize, 0, j * pipeSize),
      material: floorMaterial,
      mass: 0,
      shadow: true,
      update: ({ body }) => {
        if (body) {
          body.position.y =
            floor.pos.y + Math.sin((Date.now() / 200) * offset) * 0.4;
        }
      },
    });

    floor.add(el);
  }
}

const loader = new TextureLoader();
loader.load(
  image,
  function (texture) {
    const material = new MeshStandardMaterial({
      map: texture,
    });
    balls.map((ball) => {
      ball.setMaterial(material);
    });
  },
  undefined
);

const PhysicsSimple = new IScene({
  physics: true,
});
PhysicsSimple.add(...balls, floor, ...defaultLights());

export default PhysicsSimple;
