import { Scene as ThreeScene } from "three";
import IvyRenderer from "../renderer";
import Element, { ElementBaseOption } from "./Element";

export interface BoxOptions extends ElementBaseOption {
}

export class Box extends Element<BoxOptions> {
    constructor(options?: BoxOptions) {
      super(options ?? {});
    }
}