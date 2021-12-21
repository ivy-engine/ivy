import { Camera, Object3D } from "three";

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