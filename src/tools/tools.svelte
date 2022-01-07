<script>
  import Object from "./Object.svelte";
  import IvyScene from "../v1/ivy-scene/IvyScene";

  const scene = {
    name: ":(",
    mainCamera: undefined,
  };

  let objects = [];

  window.ivyInstance.listener = (e, ivy) => {
    console.log(e, ivy);
    if (e === "scene loaded") {
      scene.name = ivy.scene.name;
      scene.mainCamera = ivy.mainCamera;
      objects = [...ivy.scene.objectStack];
    }
  };
</script>

<div class="tools">
  <h3>Scene</h3>
  <div class="section">
    <div>Name: {scene.name}</div>
    <div>Main Camera: {scene.mainCamera?.type}</div>
  </div>
  <h3>Objects</h3>
  <div class="section">
    {#each objects as object}
      <Object {object} />
    {/each}
  </div>
</div>

<style>
  .tools {
    position: fixed;
    font-size: 13px;
    top: 0;
    right: 0;
    bottom: 0;
    width: 240px;
    background: rgba(120, 120, 120, 0.5);
    z-index: 99999;
    border-left: 1px solid #00eee0;
    color: white;
    display: flex;
    flex-direction: column;
  }

  h3 {
    font-size: 1.1em;
    line-height: 1;
    margin: 0;
    font-weight: bold;
    padding: 5px;
    color: #00eee0;
    background-color: #000;
    border-top: rgba(0, 0, 0, 0.5);
  }

  .section {
    padding: 5px;
  }
</style>
