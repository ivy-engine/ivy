import "boxicons";
import Main from "./tools.svelte";

const el = document.createElement("div");
document.body.appendChild(el);

new Main({
  target: el,
});
