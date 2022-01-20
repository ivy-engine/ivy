<script>
  import { onDestroy, onMount } from "svelte";
  import Ivy from "./v2/core/Ivy";
  import AreaLight from "./v2/scenes/AreaLights";
  import ShadowBasic from "./v2/scenes/ShadowBasic";
  import TextSimple from "./v2/scenes/ShadowBasic";

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

      ivy.loadScene(scene);
    };

  const disableWarning = () => {
    window.localStorage.setItem("ivy-warning", "false");
    showWarning = false;
  };

  onMount(() => {
    ivy = new Ivy({
      target: canvas,
    });
    window.ivyInstance = ivy;

    const id = window.location.hash.split("#")[1] ?? "1";

    if (id) {
      document.getElementById(id)?.click();
    } else {
      ivy.loadScene(AreaLight);
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
