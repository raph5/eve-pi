<script lang="ts">
  import types from "@ccpdata/types/types.json"
  import { esiFetch } from "@lib/eveApi/esi";
  import { getExtractedCommoditys, getPorcessedCommoditys, getProgress, getStorage, getStoredCommoditys, type Planet } from "@lib/eveApi/installation";

  export let planetData: Planet

  let planetName: Promise<string>
  $: planetName = esiFetch(`/universe/planets/${planetData.planet_id}`)
    .then(p => p.name)
    .catch(() => "Error while planet name")

  let extractedCommoditys: number[]
  let porcessedCommoditys: number[]
  let storedCommoditys: number[]
  $: extractedCommoditys = getExtractedCommoditys(planetData)
  $: porcessedCommoditys = getPorcessedCommoditys(planetData)
  $: storedCommoditys = getStoredCommoditys(planetData)

  let progress: number
  let storage: number
  progress = getProgress(planetData)
  storage = getStorage(planetData)

  function cardClick() {
    // TODO: handle card onclick event
  }
  // TODO: review semantic
  // TODO: add edit button
</script>


<div class="card">
  <div class="card__info">

    {#await planetName then name}
      <span class="card__title">{name}</span>
    {/await}

    <div class="card__resources">
      {#if extractedCommoditys}
        <div class="card__resources-row">
          <img src="/assets/eveIcons/extractor.png" alt="extractor icon">
          {#each extractedCommoditys as commodity}
            <img src={`https://imageserver.eveonline.com/Type/${commodity}_32.png`} alt={`commodity image ${commodity}`} title={types[commodity]}>
          {/each}
        </div>
      {:else}
        <div class="card__resources-row">
          <img src="/assets/eveIcons/storage.png" alt="storage icon">
          {#each extractedCommoditys as commodity}
            {#if !porcessedCommoditys.includes(commodity)}
              <img src={`https://imageserver.eveonline.com/Type/${commodity}_32.png`} alt={`commodity image ${commodity}`} title={types[commodity]}>
            {/if}
          {/each}
        </div>
      {/if}
      {#if porcessedCommoditys}
        <div class="card__resources-row">
          <img src="/assets/eveIcons/process.png" alt="process icon">
          {#each porcessedCommoditys as commodity}
            <img src={`https://imageserver.eveonline.com/Type/${commodity}_32.png`} alt={`commodity image ${commodity}`} title={types[commodity]}>
          {/each}
        </div>
      {/if}
    </div>

    <div class="card__progress" style="--progress: {progress}; --storage: {storage}">
      <span class="card__progress-label">progress</span>
      <span class="card__progress-bar card__progress-bar--progress"></span>
      <span class="card__progress-label">storage</span>
      <span class="card__progress-bar card__progress-bar--storage"></span>
    </div>

  </div>

  <img class="card__bg" src={`/assets/planets/${planetData.planet_type}.png`} alt="${planetData.planet_type} planet img">
</div>


<style lang="scss">
  @import '../../scss/var';

  .card {
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
</style>