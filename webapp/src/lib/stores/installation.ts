import { derived } from "svelte/store";
import userStore from "./user";
import { getInstallationData, type InstallationData } from "@lib/eveApi/installation";
import type { UserData } from "@lib/user";
import type { Readable } from "svelte/store";

type userData = Readable<UserData>
type installationsData = Record<string, Promise<InstallationData>>

const installationStore = derived<userData, installationsData>(
  userStore,
  ($user) => {
    const installations = {}

    for(const i in $user.installations) {
      installations[i] = getInstallationData($user.installations[i].characters)
    }

    return installations
  }
)

export default installationStore