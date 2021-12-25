import IvyCore from './ivy-core/IvyCore'
import IvyThree from './ivy-three/IvyThree';
import './style.css'
import basicScene from './demo/basic';
import physicsScene from './demo/physicsScene';
import { IvyBox } from './ivy-core/Elements/IvyBox';
import loaderScene from './demo/loaderScene';

const app = document.querySelector<HTMLElement>('#ivy')!

const ivy = new IvyCore({
  renderer: new IvyThree(app, {
    // shadowmapPreset: 'pcss'
  }), 
});



// ivy.loadScene(physicsScene);
// ivy.loadScene(basicScene);
ivy.loadScene(loaderScene);