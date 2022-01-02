import IvyScene from "../../ivy-scene/IvyScene";
import defaultLights from "../../defaultLights";
import IvyObject from "../../ivy-object/IvyObject";
import { Vector3 } from "three";

const ivyScene = new IvyScene("Text Scene Outline");
ivyScene.add(...defaultLights());

const ivyText = new IvyObject({
  text: "Ivy",
  pos: new Vector3(0, 1, 0), 
  font: {
    ttfFile: "Audiowide-Regular.ttf",
    size: 12,
    height: 4,
    curveSegments: 1,
  },
  line: {
    type: "outline",
    color: ([x, y, z]) => [Math.sin(z), Math.sin(x), Math.sin(x/4)],
  },
});

ivyScene.add(ivyText);

let i = 0;
ivyText.update = ({ rot }) => {
  i++;
  rot.y = Math.sin(i / 70) * 0.2;
  rot.x = Math.sin(i / 50) * 0.16;
};

const outlineTextScene = ivyScene;
export default outlineTextScene;
