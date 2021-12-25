import { BoxGeometry, Euler, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyLight } from "../ivy-core/Elements/IvyLight";
import { IvyLoader, IvyLoaderOBJ } from "../ivy-core/Elements/IvyLoaderOBJ";
import IvyScene from "../ivy-core/Scene/IvyScene";

const loaderScene = new IvyScene({
  controls: 'orbit'
});

const light = new IvyLight();
const ambient = new IvyLight({ type: "ambient", intensity: 0.7 });
loaderScene.add([light, ambient]);

const char = new IvyLoaderOBJ({
  obj: '/kurenai_asset/KURENAI_lowpoly.obj',
  mtl: '/assets/kurenai_asset/KURENAI_lowpoly.mtl',
  position: new Vector3(3, -3, 0),
  scale: new Vector3(2.5, 2.5, 2.5),
});

const floor = new IvyBox({
  geometry: new BoxGeometry(10, 0.1, 10),
  position: new Vector3(0, -3, 0),
});

loaderScene.add([char, floor]);

export default loaderScene;
