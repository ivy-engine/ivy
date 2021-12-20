import { Camera, Mesh, Object3D } from "three";
import { Box, BoxOptions } from "./Elements/Box";

export interface IvyRendererOptions {
    shadowmapPreset?: 'default' | 'pcss'
}

export default abstract class IvyRenderer {
    constructor() {}

    abstract mount(element: HTMLElement): void;
    abstract render(scene: Object3D, camera: Camera): void;
    abstract setSize(width: number, height: number): void;
    abstract setPixelRatio(ratio: number): void;
}