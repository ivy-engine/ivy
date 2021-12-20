import IvyRenderer from "./renderer";
import IvyScene from "./Scene/Scene";
import Stats from 'stats.js'

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

interface IvyCoreOptions {
  renderer: IvyRenderer;
}

export default class IvyCore {
  private options: IvyCoreOptions;
  activeScene?: IvyScene;

  constructor(options: IvyCoreOptions) {
      this.options = options;
      this.init();
  }

  init() {
    this.setupResponsiveScreen()
  }

  loadScene = (scene: IvyScene) => {
    this.activeScene = scene;
    this.activeScene.create({renderer: this.options.renderer})
    this.refresh();
  }

  refresh = () =>{
    stats.begin();
    if (this.activeScene) {
      this.activeScene.render();
      this.options.renderer.render(this.activeScene.rawScene, this.activeScene.camera);
    }
    stats.end();
    requestAnimationFrame( this.refresh );
  }

  setupResponsiveScreen = () => {
    this.options.renderer.setSize(window.innerWidth, window.innerHeight);
    this.options.renderer.setPixelRatio(window.devicePixelRatio);
    
    window.addEventListener('resize', () => {
      this.activeScene?.setSize(window.innerWidth, window.innerHeight);
    });
  }
}