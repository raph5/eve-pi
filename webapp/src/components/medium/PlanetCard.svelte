<script lang="ts">
  import types from "@ccpdata/types/types.json"
  import Modal from "./Modal.svelte";
  import TextInput from "../small/TextInput.svelte";
  import planets from "@lib/resources/planetsSetup/store";
  import { planetsProgress, planetsStorage, extractedCommoditys, porcessedCommoditys, storedCommoditys } from "@lib/resources/planetsSetup/derived"
    import { itemImg } from "@utils/ui";

  export let setupId: string;
  
  // edit planet modal
  let showEditModal = false
  let planetName = $planets[setupId].setup_name
  function setPlanetName() {
    planets.setName(setupId, planetName)
  }
</script>


<a href={'TODO: set rederection url'} class="card">
  <div class="card__info">

    <span class="card__title">{$planets[setupId].setup_name}</span>

    <div class="card__resources">
      {#if $extractedCommoditys[setupId]}
        <div class="card__resources-row">
          <img src="/assets/eveIcons/extractor.png" alt="extractor icon">
          {#each $extractedCommoditys[setupId] as commodity}
            <img src={itemImg(commodity.type)} alt="commodity image {commodity.type}" title={commodity.name}>
          {/each}
        </div>
      {:else}
        <div class="card__resources-row">
          <img src="/assets/eveIcons/storage.png" alt="storage icon">
          {#each $storedCommoditys[setupId] as commodity}
            {#if !$porcessedCommoditys[setupId].includes(commodity)}
              <img src={itemImg(commodity.type)} alt="commodity image {commodity.type}" title={commodity.name}>
            {/if}
          {/each}
        </div>
      {/if}
      {#if $porcessedCommoditys[setupId]}
        <div class="card__resources-row">
          <img src="/assets/eveIcons/process.png" alt="process icon">
          {#each $porcessedCommoditys[setupId] as commodity}
            <img src={itemImg(commodity.type)} alt="commodity image {commodity.type}" title={commodity.name}>
          {/each}
        </div>
      {/if}
    </div>

    <div class="card__progress" style="--progress: {$planetsProgress[setupId]}; --storage: {$planetsStorage[setupId]}">
      <span class="card__progress-label">progress</span>
      <span class="card__progress-bar card__progress-bar--progress"></span>
      <span class="card__progress-label">storage</span>
      <span class="card__progress-bar card__progress-bar--storage"></span>
    </div>

  </div>

  <button class="edit-button" on:click|stopPropagation={() => showEditModal = true}>
    <span class="edit-button__icon material-symbols-rounded">edit</span>
  </button>
  <Modal
    title="Planet settings"
    bind:showModal={showEditModal}
    cancelButton="cancel"
    okButton="save"
    on:ok={setPlanetName}
  >
    <TextInput name="Planet name" bind:value={planetName} showLabel={true} />
  </Modal>

  <img class="card__bg" src="/assets/planets/{$planets[setupId].planet_type}.png" alt="{$planets[setupId].planet_type} planet img">
</a>


<style lang="scss">
  @import '../../scss/var';

  .card {
    display: block;
    text-decoration: none;
    aspect-ratio: 3/2;
    max-width: 400px;
    width: 100%;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    background: $background1;
    box-shadow: 0 0 16px #000;
    user-select: none;
    cursor: pointer;

    &__info {
      position: relative;
      box-sizing: border-box;
      height: 100%;
      z-index: 2;
      color: $font-color;
      padding: 16px;
      padding-right: 0;
      display: flex;
      flex-direction: column;
    }
    &__title {
      @include header2;
    }
    &__bg {
      width: 115%;
      position: absolute;
      z-index: 0;
      left: 50%;
      top: -28%;
      opacity: 0.8;
    }
    &__resources {
      margin-top: 8px;

      img {
        width: 24px;
        height: 24px;
      }
    }
    &__resources-row {
      display: flex;
    }
    &__progress {
      width: 55%;
      margin-top: auto;
      display: grid;
      grid-template-columns: max-content 1fr;
      grid-template-rows: 18px 18px;
      column-gap: 8px;
      row-gap: 2px;
    }
    &__progress-label {
      @include label;
    }
    &__progress-bar {
      margin-top: 9px;
      height: 3px;
      width: 100%;
      border-radius: 10px;
      background: #fff2;
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0% 0%;
      }
      &--progress::after {
        transform: scaleX(calc(100% * var(--progress)));
        background: $chart-color4;
      }
      &--storage::after {
        transform: scaleX(calc(100% * var(--storage)));
        background: $chart-color1;
      }
    }
  }

  .edit-button {
    @include solid-button($background3, 20px, 0.4);
    @include button-reset;
    position: absolute;
    z-index: 3;
    right: 16px;
    top: 16px;
    border-radius: 8px;
    padding: 4px;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    
    &__icon {
      color: $font-color;
      font-size: 20px;
    }
  }
</style>