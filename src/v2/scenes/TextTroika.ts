import ITextTroika from "../core/El/Elements/ITextTroika";
import IScene from "../core/Scene/IScene";

const text = new ITextTroika({
  text: "Hello Ivy",
});

const TextTroika = new IScene();
TextTroika.add(text);

export default TextTroika;
