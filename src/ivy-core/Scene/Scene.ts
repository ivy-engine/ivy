import Element, { ElementBaseOption } from "../Elements/Element";
import IvyRenderer from "../renderer";

export default class Scene {
    stack: Element<ElementBaseOption>[] = [];
    
    constructor() {}

    add(element: Element<ElementBaseOption> | Element<ElementBaseOption>[]): void {
        if (Array.isArray(element)) {
            this.stack.push(...element);
        } else {
            this.stack.push(element);
        }
    }

    create(options: { renderer: IvyRenderer }) {
        this.stack.forEach(element => element.create(options.renderer));
    }

    render = () => {
        this.stack.forEach(element => element.draw?.(element));
    }
}