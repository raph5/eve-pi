<script lang="ts">
  import notifications from "@lib/notifications";
  import Notification from "../small/Notification.svelte";
</script>


<div class="dispenser">
  {#each $notifications as notif (notif.id)}
    <Notification {...notif} automaticclosing />
  {/each}
</div>


<style lang="scss">
  .dispenser {
    position: absolute;
    z-index: 100;
    top: 16px;
    left: calc(50% + 16px);
    transform: translateX(-50%);
    min-width: 500px;
    width: 70%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>