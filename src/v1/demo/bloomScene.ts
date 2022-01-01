import IvyScene from "../ivy-scene/IvyScene";
import defaultLights from "../defaultLights";
import IvyObject from "../ivy-object/IvyObject";
import {RectAreaLightUniformsLib} from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import {
  BoxGeometry,
  Euler,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RectAreaLight,
  ShaderMaterial,
  TorusKnotGeometry,
  Vector2,
  Vector3,
} from "three";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import bloomVertexShader from "../lib/shaders/bloom/vertex.glsl";
import bloomFragmentShader from "../lib/shaders/bloom/frag.glsl";



const cam = new PerspectiveCamera();
cam.position.copy(new Vector3(0, 0, 13));

const ivyScene = new IvyScene("Text Scene", {
  camera: cam,
});

const renderLightPlane = true;

const createLight = (pos: Vector3, color: number) => {
  const width = 6;
  const height = 20;
  const l = []
  l.push(new IvyObject({
    pos,
    rot: new Euler(0, Math.PI, 0),
    light: new RectAreaLight(color, 5, width, height),
  }));

  if (renderLightPlane) l.push(new IvyObject({
    pos: l[0].pos,
    geometry: new PlaneGeometry(width, height, 1, 1),
    material: new MeshBasicMaterial({ color: color }),
  }));

  return l;
};

RectAreaLightUniformsLib.init();

const lights = [
  ...createLight(new Vector3(-7, 0, -5), 0xff0000),
  ...createLight(new Vector3(0, 0, -5), 0x0000ff),
  ...createLight(new Vector3(7, 0, -5), 0x00ff00),
];

const obj = new IvyObject({
  geometry: new TorusKnotGeometry(3, 0.26, 200, 20, 3, 4),
  material: new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0,
  }),
  rot: new Euler(Math.PI / 2, 0, 0), 
});

ivyScene.add(obj, ...lights);

// BLOOM
const params = {
  exposure: 1,
  bloomStrength: .5,
  bloomThreshold: .01,
  bloomRadius: 0.1
};

ivyScene.onMount = (scene) => {
  // const renderScene = scene.core!.renderScene!;
  // const renderer = scene.core!.renderer!;

  // const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	// 			bloomPass.threshold = params.bloomThreshold;
	// 			bloomPass.strength = params.bloomStrength;
	// 			bloomPass.radius = params.bloomRadius;
 
  // const bloomComposer = new EffectComposer( renderer );
	// 		bloomComposer.renderToScreen = false;
	// 		bloomComposer.addPass( renderScene );
	// 		bloomComposer.addPass( bloomPass );

  // scene.addComposerPass( bloomPass );

  // const finalPass = new ShaderPass(
  //   new ShaderMaterial( {
  //     uniforms: {
  //       baseTexture: { value: null },
  //       bloomTexture: { value: bloomComposer.renderTarget2.texture }
  //     },
  //     vertexShader: bloomVertexShader,
  //     fragmentShader: bloomFragmentShader,
  //     defines: {}
  //   } ), "baseTexture"
  // );
  // finalPass.needsSwap = true;
  
  // scene.addComposerPass( finalPass );
  // scene.addComposerPass( bloomPass );


  const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				bloomPass.threshold = params.bloomThreshold;
				bloomPass.strength = params.bloomStrength;
				bloomPass.radius = params.bloomRadius;

  scene.addComposerPass( bloomPass );
}

obj.update = ({ rot }) => {
  rot.z += 0.005;
};


const bloomScene = ivyScene;
export default bloomScene;
