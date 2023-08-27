import { getUserId, sso } from "@lib/sso/sso";
import installations from "@lib/resources/installations/store";

export interface Character {
  name: string
  id: number
}

export interface UserData extends Character {
  alts: Character[]
  installations: string[]
}

export async function initUserData(userName: string): Promise<UserData> {

  // get user id
  const token = await sso.getToken(userName)
  const userId = getUserId(token)

  // create a main installation
  const mainInstallation = await installations.init('Main Installation', [{ name: userName, id: userId }])

  // build storage
  return {
    name: userName,
    id: userId,
    installations: [ mainInstallation ],
    alts: []
  }

}