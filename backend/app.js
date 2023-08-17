const SingleSignOn = require('./sso')
const express = require('express')

console.log(SingleSignOn)

// dotenv setup
require('dotenv').config()
if(!process.env.SSO_CLIENT_ID || !process.env.SSO_SECRET_KEY) {
  throw new Error("can't find SSO_CLIENT_ID or SSO_SECRET_KEY environment variable")
}

// constants
const PORT = 8000
const CALLBACK_URI = `http://localhost:${PORT}/sso`
const SCOPE = 'esi-planets.manage_planets.v1'
// SSO setup
const sso = new SingleSignOn(
  process.env.SSO_CLIENT_ID,
  process.env.SSO_SECRET_KEY,
  CALLBACK_URI,
  {
    endpoint: 'https://login.eveonline.com',
    userAgent: 'discord : raph_5#0989'
  }
)

// express setup
app = express()


// Handle the SSO callback
app.get('/sso', async (req, res) => {

  const code = req.query.code
  const info = await sso.getAccessToken(code)

  res.send(info.decoded_access_token)

})


// firing
app.listen(PORT, () => {
  console.log(`EVE PI backend listening on port ${PORT}`)
})