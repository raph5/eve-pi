<script lang="ts">
  import page from 'page'
  import Installation from './components/views/Installation.svelte'
  import { onMount } from 'svelte';
  import Lodaing from './components/views/Lodaing.svelte';
  import type { ComponentType } from 'svelte';
  import { isLogedIn } from '@lib/user';

  let view = Lodaing

  onMount(() => {

    let publicSide: boolean = true
    let _view: ComponentType
    const logedIn = isLogedIn()

    // client side routing
    page.base('/app')
    page('/', () => _view = Installation)
    page()

    // show loading page if not authentified
    logedIn.then(logedIn => {

      if(logedIn) {
        view = _view
      }
      else {
        if(!publicSide) document.location.href = document.location.origin
      }

    });

  })
</script>

<svelte:component this={view} />