import { randomId } from "@utils/utils";
import { writable } from "svelte/store";

export type notifType = 'error' | 'warn' | 'info'

interface Notification {
  type: notifType
  message: string
  id: string
}

function createNotificationsStore() {
  
  const { subscribe, set, update } = writable<Notification[]>([])

  function push(message: string, type: notifType) {
    update(notifs => {
      notifs.unshift({
        message,
        type,
        id: randomId()
      })
      return notifs
    })
  }

  function remove(id: string) {
    update(notifs => {
      const index = notifs.findIndex(e => e.id === id)
      notifs.splice(index, 1)
      return notifs
    })
  }

  return {
    subscribe,
    push,
    remove
  }

}

const notifications = createNotificationsStore()

export default notifications