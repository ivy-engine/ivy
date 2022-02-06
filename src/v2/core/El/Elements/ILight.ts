import { Color, Light } from "three";
import IEl, { IElOptions } from "../IEl";

interface ILightOptions extends IElOptions {
  light: Light;
  shadow?: boolean;
  mapSize?: {
    width: number;
    height: number;
  };
}

export default class ILight extends IEl {
  light: Light;

  constructor(options: ILightOptions) {
    super(options);
    this.light = options.light;
    // this.color = new Color(options.color ?? 0xffffff);
    this.object = this.light;
    // this.light.color = this.color;

    if (options.shadow === true) {
      this.light.castShadow = true;
    }

    if (options.mapSize) {
      this.light.shadow.mapSize.width = options.mapSize.width;
      this.light.shadow.mapSize.height = options.mapSize.height;
    }
  }

  init() {
    super.init();
  }
}
