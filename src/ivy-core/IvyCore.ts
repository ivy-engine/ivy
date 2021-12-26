import IvyRenderer from "./renderer";
import IvyScene from "./Scene/IvyScene";
import Stats from 'stats.js'
import IvyThree from "../ivy-three/IvyThree";

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
const el = document.createElement('div');
el.id="stats";
el.appendChild(stats.dom)
document.body.appendChild(el);

interface IvyCoreOptions {
  renderer: IvyThree;
}

export default class IvyCore {
  private options: IvyCoreOptions;
  element: HTMLElement;
  activeScene?: IvyScene;

  constructor(options: IvyCoreOptions) {
      this.options = options;
      this.element = options.renderer.loadPCSS
      this.init();
  }

  init() {
    this.setupResponsiveScreen()
  }

  loadScene = (scene: IvyScene) => {
    if (scene === this.activeScene) return;
    console.log('load. old; ', this.activeScene)
    // this.activeScene?.discard();

    const rs = this.activeScene?.rawScene

    if (this.activeScene && rs) {
    for (const element of this.activeScene.stack) {
      element.dispose();
    }
    for( var i = rs.children.length - 1; i >= 0; i--) { 
      const obj = rs.children[i];
      rs.remove(obj); 
    } 
    }
    console.log(scene);
    
    this.activeScene = scene;
    this.activeScene.create({renderer: this.options.renderer})
    this.refresh();
  }

  refresh = () =>{
    stats.begin();
    if (this.activeScene) {
      const camera = this.activeScene.camera;
      if (!camera.object) return; 

      this.activeScene.render();
      this.options.renderer.render(this.activeScene.rawScene, camera.object);
    }
    stats.end();
    requestAnimationFrame( this.refresh );
  }

  setupResponsiveScreen = () => {
    const el = this.options.renderer.element;
    this.options.renderer.setSize(el.clientWidth, el.clientHeight);
    this.options.renderer.setPixelRatio(window.devicePixelRatio);
    
    window.addEventListener('resize', () => {
      this.activeScene?.setSize(el.clientWidth, el.clientHeight);
    });
  }
}