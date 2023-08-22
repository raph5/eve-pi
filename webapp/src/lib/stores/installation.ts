import { derived } from "svelte/store";
import userStore from "./user";
import { getInstallationData, type InstallationData } from "@lib/eveApi/installation";
import type { UserData } from "@lib/user";
import type { Readable } from "svelte/store";

const installationStore = derived<Readable<Promise<UserData>>, Promise<InstallationData>>(
  userStore,
  ($user) => $user.then(u => getInstallationData([ u ]))
)

export default installationStore