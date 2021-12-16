import { Mesh } from "three";
import { Box, BoxOptions } from "./Elements/Box";

export default abstract class IvyRenderer {
    constructor() {}

    abstract mount(element: HTMLElement): void;
    abstract drawBox(options: Box): Mesh;
    abstract render(): void;
    abstract setSize(width: number, height: number): void;
    abstract setPixelRatio(ratio: number): void;
}