import { Material, Mesh, Vector3 } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { IFontOptions } from "../El/Elements/IText";

export default function createText(
  text: string,
  font: Font,
  material: Material,
  options: IFontOptions
): {
  object: Mesh;
  position: Vector3;
} {
  const scale = 0.5;
  const position = new Vector3();

  const { centerX = true, centerY = true, centerZ = true } = options;

  const textGeo = new TextGeometry(text, {
    font: font,
    size: (options.size || 1.6) * 0.8 * scale,
    height: (options.height || 0.05) * 0.98 * scale,
    curveSegments: options.curveSegments || 14,
    bevelEnabled: options.bevelEnabled || true,
    bevelSegments: options.bevelSegments || 7,
    bevelSize: (options.bevelSize || 0.02) * scale,
    bevelThickness: (options.bevelThickness || 0.1) * scale,
  });

  const anyCenter = centerX || centerY || centerZ;
  const object = new Mesh(textGeo, material);

  if (anyCenter) {
    textGeo.computeBoundingBox();
    const box = textGeo.boundingBox;
    if (!box) return { object, position };

    if (centerX) {
      const centerOffsetX = -0.5 * (box.max.x - box.min.x);
      position.x = centerOffsetX;
    }
    if (centerY) {
      const centerOffsetY = -0.5 * (box.max.y - box.min.y);
      position.y = centerOffsetY;
    }
    if (centerZ) {
      const centerOffsetZ = -0.4 * (box.max.z - box.min.z);
      position.z = centerOffsetZ;
    }
  }

  object.position.copy(position);

  return {
    object,
    position,
  };
}
