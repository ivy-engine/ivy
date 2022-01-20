import {
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
} from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import createText from "../../lib/createText";
import loadFont from "../../lib/loadFont";
import IEl, { IElOptions } from "../IEl";

export interface IFontOptions {
  centerX?: boolean;
  centerY?: boolean;
  centerZ?: boolean;
  scale?: number;
  size?: number;
  height?: number;
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelSegments?: number;
  bevelSize?: number;
  bevelThickness?: number;
}

interface ITextOptions extends IElOptions {
  text: string;
  material?: Material;
  font?: IFontOptions;
}

const DEFAULT_FONT =
  "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff";
const DEFAULT_MATERIAL = new MeshStandardMaterial({ color: 0xffffff });

export default class IText extends IEl {
  material: Material = DEFAULT_MATERIAL;

  constructor(options: ITextOptions) {
    super(options);
    this.material = options.material || this.material;

    loadFont(DEFAULT_FONT).then((font) => {
      const { object, position } = createText(
        options.text,
        font,
        this.material,
        options.font ?? {}
      );
      this.object = object;
      this.pos = position;

      this.mount();
    });
  }

  init() {
    super.init();
  }

  dispose(): void {
    super.dispose();
  }
}
