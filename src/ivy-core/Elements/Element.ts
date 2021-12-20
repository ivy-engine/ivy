import { BoxGeometry, Color, Euler, Group, Mesh, MeshStandardMaterial, Object3D, Vector3, Scene as ThreeScene } from "three";
import Scene from '../Scene/Scene'
import IvyRenderer from "../renderer";

export interface ElementBaseOption {
  name?: string;
  geometry?: BoxGeometry;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  color?: Color;
  group?: boolean;
}

export default abstract class Element<TOptions extends ElementBaseOption> {
  private options: TOptions;
  name: string; 
  children: Element<any>[] = [];
  mesh: THREE.Mesh;
  material: MeshStandardMaterial = new MeshStandardMaterial();
  scene?: Scene;
  group?: Group;
  parentGroup?: Group; 

  constructor(options: TOptions) {
    this.options = options;

    this.name = options.name ?? 'element';
    
    this.mesh = new Mesh();
    this.mesh.geometry = options.geometry ?? new BoxGeometry(1, 1, 1);
    this.mesh.scale.copy(options.scale ?? new Vector3(1, 1, 1));
    this.material.color = this.options.color ?? new Color(0xffffff); 

    let positioned: Group | Mesh = this.mesh;
    
    if (this.options.group) {
      this.group = new Group();
      this.group.add(this.mesh);
      positioned = this.group;
    }

    positioned.position.copy(options.position ?? new Vector3());
    positioned.position.copy(options.position ?? new Vector3());
    positioned.rotation.copy(options.rotation ?? new Euler());
  }
 

  add = (element: Element<any>) => {
    if (!this.group) {
      throw new Error('Cannot add child to non-group element, add `group: true` to the element options');
    }
   
    console.log('group add', element)

    
    let positioned: Group | Mesh = this.mesh;
    if (element.group) {
      positioned = element.group;
      this.group.add(positioned);
    }

    element.parentGroup = this.group;
    this.children.push(element);
  }
 
  
  update = () => {
    this.draw?.(this);
    this.drawChildren();
  };

  drawChildren = () => {
   if (this.group) {
    // console.log(this.group.position, this.mesh.position) 
    //  this.group.position.copy(this.mesh.position);
    //  this.group.rotation.copy(this.mesh.rotation);
     
    this.children.forEach(element => {
      element.update();
    });
   } 
  }

  create(renderer: IvyRenderer, scene?: ThreeScene): void {
      this.mesh.material = this.material;
      this.mesh.castShadow = true; 
      this.mesh.receiveShadow = true; 
      
      if (this.group) { 
        this.children.forEach(item => item.create(renderer));
        console.log('add to own group', this)
        scene?.add(this.group)
      } else if (this.parentGroup) {
        console.log('add to parent group', this)
        this.parentGroup.add(this.mesh);
      } else {
        console.log('add to scene', this)
        scene?.add(this.mesh);
      }
  };
  draw?(element: Element<TOptions>): void;
}