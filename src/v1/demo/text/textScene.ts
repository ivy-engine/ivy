import IvyScene from "../../ivy-scene/IvyScene";
import defaultLights from "../../defaultLights";
import IvyObject from "../../ivy-object/IvyObject";

const ivyScene = new IvyScene('Text Scene');
ivyScene.add(...defaultLights());

const ivyText = new IvyObject({
  text: 'Ivy',
  font: {
    ttfFile: 'Audiowide-Regular.ttf',
    size: 8
  },
  color: 0x33ef31,
});

ivyScene.add(ivyText);

let i = 0;
ivyText.update = ({rot}) => {
  i++;
  rot.y = Math.sin(i / 70) * 0.2;
  rot.x = Math.sin(i / 50) * 0.16;
}

const textScene = ivyScene;
export default textScene;