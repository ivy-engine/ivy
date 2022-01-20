import { BufferGeometry, Color, Event, Material, Mesh, MeshStandardMaterial, Object3D } from "three";
import IEl, { IElOptions } from "../IEl"

interface IMeshOptions extends IElOptions { 
  geometry: BufferGeometry;
  color?: number | Color; 
  material?: Material;
  shadow?: boolean | 'cast' | 'receive'; 
}

const defaultMaterial = () => new MeshStandardMaterial({ color: 0xffffff });

export default class IMesh extends IEl {
  color: Color;
  geometry: BufferGeometry;
  material: Material;
  mesh: Mesh;

  constructor(options: IMeshOptions) {
    super(options);
    this.geometry = options.geometry;
    this.color = new Color(options.color ?? 0xffffff);
    this.material = options.material ?? defaultMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.object = this.mesh;
   
    if (options.shadow === true) {
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
    } else if (options.shadow === 'cast') {
      this.mesh.castShadow = true;
    } else if (options.shadow === 'receive') {
      this.mesh.receiveShadow = true;
    }
  }

  init() {
    super.init();
    // this.material.color = this.color;
  }
 
  dispose(): void {
    super.dispose();
    this.geometry.dispose();
    this.material.dispose();
    // this.mesh.dispose();
  }
}