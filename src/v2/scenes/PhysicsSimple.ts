import { BoxGeometry, Euler, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshStandardMaterial, PlaneGeometry, SphereGeometry, TextureLoader, Vector2, Vector3 } from "three";
import IGroup from "../core/El/Elements/IGroup";
import IMesh from "../core/El/Elements/IMesh";
import defaultLights from "../core/lib/defaultLights";
import IScene from "../core/Scene/IScene";
import image from '../core/debug.jpg'

const box = new IMesh({
  geometry: new SphereGeometry(1, 32, 32),
  pos: new Vector3(0, 4, 0), 
  mass: 1,
  shadow: true,
});



const floorSize = 11;
const pipeSize = 1;
const gap = 0.7;
const floor = new IGroup({
  pos: new Vector3(-(floorSize * pipeSize) / 2, -2, -(floorSize * pipeSize) / 2),
});

const floorMaterial = new MeshStandardMaterial({ color: 0x7e2aaa });

for (let i = 0; i < floorSize; i++) {
  for (let j = 0; j < floorSize; j++) {
    const offset = Math.random() - 0.5;
    const isEdge = (i === 0 || i === floorSize - 1 || j === 0 || j === floorSize - 1) ;
    const el = new IMesh({
      geometry: isEdge ? new BoxGeometry(0.02, 10, 0.02) : new SphereGeometry(pipeSize - gap),
      pos: new Vector3(i * pipeSize, isEdge ? 4 : 0, j * pipeSize),
      material: floorMaterial, 
      mass: 0, 
      shadow: true,
      update: isEdge ? undefined : ({ body }) => {
        if (body) {
          body.position.y = floor.pos.y + (Math.sin(Date.now() / 200 * offset)) * 0.7;
        }
      }, 
    })
    
    floor.add(el);
  }
}

const loader = new TextureLoader();
loader.load(
	// resource URL
	image,

	// onLoad callback
	function ( texture ) {
		// in this example we create the material when the texture is loaded
		const material = new MeshStandardMaterial( {
			map: texture
		 } );
     box.setMaterial(material);
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.error( 'An error happened.' );
	}
);

const PhysicsSimple = new IScene();
PhysicsSimple.add(box, floor, ...defaultLights());

export default PhysicsSimple;
