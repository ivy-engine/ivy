import { Font } from "three/examples/jsm/loaders/FontLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";

const fontCache: Record<string, Font> = {};


export default async function loadFont(fontFile: string): Promise<Font> {
  if (fontCache[fontFile]) {
    return fontCache[fontFile];
  }

  const loader = new TTFLoader();
  return new Promise((resolve, reject) => {
    loader.load( fontFile, function ( json ) {
      const font = new Font( json );
      fontCache[fontFile] = font;
      resolve(font);
    });
  });
}