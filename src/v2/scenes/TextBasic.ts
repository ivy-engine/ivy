import { DirectionalLight, Vector3 } from "three";
import ILight from "../core/El/Elements/ILight";
import IText from "../core/El/Elements/IText";
import defaultLights from "../core/lib/defaultLights";
import IScene from "../core/Scene/IScene";

const text = new IText({ 
  text: "Hello Ivy",
})

// const light = 

const TextBasic = new IScene();
TextBasic.add(text, ...defaultLights());

export default TextBasic;
