<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const texts = [
  "loading.",
  "loading..",
  "loading..."
  ]

  let textIndex: number = 0
  let interval: any

  onMount(() => {
    interval = setInterval( () => textIndex = (textIndex == texts.length-1 ? 0 : textIndex+1), 500 )
  })
  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<p>{texts[textIndex]}</p>