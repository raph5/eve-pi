<script lang="ts">
  import page from 'page'
  import Installation from './components/views/Installation.svelte'
  import { onMount } from 'svelte';
  import Lodaing from './components/views/Lodaing.svelte';
  import type { ComponentType } from 'svelte';
  import { getUser } from '@lib/user';
  import SSO from '@lib/eveApi/sso';

  const sso = new SSO()
  
  let view = Lodaing

  onMount(() => {

    let publicSide: boolean = true
    let _view: ComponentType
    const user = getUser(sso)

    // client side routing
    page.base('/app')
    page('/', () => _view = Installation)
    page()

    // show loading page if not authentified
    user
      .then(u => {
        console.log("LogIn : " + u)
        view = _view
      })
      .catch(() => {
        location.href = location.origin
      });

  })
</script>

<svelte:component this={view} />