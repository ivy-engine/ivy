import { CircleGeometry, Euler, PerspectiveCamera, SphereGeometry, Vector3, XRHitTestTrackableType } from "three";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import IvyScene from "../ivy-scene/IvyScene";

const cam = new PerspectiveCamera();
cam.position.copy(new Vector3(0, 0, 10));
const xScene = new IvyScene("Shadow Scene", {
  camera: cam,
  controls: "none",
});

xScene.add(...defaultLights());

const items = [];

  const circleSize = 1;
  const circlePos = new Vector3(-1, 2, 0);

  const circ = new IvyObject({
    geometry: new CircleGeometry(circleSize, 100),
    pos: circlePos,
    // line: {type: 'outline', linewidth: 0.08},
    rot: new Euler(0, 0, 0),
  });

items.push(
  circ,
);

xScene.add(...items);

const cursorPos = new Vector3(0, 0, 0);

let listenMouseMove = false;
var vec = new Vector3();
var pos = new Vector3();
let lastPosition: Vector3 = new Vector3();

const updateCursorPos = (scene: IvyScene) => (event) => {
  const target = scene?.core?.target;
  const camera = scene.core?.mainCamera;
  if (!listenMouseMove || !target || !camera) return;
 
  if (event.clientX < target.offsetLeft) {
    return
  }

  const poercentX = (event.clientX - target.offsetLeft) / target.clientWidth;
  const percentY = (event.clientY - target.clientTop) / target.clientHeight;

  vec.set(
      ( poercentX ) * 2 - 1,
      - ( percentY ) * 2 + 1,
      0.5 );

  vec.unproject( camera );

  vec.sub( camera.position ).normalize();

  var distance = - camera.position.z / vec.z;

  pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
  cursorPos.copy(pos);


  const d = (pos.x - circlePos.x) ** 2 + (pos.y - circlePos.y) ** 2;
  const sizeSquared = circleSize ** 2;
  const inside = sizeSquared - d > 0;

  circ.material?.color.set(inside ? 0x00ff00 : 0xff0000);
}

xScene.onMount = (scene) => {
 if (!listenMouseMove)  {
  document.addEventListener('mousemove', updateCursorPos(scene));
  listenMouseMove = true;
 }
}
xScene.onDestroy = () => {
  listenMouseMove = false;
}

const mathScene = xScene;
export default mathScene;
