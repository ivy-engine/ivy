<script>
  import { onMount } from "svelte";

  import IvyCore from "../ivy-core/IvyCore";
  import IvyThree from "../ivy-three/IvyThree";
  import instancedScene from "./instancedScence";
  import interactionScene from "./interactionScene";
  import loaderScene from "./loaderScene";
  import memoryScene from "./memoryScene";
  import physicsScene from "./physicsScene";
  import testScene from "./testScene";

  let ivy;
  let canvas;

  const handleClick = (scene) => (e) => {
    e.preventDefault();
    console.log({ scene });
    ivy.loadScene(scene);
  };

  onMount(() => {
    console.log("mount");
    ivy = new IvyCore({
      renderer: new IvyThree(canvas, {
        // shadowmapPreset: 'pcss'
      }),
    });

    ivy.loadScene(testScene);
  });
</script>

<div class="sidebar">
  <button on:click={handleClick(testScene)}>Basic Scene</button>
  <button on:click={handleClick(interactionScene)}>Interaction</button>
  <button on:click={handleClick(instancedScene)}>Instanced</button>
  <button on:click={handleClick(loaderScene)}>Object Loader</button>
  <button on:click={handleClick(physicsScene)}>Physics Scene</button>
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
