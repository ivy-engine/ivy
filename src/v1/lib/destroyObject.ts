import { Group, Object3D } from "three";

export default function destroyObject(object: Object3D | Group) : void{
  if (!(object instanceof Object3D)) {
      return
  };

  const o = object as any;
  // for better memory management and performance
  if (o.geometry) {
      o.geometry.dispose();
  }

  if (o.material) {
      if (o.material instanceof Array) {
          // for better memory management and performance
          o.material.forEach((material: any) => material.dispose());
      } else {
          // for better memory management and performance
          o.material.dispose();
      }
  }
 
  for (const child of object.children) {
      destroyObject(child);
  }

  if (object.parent) {
      object.parent.remove(object);
  }
}