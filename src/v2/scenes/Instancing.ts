import {
  BoxGeometry,
  Euler,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  SphereGeometry,
  Vector3,
} from "three";
import IMesh from "../core/El/Elements/IMesh";
import IMeshInstanced from "../core/El/Elements/IMeshInstanced";
import defaultLights from "../core/lib/defaultLights";
import IScene from "../core/Scene/IScene";

function getPoint(r: number) {
  var d, x, y, z; 
  const h = r/2; 
  const h2= h*h;
  do {
      x = Math.random() * r - h;
      y = Math.random() * r - h;
      z = Math.random() * r - h;
      d = x*x + y*y + z*z;
  } while(d > h2);
  return {x: x, y: y, z: z};
}

const size = 180;

const cube = new IMeshInstanced({
  geometry: new BoxGeometry(1,1,1),
  material: new MeshStandardMaterial({ color: 0xffffff }),
  count: 10_000,
  setupMatrix: (i, {position, rotation, scale}) => {
    const {x, y, z} = getPoint(size);
    position.set(x, y, z);
    
    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;
   
    scale.x = scale.y = scale.z = Math.random() * 2;
  }
})


const mainCamera = new PerspectiveCamera();
mainCamera.position.copy(new Vector3(0, 0, 120));
const Instancing = new IScene({
  camera: mainCamera,
});

Instancing.add(defaultLights()[0], cube);

export default Instancing;
