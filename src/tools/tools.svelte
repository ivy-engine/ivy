<script>
  import Object from "./Object.svelte";
  import IvyScene from "../v1/ivy-scene/IvyScene";

  const scene = {
    name: "",
    mainCamera: undefined,
  };

  const color = "#00eee0";
  const size = "xs";

  let objects = [];
  let isOpen = window.localStorage.getItem("isOpen") === "true";
  let ivyInstance;

  window.ivyInstance.listener = (e, ivy) => {
    ivyInstance = ivy;
    if (e === "scene loaded") {
      scene.name = ivy.scene.name;
      scene.mainCamera = ivy.mainCamera;
      objects = [...ivy.scene.objectStack];
      return;
    }

    if (e === "scene destroyed") {
      objects = [];
      scene.name = "";
      scene.mainCamera = undefined;
      return;
    }
    console.log(e);
  };

  const toggleOpen = () => {
    isOpen = !isOpen;
    window.localStorage.setItem("isOpen", isOpen);
  };

  const update = () => {
    if (ivyInstance) {
      objects = ivyInstance.scene.objectStack;
    }
  };

  // toggle open if user presses "="
  document.addEventListener("keydown", (e) => {
    if (e.key === "=") {
      toggleOpen();
    }
  });
</script>

<div class="tools" class:visible={isOpen}>
  <div class="open" on:click={toggleOpen}>=</div>

  <h3>
    <box-icon type="solid" name="label" {color} {size} /> Scene
  </h3>

  <div class="section">
    <div>Name: {scene.name}</div>
    <div>Main Camera: {scene.mainCamera?.type}</div>
  </div>
  <h3>Objects</h3>
  <div class="section">
    {#each objects as object}
      <Object {object} {update} depth={0} />
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
    backdrop-filter: contrast(0.7) blur(8px);
    background-color: #000000cc;
    z-index: 99999;
    border-left: 1px solid #00eee0;
    color: white;
    display: flex;
    flex-direction: column;
    transform: translate(100%, 0);
    transition: transform 0.2s ease-in-out;
  }

  .visible {
    transform: translate(0, 0);
  }

  .open {
    position: absolute;
    right: calc(100% + 2px);
    top: 0;
    width: 20px;
    height: 20px;
    background-color: #000000aa;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  h3 {
    font-size: 1.1em;
    margin: 0;
    font-weight: bold;
    padding: 5px 10px;
    color: #00eee0;
    background-color: rgba(0, 90, 90, 0.5);
    display: flex;
  }

  h3 box-icon {
    margin-right: 6px;
    transform: translateY(-1px);
  }

  .section {
  }
</style>
