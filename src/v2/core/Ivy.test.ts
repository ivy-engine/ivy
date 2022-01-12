import * as THREE from "three";
import { mockScene } from "../mockData/mockScene";
import Ivy from "./Ivy";

describe("Ivy Core", () => {
  jest.spyOn(THREE, "WebGLRenderer").mockImplementation(() => {
    return {
      domElement: document.createElement("canvas"),
      shadowMap: {},
    } as any;
  });

  let htmlEl = document.createElement("div");
  let ivy = new Ivy({ target: htmlEl });

  beforeEach(() => {
    htmlEl = document.createElement("div");
    ivy = new Ivy({
      target: htmlEl,
    });
  });

  it("should mount", () => {
    expect(ivy).toBeDefined();
  });

  it("should set scene", () => {
    expect(ivy.activeScene).toBeUndefined();
    ivy.loadScene(mockScene);
    expect(ivy.activeScene).toBe(mockScene);
  });

  it("should remove scene on dispose", () => {
    ivy.loadScene(mockScene);
    expect(ivy.activeScene).toBe(mockScene);
    ivy.dispose();
    expect(ivy.activeScene).toBeUndefined();
  });
});
