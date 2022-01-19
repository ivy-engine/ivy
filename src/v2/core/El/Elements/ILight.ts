import { Color, Light } from "three";
import IEl, { IElOptions } from "../IEl"

interface ILightOptions extends IElOptions {
  light: Light;
}

export default class ILight extends IEl {
  light: Light; 

  constructor(options: ILightOptions) {
    super(options);
    this.light = options.light;
    // this.color = new Color(options.color ?? 0xffffff);
    this.object = this.light;
    // this.light.color = this.color;
  }

  init() {
    super.init();
  }
}