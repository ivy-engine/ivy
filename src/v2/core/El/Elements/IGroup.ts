import { Clock, Euler, Group, Quaternion, Vector3 } from "three";
import IScene from "../../Scene/IScene";
import IEl, { IElOptions } from "../IEl";

interface IGroupOptions extends IElOptions {
  items?: IEl[];
}

export default class IGroup extends IEl {
  o: IGroupOptions;
  group = new Group();
  elList: IEl[];

  constructor(options: IGroupOptions) {
    super(options);
    this.o = options; 
    this.elList = options.items ?? [];
    this.object = this.group;
    this.rot = new Euler(); 
  }

  init() {
    super.init();
    this.elList.forEach((el) => {
      el.parent = this;
      el.init();
    });
  }

  clone(options: IElOptions) {
    const items = this.elList.map((el) => el.clone());
    return new IGroup({ ...this.o, ...options, items });
  }

  mount(scene: IScene) {
    if (this.mounted) return; 

    super.mount(scene);
    for (const el of this.elList) {
      el.mount(scene);
    }
   
    if (this.mounted) return;
    this.mounted = true;
   
    this.group.rotation.copy(this.o.rot ?? new Euler());
    this.rot = this.group.rotation; 
    // setTimeout(() => {
    // }, 100)
  }

  add(el: IEl) {
    this.elList.push(el);
  }

  remove(el: IEl) {
    this.elList.splice(this.elList.indexOf(el), 1);
  }

  removeAll() {
    this.elList = [];
  }

  dispose() {
    super.dispose() ;
    for (let el of this.elList) {
      el.dispose();
    }
    this.group.parent?.remove(this.group);
  }

  render(el: IEl, clock: Clock) {
    super.render(el, clock);
    this.elList.forEach((el) => {
      el.render(el, clock);

      if (el.staticBody && el.body) {
        if (!el.object) return;
        const pos = el.object.getWorldPosition(new Vector3());
        const q = el.object.getWorldQuaternion(new Quaternion()); 
        el.body.position.x = pos.x;
        el.body.position.y = pos.y;
        el.body.position.z = pos.z;
        el.body.quaternion.x = q.x;
        el.body.quaternion.y = q.y;
        el.body.quaternion.z = q.z;
        el.body.quaternion.w = q.w;
      }
    });

  }
}
