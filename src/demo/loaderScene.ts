import { BoxGeometry, Euler, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyLoaderFBX } from "../ivy-core/Elements/IvyLoaderFBX";
import { IvyLoaderOBJ } from "../ivy-core/Elements/IvyLoaderOBJ";
import IvyScene, { defaultLights } from "../ivy-core/Scene/IvyScene";

const char = new IvyLoaderOBJ({
  obj: '/kurenai_asset/KURENAI_lowpoly.obj',
  mtl: '/assets/kurenai_asset/KURENAI_lowpoly.mtl',
  position: new Vector3(2, -3, 2),
  scale: new Vector3(2.5, 2.5, 2.5), 
});

const char2 = new IvyLoaderFBX({
  fbx: 'SambaDancing.fbx',
  initialAnimation: 0,
  position: new Vector3(-2, -3, 2),
  scale: new Vector3(.03, .03, .03),
});

const floor = new IvyBox({
  geometry: new BoxGeometry(50, 0.1, 50),
  position: new Vector3(0, -3, 0),
});

const loaderScene = new IvyScene({
  controls: 'orbit',
  elements: [...defaultLights(), char, char2, floor]
});

export default loaderScene;
