import IvyScene from "../../ivy-scene/IvyScene";
import {TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import {Font} from 'three/examples/jsm/loaders/FontLoader';
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader';
import defaultLights from "../../defaultLights";
import { Euler, Group, Mesh, MeshPhongMaterial, PlaneGeometry, Vector3 } from "three";
import IvyObject from "../../ivy-object/IvyObject";

const ivyScene = new IvyScene('Text Scene');
ivyScene.add(...defaultLights());

const x = new IvyObject({
  group: true,
  addToScene: false
});

ivyScene.add(x)

let container;
let camera, cameraTarget, scene, renderer;
let group = x.group, textMesh1, textMesh2, textGeo, material;
let firstLetter = true;

let font = null;


material = new MeshPhongMaterial( { color: 0x33ef31 } );
const loader = new TTFLoader();

loader.load( 'Audiowide-Regular.ttf', function ( json ) {

  font = new Font( json );
  createText();

} );


function createText() {
 const scale = 0.05; 

  textGeo = new TextGeometry( 'Ivy', {
    
    font: font,

    // size: 5,
    height: 10,
    // curveSegments: 20,
    // bevelEnabled: true,
    // bevelSegments: 6,
    // bevelSize: 0.1,
    // bevelThickness: 0.1,

  } );

  textGeo.computeBoundingBox();
  // textGeo.computeVertexNormals();

  const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
  const centerOffsetY = - 0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );

  textMesh1 = new Mesh( textGeo, material );
  textMesh1.scale.set(scale, scale, scale);

  textMesh1.position.x = centerOffset * scale;
  textMesh1.position.y = centerOffsetY * scale;

  group.add( textMesh1 );
}

let i = 0;
x.update = ({rot}) => {
  i++;
  rot.y = Math.sin(i / 70) * 0.2;
  rot.x = Math.sin(i / 50) * 0.16;
}

const textScene = ivyScene;
export default textScene;