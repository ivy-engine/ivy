import { AmbientLight, BoxGeometry, PlaneGeometry, RectAreaLight, Vector3 } from "three";
import IGroup from "../core/El/Elements/IGroup";
import ILight from "../core/El/Elements/ILight";
import IMesh from "../core/El/Elements/IMesh";
import IScene from "../core/Scene/IScene";

const lightGroup = new IGroup({
  items: [
    new IMesh({
      geometry: new BoxGeometry(1, 1),
      color: 0xffffff,
    }),
    new ILight({
      light: new RectAreaLight(0xffffff, 5, 6, 20),
    })
  ],
  pos: new Vector3(0, 1, 0),
})

// const light2 = lightGroup.clone({
//   pos: new Vector3(0, 1, -5),
// })

// const light3 = lightGroup.clone({
//   pos: new Vector3(0, 1, 5),
// })

const ambient = new ILight({
  light: new AmbientLight(0xffffff, 0.3),
})

const AreaLight = new IScene();
AreaLight.add(lightGroup, ambient);

export default AreaLight;