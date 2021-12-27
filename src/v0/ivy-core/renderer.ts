import { Camera, Object3D } from "three";
import IvyThree from "../v0/ivy-three/IvyThreeree";

export interface IvyRendererOptions {
    shadowmapPreset?: 'default' | 'pcss'
}

export default abstract class IvyRenderer {
    renderer?: IvyThree;
    constructor() {}

    abstract mount(element: HTMLElement): void;
    abstract render(scene: Object3D, camera: Camera): void;
    abstract setSize(width: number, height: number): void;
    abstract setPixelRatio(ratio: number): void;
}