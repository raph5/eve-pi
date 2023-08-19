

// transform a base64 string into an ArrayBuffer
export function base64ToBuffer(base64String: string): ArrayBuffer {
  const dataString = atob(base64String)
  const dataUint8 = Uint8Array.from(dataString, c => c.charCodeAt(0))
  return dataUint8.buffer
}



// transfrom cpp res url into an actual https url
export function buildResUrl(resUrl: string): string {
  
  // split url in tow parts
  const prefix = resUrl.substring(0, 4)
  let resourcePath = resUrl.substring(4)

  // check resUrl validity
  if(prefix !== 'res:') {
    throw new Error(`Can't build invalid resUrl : ${resUrl}`)
  }

  // normalizes the file path by making it lower case
  resourcePath = resourcePath.toLowerCase()

  // return http url
  return 'https://developers.eveonline.com/ccpwgl/assetpath/1097993' + resourcePath

}



// document.cookie parser
export function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function deleteCookie(cmane: string) {
  document.cookie = `${cmane}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}



// redirection function
// export function redirect(url: string) {
//   const el = document.createElement('a')
//   el.href = document.location.origin + url
//   el.click()
// }