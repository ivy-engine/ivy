import IEl from "../El/IEl";
import IScene from "./IScene";

describe('IScene', () => {
  let scene = new IScene();

  beforeEach(() => {
    scene = new IScene();
  });

  it('should mount', () => {
    expect(scene).toBeDefined();
  });
 
  it('should add elements and call init on them', () => {
    let el = new IEl({});
    const mockInit = jest.spyOn(el, 'init');
    scene.add(el);
    expect(scene.elList.length).toBe(1);
    expect(mockInit).toHaveBeenCalled();
  });
})