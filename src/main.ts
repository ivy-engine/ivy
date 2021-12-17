import IvyCore from './ivy-core/IvyCore'
import IvyThree from './ivy-three/IvyThree';
import './style.css'
import testScene from './demo/testScene';

const app = document.querySelector<HTMLElement>('#ivy')!

const ivy = new IvyCore({
  renderer: new IvyThree(app, {
    shadowmapPreset: 'pcss'
  }), 
});

ivy.loadScene(testScene);