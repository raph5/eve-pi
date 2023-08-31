<script lang="ts">
  import planets from "@lib/resources/planetsSetup/store";
  import Modal from "../medium/Modal.svelte";
  import TextInput from "../small/TextInput.svelte";

  export let setupId: string
  export let showModal: boolean

  let planetName = $planets[setupId].setup_name

  function setPlanetName() {
    planets.setName(setupId, planetName)
  }
</script>


<Modal
  bind:showModal
  title="Planet settings"
  cancelButton="cancel"
  saveButton="save"
  on:save={setPlanetName}
>
  <span class="label">Planet name</span>
  <TextInput bind:value={planetName} />
</Modal>