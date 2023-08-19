import type SSO from "./eveApi/sso"

export async function getUser(sso: SSO) {
  
  let user = localStorage.getItem('user')
  
  // on first login ther is no 'user' in localStorage
  if(!user) {
    await sso.isReady()
    if(sso.cookieToken) {
      user = sso.cookieToken.decoded_access_token.name
      localStorage.setItem('user', user)
      sso.cookieToken = null
    }
  }
  
  const token = await sso.getToken(user).catch((e: Error) => {
    if(e.message === "No token with this name") throw new Error("User not loged")
    else throw e
  })
  
  return token.decoded_access_token.name

}

export async function logOff(sso: SSO) {

  await sso.destroyToken( await getUser(sso) )

}