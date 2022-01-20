import {Text} from 'troika-three-text'
import IEl, { IElOptions } from "../IEl"

interface ITextTroikaOptions extends IElOptions { 
  text: string;
}

export default class ITextTroika extends IEl {
  // color: Color;
  // geometry: BufferGeometry;
  // material: Material;
  // mesh: Mesh;

  constructor(options: ITextTroikaOptions) {
    super(options);
    const text = new Text()
    this.object = text;

    text.text = options.text;
    text.fontSize = 1
    text.anchorX = 'center' 
    text.anchorY = 'middle' 
    text.color = options.color ?? 0xffffff;

    // Update the rendering:
    text.sync()
  }

  init() {
    super.init();
  }
 
  dispose(): void {
    super.dispose();
  }
}