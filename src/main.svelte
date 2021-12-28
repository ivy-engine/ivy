<script>
  import { onMount } from "svelte";
  import testScene from "./v1/demo/testScene";
  import memoryScene from "./v1/demo/memoryScene";
  import shadowScene from "./v1/demo/shadowScene";
  import Ivy from "./v1/Ivy";
  import xScene from "./v1/demo/xScene";

  let ivy;
  let canvas;
  let currentScene;
  let showWarning = false;

  const handleClick =
    (scene, options = {}) =>
    (e) => {
      e.preventDefault();
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

    ivy.loadScene(shadowScene);
  });
</script>

<div class="sidebar">
  <button on:click={handleClick(memoryScene, { warning: true })}
    >Memory Test</button
  >
  <button on:click={handleClick(shadowScene)}>Shadow Scene</button>
  <button on:click={handleClick(testScene)}>Test Scene</button>
  <button on:click={handleClick(xScene)}>X Scene</button>
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
    width: 200px;
  }

  .sidebar {
    color: white;
    width: 200px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
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
