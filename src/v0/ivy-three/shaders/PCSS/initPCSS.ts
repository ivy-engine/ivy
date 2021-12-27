import { ShaderChunk } from 'three';
import PCSS from './PCSS.frag'
import PCSSGetShadow from './PCSSGetShadow.frag'


export default function initPCSS() {
  let shader = ShaderChunk.shadowmap_pars_fragment;

  shader = shader.replace(
    '#ifdef USE_SHADOWMAP',
    `#ifdef USE_SHADOWMAP
    ${PCSS}`
  );

  shader = shader.replace(
    '#if defined( SHADOWMAP_TYPE_PCF )',
    `${PCSSGetShadow}
    #if defined( SHADOWMAP_TYPE_PCF )`
  );

  ShaderChunk.shadowmap_pars_fragment = shader;
}