import {
  BoxGeometry,
  ConeGeometry,
  Euler,
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
import * as CANNON from "cannon-es";

var slipperyMat = new CANNON.Material();
var friction = 0.9;
var restitution = 0.2;
var slipperyContact = new CANNON.ContactMaterial(slipperyMat,slipperyMat,{
  friction: friction,
  restitution: restitution,
});


const ball = (x: number) =>
  new IMesh({
    geometry: new SphereGeometry(1),
    rot: new Euler(Math.PI / 4, 0, 0),
    pos: new Vector3(x, 0, 0),
    mass: 1,
    shadow: true,
    physicsMaterial: slipperyMat,
    update: ({ body, pos }) => {
      if (body) {
        if (pos.distanceTo(new Vector3(0, 0, 0)) > 20) {
          // reset
          body.position = new Vec3(x, 0, 0);
          body.velocity = new Vec3(0, 0, 0);
          body.angularVelocity = new Vec3(0, 0, 0);
          body.quaternion.set(0, 0, 0, 1);
        }
      }
    },
  });

const balls = [ball(0)];

const floor = new IGroup({
  name: 'floor', 
  rot: new Euler(Math.PI / 2, 0, 0),
//  pos: new Vector3(0 , 2, 0), 
  update: ({ rot }) => {
    rot.y -= 0.005;
  }
});


const items = 14;
const rad = 4;
for (let i = 0; i < items; i++) {
  const floorMaterial = new MeshStandardMaterial({ color: 0xffffff });
  // arrange items in a circle
  const angle = (i / items) * Math.PI * 2;
  const x = Math.cos(angle) * rad;
  const z = Math.sin(angle) * rad;
  const el = new IMesh({
    name: 'item', 
    staticBody: true, 
    geometry: new BoxGeometry(1, 3, 0.1),
    pos: new Vector3(x, 0, z),
    material: floorMaterial,
    physicsMaterial: slipperyMat, 
    shadow: true, 
    mass: 0,
  });

  floor.add(el);
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

const PhysicsGroup = new IScene({
  physics: true,
  onReady: ({world}) => {
    if (world) world.addContactMaterial(slipperyContact);
  }
});
PhysicsGroup.add(...balls, floor, ...defaultLights());

export default PhysicsGroup;
