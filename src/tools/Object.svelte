<script>
  export let object;
  export let update;
  export let depth;

  const color = "#00eee0";
  const colorOff = "#ff33aa";
  const size = "xs";

  const type = object.object.type;
  const name = object.name || type;

  let visible = object.object.visible;

  let icon = "dice-4";
  const isLight = type.toLowerCase().includes("light");
  const isGroup = object.children.length > 0;
  let groupOpen = false;

  if (isLight) icon = "sun";
  // if (isGroup) icon = "collection";

  console.log(type, object);

  const toggleVisibility = () => {
    object.object.visible = !object.object.visible;
    visible = object.object.visible;
    update();
  };
</script>

<div class="obj-item">
  <div class="group-actions">
    {#if isGroup}
      <button on:click={() => (groupOpen = !groupOpen)}>
        <box-icon
          type="icon"
          name={groupOpen ? "down-arrow" : "right-arrow"}
          color={visible ? color : colorOff}
          {size}
        />
      </button>
    {/if}
  </div>

  <div class="icon">
    <box-icon type="solid" name={icon} color="white" {size} />
  </div>
  <div class="name">{name}</div>
  <div class="actions">
    <button on:click={toggleVisibility}>
      <box-icon
        type="icon"
        name="hide"
        color={visible ? color : colorOff}
        {size}
      />
    </button>
  </div>
</div>
{#if groupOpen}
  <div class="children" class:outer={depth === 0} style="--depth: {depth}">
    {#each object.children as child}
      <svelte:self object={child} {update} depth={depth + 1} />
    {/each}
  </div>
{/if}

<style>
  .obj-item {
    display: flex;
    justify-content: center;
    --height: 25px;
    height: var(--height);
  }

  .icon {
    padding: 5px 5px 5px 5px;
    transform: translateY(-1.5px);
    height: 0;
  }

  .name {
    padding: 5px;
    flex: 1;
  }

  .group-actions button {
    background: none;
    padding: 0 0 0 5px;
    border: 0;
    height: var(--height);
  }

  .actions button {
    background: none;
    border: 0;
    padding: 0 5px;
    height: var(--height);
  }

  .children {
    border-left: 2px solid #00eee0;
  }

  .children.outer {
    border-bottom: 1px solid #00eee0;
    padding-bottom: 4px;
  }
</style>
