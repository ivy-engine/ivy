<script>
  import { onMount } from "svelte";
  import basicScene from "./v1/demo/basicScene";
  import shadowScene from "./v1/demo/shadowScene";
  import Ivy from "./v1/Ivy";

  let ivy;
  let canvas;
  let currentScene;

  const handleClick = (scene) => (e) => {
    e.preventDefault();
    console.log({ scene });
    ivy.loadScene(scene);
  };

  onMount(() => {
    console.log("mount");
    ivy = new Ivy({
      target: canvas,
    });

    // ivy.loadScene(basicScene);
    ivy.loadScene(basicScene);
    // ivy = new IvyCore({
    //   renderer: new IvyThree(canvas, {
    //     // shadowmapPreset: 'pcss'
    //   }),
    // });

    // ivy.loadScene(testScene);
  });
</script>

<div class="sidebar">
  <button on:click={handleClick(basicScene)}>Basic Scene</button>
  <button on:click={handleClick(shadowScene)}>Shadow Scene</button>
</div>

<div bind:this={canvas} class="scene" id="scene " />

<style>
  .sidebar {
    color: white;
    width: 200px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }

  .scene {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 200px;
  }
</style>
