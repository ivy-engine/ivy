import { MathUtils, Vector3 } from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

interface SkyOptions {
  turbidity: number,
  rayleigh: number,
  mieCoefficient: number,
  mieDirectionalG: number,
  elevation: number,
  azimuth: number,
  exposure: number,
  // exposure: renderer.toneMappingExposure
}

const defaultOptions: SkyOptions = {
  turbidity: 7,
  rayleigh: 1,
  mieCoefficient: 0.01,
  mieDirectionalG: 0.2,
  elevation: 4,
  azimuth: 121.4,
  exposure: 1,
  // exposure: renderer.toneMappingExposure
}

export default function createSky(options: Partial<SkyOptions> = {}): Sky {
  const conf: SkyOptions = {
    ...defaultOptions,
    ...options
  }
  // Add Sky
  const sky = new Sky();
  sky.scale.setScalar(450000);
  const sun = new Vector3();
  const uniforms = sky.material.uniforms;
 
  const setProps = (props: Partial<SkyOptions> = {}) => {
    const tmpConf: SkyOptions = {
      ...defaultOptions,
      ...props
    }
    uniforms["turbidity"].value = tmpConf.turbidity;
    uniforms["rayleigh"].value = tmpConf.rayleigh;
    uniforms["mieCoefficient"].value = tmpConf.mieCoefficient;
    uniforms["mieDirectionalG"].value = tmpConf.mieDirectionalG;
  
    const phi = MathUtils.degToRad(90 - tmpConf.elevation);
    const theta = MathUtils.degToRad(tmpConf.azimuth);
  
    sun.setFromSphericalCoords(1, phi, theta); 
  
    uniforms["sunPosition"].value.copy(sun);
    // renderer?. = effectController.exposure;
  }

  setProps(conf);

  // sky.setProps = setProps;
  return sky;
}