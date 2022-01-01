<script>
  import { onDestroy, onMount } from "svelte";
  import Ivy from "./v1/Ivy";
  const testScene = () => import("./v1/demo/testScene");
  const memoryScene = () => import("./v1/demo/memoryScene");
  const shadowScene = () => import("./v1/demo/shadowScene");
  const xScene = () => import("./v1/demo/xScene");
  const surfaceScatteringScene = () =>
    import("./v1/demo/surfaceScatteringScene");
  const textScene = () => import("./v1/demo/text/textScene");
  const testScatterScene = () => import("./v1/demo/text/testScatterScene");
  const areaLightScene = () => import("./v1/demo/lights/areaLightScene");

  let ivy;
  let canvas;
  let currentScene;
  let showWarning = false;

  const launch =
    (scene, options = {}) =>
    (e) => {
      e?.preventDefault();
      const disabled = window.localStorage.getItem("ivy-warning") === "false";
      if (!disabled) showWarning = !!options.warning;

      scene().then((res) => {
        ivy.loadScene(res.default);
      });
    };

  const disableWarning = () => {
    window.localStorage.setItem("ivy-warning", "false");
    showWarning = false;
  };

  onMount(() => {
    ivy = new Ivy({
      target: canvas,
    });

    launch(surfaceScatteringScene)();
  });

  onDestroy(() => {
    ivy.destroy();
  });
</script>

<div class="sidebar">
  <h3>Sampling</h3>
  <button on:click={launch(surfaceScatteringScene)}>Surface Scattering</button>

  <h3>Text</h3>
  <button on:click={launch(textScene)}>Text (TTF)</button>
  <button on:click={launch(testScatterScene)}>Text Point Scattering</button>

  <h3>Light</h3>
  <button on:click={launch(areaLightScene)}>Light Area Rect</button>

  <h3>Other</h3>
  <button on:click={launch(shadowScene)}>Shadow Scene</button>
  <button on:click={launch(testScene)}>Test Scene</button>
  <button on:click={launch(xScene)}>X Scene</button>
  <button on:click={launch(memoryScene, { warning: true })}>Memory Test</button>
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
