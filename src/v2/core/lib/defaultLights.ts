import { AmbientLight, DirectionalLight, Vector3 } from "three";
import ILight from "../El/Elements/ILight";

const defaultLights = () => {
  return [
    new ILight({
      light: new DirectionalLight(0xffffff, 1),
      pos: new Vector3(1, 10, 3),
    }),
    new ILight({
      light: new AmbientLight(0xffffff, 0.4),
    }),
  ];
};


export default defaultLights;