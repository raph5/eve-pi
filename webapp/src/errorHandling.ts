import type { AuthError } from "@lib/errors"

const FALLBACK_URL = location.origin  + '/landing.html'


function handleAuthError(error: AuthError) {
  document.body.innerHTML = `
    <h1>Authentification Error</h1>
    <p>TODO: write a message that explain the error</p>
    <a href="${FALLBACK_URL}">Go back to lading page</a>
  `
}


addEventListener('error', (event) => {
  if(event.error.name === 'AuthError') {
    handleAuthError(event.error)
  }
})