import { Group } from "three";
import IEl, { IElOptions } from "../IEl"

interface IGroupOptions extends IElOptions { 
  items?: IEl[];
}

export default class IGroup extends IEl {
  group = new Group();
  elList: IEl[];

  constructor(options: IGroupOptions) {
    super(options);
    this.elList = options.items ?? [];
    
    this.group.position.copy(this.pos);
    this.pos = this.group.position;
    
    this.object = this.group;
  }
 
  init() {
    super.init();
    this.elList.forEach(el => {
      el.parent = this;
      el.init();
    });
  }
  
  clone(options: IElOptions) {
    const items = this.elList.map(el => el.clone());
    return new IGroup({ ...this.o, ...options, items });
  }

  mount() {
    super.mount();
    this.elList.forEach(el => el.mount());
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
    for (let el of this.elList) {
      el.dispose();
    }
  }
}