<script>
  import { onDestroy, onMount } from "svelte";
  import Ivy from "./v2/core/Ivy";
  const AreaLight = () => import("./v2/scenes/AreaLights");
  const PhysicsGroup = () => import("./v2/scenes/PhysicsGroup");
  const PhysicsSimple = () => import("./v2/scenes/PhysicsSimple");
  const ShadowBasic = () => import("./v2/scenes/ShadowBasic");
  const TextSimple = () => import("./v2/scenes/ShadowBasic");
  const TextBasic = () => import("./v2/scenes/TextBasic");
  const TextTroika = () => import("./v2/scenes/TextTroika");

  let ivy;
  let canvas;
  let currentScene;
  let showWarning = false;

  const launch =
    (scene, options = {}) =>
    (e) => {
      e?.preventDefault();
      const id = e?.target?.id;
      if (id) {
        window.location.hash = id;
      }

      const disabled = window.localStorage.getItem("ivy-warning") === "false";
      if (!disabled) showWarning = !!options.warning;

      scene().then((s) => {
        ivy.loadScene(s.default);
      });
    };

  const disableWarning = () => {
    window.localStorage.setItem("ivy-warning", "false");
    showWarning = false;
  };

  onMount(() => {
    ivy = new Ivy({
      target: canvas,
      physics: true,
    });
    window.ivyInstance = ivy;

    const id = window.location.hash.split("#")[1] ?? "1";

    if (id) {
      document.getElementById(id)?.click();
    } else {
      AreaLight().then(s => {
        ivy.loadScene(s.default);
      });
    }
  });

  onDestroy(() => {
    ivy.dispose();
  });
</script>

<div class="sidebar">
  <button on:click={launch(AreaLight)} id="area-light">Area Light</button>
  <button on:click={launch(ShadowBasic)} id="shadow-simple"
    >Shadow Simple</button
  >
  <button on:click={launch(TextBasic)} id="text-simple">Text Simple</button>
  <button on:click={launch(TextTroika)} id="text-troika">Text Troika</button>
  <button on:click={launch(PhysicsSimple)} id="physics-simple"
    >Physics Simple</button
  >
  <button on:click={launch(PhysicsGroup)} id="physics-group">Physics Group</button>
</div>

<div bind:this={canvas} class="scene" id="scene " />
<div class="overlay {showWarning ? 'show' : 'hide'}">
  <div class="warning">
    <h1>WARNING</h1>
    <p>This scene contains flashing images.</p>

    <button on:click={disableWarning}>Thats OK, Continue</button>
  </div>
</div>

<style>
  button {
    display: block;
    width: 100%;
  }

  h3 {
    margin: 1em 0 0.2em 0.2em;
    font-size: 0.8em;
  }

  .sidebar {
    color: white;
    width: 199px;
    height: 100%;
    position: fixed;
    top: 0;
    border-right: 1px solid white;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
  }

  .scene,
  .overlay {
    position: fixed;
    top: 0;
    left: 200px;
    right: 0;
    bottom: 0;
  }

  .overlay {
    z-index: 10;
    background-color: #000000f3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .warning {
    background-color: #000000f3;
    color: white;
    border: 1px solid white;
    padding: 20px;
    width: 400px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .warning h1 {
    font-size: 2em;
    margin: 0;
  }

  .overlay.hide {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s ease-in-out;
  }
</style>
