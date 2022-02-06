import { Clock, Group } from "three";
import IScene from "../../Scene/IScene";
import IEl, { IElOptions } from "../IEl";

interface IGroupOptions extends IElOptions {
  items?: IEl[];
}

export default class IGroup extends IEl {
  group = new Group();
  elList: IEl[];

  constructor(options: IGroupOptions) {
    super(options);
    this.elList = options.items ?? [];
    this.object = this.group;
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
    super.mount(scene);
    this.elList.forEach((el) => el.mount(scene));
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
    this.group.parent?.remove(this.group);
  }

  render(el: IEl, clock: Clock) {
    super.render(el, clock);
    this.elList.forEach((el) => el.render(el, clock));
  }
}
