<script lang="ts">
  import page from 'page'
  import Menu from './components/views/Menu.svelte'
  import { onMount } from 'svelte';
  import Lodaing from './components/views/Lodaing.svelte';
  import type { ComponentType } from 'svelte';
  import { getUser } from '@lib/user';
  import SSO from '@lib/eveApi/sso';
  import { installation } from '@lib/eveApi/installation';

  const sso = new SSO()
  
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
      .then(_user => {
        console.log("LogIn : " + _user)
        view = _view
        // installation.init(sso, _user, [])
      })
      .catch((e) => {
        location.href = location.origin + '/?loginerror'
      });

  })
</script>

<svelte:component this={view} />