import Loading from "@src/components/views/Loading.svelte";
import { readable } from "svelte/store";
import navaid from "navaid";
import Installations from "@src/components/views/Installations.svelte";
import type { ComponentType } from "svelte";
import LandingPage from "@src/components/views/LandingPage.svelte";

interface View {
  component: ComponentType
  props: Record<string, any>
}

function createView(component: ComponentType, props: Record<string, any> = {}): View {
  return { component, props }
}

const router = navaid('/', () => redirect(location.origin + '/app'))

const loadingView: View = { component: Loading, props: {} }

export const view = readable<View>(loadingView, (set) => {

  router.on('/', () => set( createView(LandingPage) ))
  router.on('/app/', () => router.route('/app/installations/', true))
  router.on('/app/installations/', () => set( createView(Installations) ))
  router.on('/app/installations/:id', ({ id }) => set( createView(Installations, { id }) ))

  router.listen()

  return () => router.unlisten()

})

export function redirect(url: string) {
  return router.route(url, true)
}