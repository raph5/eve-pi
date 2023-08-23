import { derived } from "svelte/store";
import userStore from "./user";
import { getInstallationData, type InstallationData } from "@lib/eveApi/installation";
import type { UserData } from "@lib/user";
import type { Readable } from "svelte/store";

type userData = Readable<Promise<UserData>>
type installationsData = Promise<Record<string, Promise<InstallationData>>>

const installationStore = derived<userData, installationsData>(
  userStore,
  ($user) => $user.then(u => {
    const installations = {}

    for(const i in u.installations) {
      installations[i] = getInstallationData(u.installations[i].characters)
    }

    return installations
  })
)

export default installationStore