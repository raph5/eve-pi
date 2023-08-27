<script lang="ts">
  import type { notifType } from "@lib/notifications";
  import notifications from "@lib/notifications";
  import { onDestroy, onMount } from "svelte";
  import IconButton from "./IconButton.svelte";

  export let message: string
  export let type: notifType
  export let id: string
  export let automaticclosing = false

  let icon: string
  $: switch (type) {
    case 'error':
      icon = 'error'
      break;
    case 'warn':
      icon = 'warning'
      break;
    case 'info':
      icon = 'info'
      break;
  }

  function close() {
    notifications.remove(id)
  }

  if(automaticclosing) {
    let timeout: NodeJS.Timeout
    
    onMount(() => {
      timeout = setTimeout(close, 8000)
    })
    onDestroy(() => {
      clearInterval(timeout)
    })
  }
</script>


<div class="notif notif--{type}">
  <div class="notif__icon-box">
    <span class="notif__icon material-symbols-rounded">{icon}</span>
  </div>
  <div class="notif__message">{message}</div>
  <div class="notif__button">
    <IconButton style="transparent" icon="close" on:click={close} />
  </div>
</div>


<style lang="scss">
  @import '../../scss/var.scss';

  .notif {
    @include solid-shadow($bg-2, 5, 0 0 10px #000a);
    width: 100%;
    min-height: 40px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    border-radius: 8px;
    box-sizing: border-box;
    color: $font-light;
    animation: slide 200ms ease-in;
    
    &__icon-box {
      @include solid($blue, 10);
      width: 55px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__icon {
      color: $font-light;
      font-size: 24px;
    }
    &__message {
      @include paragraph;
      padding: 10px 16px;
      word-wrap: break-word;
    }
    &__button {
      display: flex;
      align-items: center;
      padding-left: auto;
      padding-right: 8px;
    }

    &--warn &__icon-box {
      @include solid($yellow, 10);
    }
    &--error &__icon-box {
      @include solid($red, 10);
    }
  }

  @keyframes slide {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
  }
</style>