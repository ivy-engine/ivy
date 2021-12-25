import { ContactMaterial, Material } from "cannon-es";
import { BoxGeometry, Color, Euler, Vector3 } from "three";
import { IvyBox } from "../ivy-core/Elements/IvyBox";
import { IvyCamera } from "../ivy-core/Elements/IvyCamera";
import IvyElement from "../ivy-core/Elements/IvyElement";
import { IvyLight } from "../ivy-core/Elements/IvyLight";
import { IvyLoader } from "../ivy-core/Elements/IvyLoader";
import IvyScene from "../ivy-core/Scene/IvyScene";

const loaderScene = new IvyScene({
  // camera: new IvyCamera({
  //   position: new Vector3(0, 10, 8),
  //   rotation: new Euler(-Math.PI / 3.5, 0, 0),
  // }),
});

const light = new IvyLight();
const ambient = new IvyLight({ type: "ambient", intensity: 0.4 });
loaderScene.add([light, ambient]);

// console.log(model)
const char = new IvyLoader({
  model: "/kurenai_asset/KURENAI_lowpoly.obj",
});

loaderScene.add([char]);

export default loaderScene;
