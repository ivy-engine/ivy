import { Group, Object3D } from "three";

export default function destroyObject(object: Object3D | Group) {
  if (!(object instanceof Object3D)) {
      return false
  };
  // for better memory management and performance
  if (object.geometry) {
      object.geometry.dispose();
  }

  if (object.material) {
      if (object.material instanceof Array) {
          // for better memory management and performance
          object.material.forEach(material => material.dispose());
      } else {
          // for better memory management and performance
          object.material.dispose();
      }
  }

  if (object.parent) {
      object.parent.remove(object);
  }
}