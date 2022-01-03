import {
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  Euler,
  IcosahedronGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import IvyObject, { posXYZ } from "../../ivy-object/IvyObject";
import IvyScene from "../../ivy-scene/IvyScene";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

const cam = new PerspectiveCamera();
cam.position.copy(new Vector3(0, 0, 100));
const scene = new IvyScene("Sine Waves", {
  camera: cam,
});

const d = []
for (var v = 0; v < 20; v++) {
  d.push(Math.random() * 30);
}

var uniforms = {
  u_time: {
    type: 'float', // a float
    value:1.2
  }
};

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});


const geometry = new PlaneGeometry(30, 30, 10, 10);
const x = new IvyObject({
  geometry,
  material: material
  //   type: 'wireframe',
  //   linewidth: 0.02,
  // }
});

scene.add(x);




// x.update = (object, clock) => {
// }

// waveMaterial.uniforms.u_resolution.value.x = window.innerWidth;
// waveMaterial.uniforms.u_resolution.value.y = window.innerHeight;


// document.addEventListener('mousemove', (e) =>{
//   // window.addEventListener( 'resize', onWindowResize, false );
//   waveMaterial.uniforms.u_mouse.value.x = e.clientX;
//   waveMaterial.uniforms.u_mouse.value.y = e.clientY;
// })

scene.onUpdate = (scene) => {
  const clock = scene.core.clock;
  // uniforms.amplitude.value = Math.sin(clock.getElapsedTime() * 10);
  // console.log(clock.getElapsedTime());
  material.uniforms[ 'u_time' ].value = clock.getElapsedTime();
  // waveMaterial.uniforms.time.value = 
}

const sineWavesSample = scene;
export default sineWavesSample;
