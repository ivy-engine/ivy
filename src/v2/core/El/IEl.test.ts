import IEl from "./IEl";

describe("IEl", () => {
  const el = new IEl({});

  it("should work", () => {
    expect(el).toBeDefined();
  });
});
