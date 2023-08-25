<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "../small/Button.svelte";

	export let showModal: boolean
  export let title: string
  export let okButton = ''
  export let cancelButton = 'close'
  export let okButtonEnabled = true

	let dialog: HTMLDialogElement;
  
	const dispatch = createEventDispatcher();

  function ok() {
    dialog.close()
    dispatch('ok')
  }
  function cancel() {
    dialog.close()
    dispatch('cancel')
  }

	$: if (dialog && showModal) dialog.showModal();
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={() => showModal = false}
  class="modal"
>
  <div class="modal__header">
    <h1 class="modal__title">{title}</h1>
  </div>

  <div class="modal__body">
    <slot />
  </div>

  <div class="modal__footer">
    {#if okButton}
      <Button
        on:click={() => ok()}
        icon="done"
        text={okButton}
        style={okButtonEnabled ? 'solid' : 'solid'}
      />
    {/if}
    {#if cancelButton}
      <Button
        on:click={() => cancel()}
        icon="close"
        text={cancelButton}
        style="solid"
      />
    {/if}
  </div>
</dialog>


<style lang="scss">
  @import '../../scss/var';

  .modal {
    border: none;
    border-radius: 8px;
    background: $background2;
    min-width: 50%;
    max-width: 90%;
    min-height: 300px;
    max-height: 80%;
    display: flex;
    flex-direction: column;
    margin-top: 100px;
    box-shadow: 0 0 40px #0006;
    color: $font-color;
    cursor: default;
    padding: 16px 0;
    opacity: 0;
    transform: translateY(-70px);
    transition: opacity 200ms, transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &__header {
      padding: 0 16px;
      padding-bottom: 16px;
      border-bottom: solid 1px lighten($color: $background2, $amount: 5);
    }
    &__title {
      margin: 0;
    }
    &__body {
      padding: 16px;
      height: 100%;
    }
    &__footer {
      padding: 0 16px;
      padding-top: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: auto;
      border-top: solid 1px lighten($color: $background2, $amount: 5);
    }

    &::backdrop {
      background: #0006;
      opacity: 0;
      transition: opacity 300ms;
    }
    
    &[open] {
      opacity: 1;
      transform: none;
      
      &::backdrop {
        opacity: 1;
      }
    }
  }
</style>