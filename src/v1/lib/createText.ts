import { Material, Mesh } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { IvyObjectFontOptions } from "../ivy-object/IvyObject";

export default function createText(
  text: string,
  font: Font,
  material: Material,
  options: IvyObjectFontOptions
) {
  const scale = 0.5;

  const { centerX = true, centerY = true, centerZ = true } = options;

  const textGeo = new TextGeometry(text, {
    font: font,
    size: ((options.size || 1) * 0.8) * scale,
    height: ((options.height || 0.05) * 0.98) * scale,
    curveSegments: options.curveSegments || 20,
    bevelEnabled: options.bevelEnabled || true,
    bevelSegments: options.bevelSegments || 6,
    bevelSize: (options.bevelSize || 0.02) * scale,
    bevelThickness: (options.bevelThickness || 0.1) * scale,
  });

  const anyCenter = centerX || centerY || centerZ;
  const textMesh = new Mesh(textGeo, material);

  if (anyCenter) {
    textGeo.computeBoundingBox();
    const box = textGeo.boundingBox;

    if (centerX) {
      const centerOffsetX = -0.35 * (box.max.x - box.min.x);
      textMesh.position.x = centerOffsetX;
    }
    if (centerY) {
      const centerOffsetY = -0.3 * (box.max.y - box.min.y);
      textMesh.position.y = centerOffsetY;
    }
    if (centerZ) {
      const centerOffsetZ = -0.1 * (box.max.z - box.min.z);
      textMesh.position.z = centerOffsetZ;
    }
  }

  return textMesh;
}
