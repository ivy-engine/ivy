import { Color, Light } from "three";
import IEl, { IElOptions } from "../IEl"

interface ILightOptions extends IElOptions {
  light: Light;
  color?: number | Color;
}

export default class ILight extends IEl {
  light: Light; 
  color: Color;

  constructor(options: ILightOptions) {
    super(options);
    this.light = options.light;
    this.color = new Color(options.color ?? 0xffffff);
    this.object = this.light;
    
    this.light.color = this.color;
    this.light.position.copy(this.pos);
    this.pos = this.light.position; 
  }

  init() {
    super.init();
  }
}