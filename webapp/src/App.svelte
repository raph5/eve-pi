<script lang="ts">
  import page from 'page'
  import Menu from './components/views/Menu.svelte'
  import { onMount } from 'svelte';
  import Lodaing from './components/views/Lodaing.svelte';
  import type { ComponentType } from 'svelte';
  import { getUser } from '@lib/user';
  import SSO from '@lib/eveApi/sso';
  import { Installation } from '@lib/eveApi/installation';

  const sso = new SSO()

  const inst = new Installation(sso, 'Raph Toulouse', [])
  inst.init()
  
  let view = Lodaing

  onMount(() => {

    let _view: ComponentType
    const user = getUser(sso)

    // client side routing
    page.base('/app')
    page('/', () => _view = Menu)
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