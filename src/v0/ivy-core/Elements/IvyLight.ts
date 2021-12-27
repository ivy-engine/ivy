import { AmbientLight, Color, DirectionalLight, Scene, Vector3 } from "three";
import renderer from "../renderer";
import IvyAbstract from "./IvyAbstract";
import { ElementBaseOption } from "./IvyElement";

export interface IvyLightOptions extends ElementBaseOption {
  width?: number;
  height?: number;
  far?: number;
  position?: Vector3;
  color?: Color;
  intensity?: number;
  type?: "directional" | "ambient" | "point" | "spot";
}

export class IvyLight extends IvyAbstract<IvyLightOptions> {
  constructor(options?: IvyLightOptions) {
    super(options ?? {});
  }

  create(renderer: renderer, scene?: Scene): void {
    const {
      intensity = 1,
      color = 0xffffff,
      position = new Vector3(3, 6, 3),
      type = 'directional',
    } = this.options;
   
    let light;
    switch (type) {
      case 'directional':
        light = new DirectionalLight(color, intensity);
        light.shadow.camera.far = 20;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.position.copy(position);
        light.castShadow = true;
        break;
      case 'ambient':
        light = new AmbientLight(color, intensity);
        break;
    }

    if (!light) return;

    this.object = light;
    light.ivyElement = this;


    scene?.add(light);
  }
}
