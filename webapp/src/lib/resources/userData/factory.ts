import { getUserId, sso } from "@lib/sso/sso";
import installations from "@lib/resources/installations/store";

export interface UserData {
  name: string
  id: number,
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
    installations: [ mainInstallation ]
  }

}