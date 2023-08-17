const SingleSignOn = require('./sso')
const express = require('express')

// acces token parser
function parseAccesToken(info) {
  if(
    !info.access_token ||
    !info.refresh_token ||
    !info.decoded_access_token.sub ||
    !info.decoded_access_token.name ||
    info.token_type !== 'Bearer'
  ) throw new Error("invalid token data")

  return {
    access_token: info.access_token,
    refresh_token: info.refresh_token,
    expiration: info.decoded_access_token.exp,
    character_id: parseInt(info.decoded_access_token.sub.split(':')[2]),
    character_name: info.decoded_access_token.name
  }
}

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
  try {
    const code = req.query.code
    const info = await sso.getAccessToken(code)
    const token_data = parseAccesToken(info)
    
    res.cookie('token_data', JSON.stringify(token_data))
    res.redirect(302, '/app');
  }
  catch {
    res.redirect(302, '/?loginerror');
  }
})


// Handle SSO token refresh
app.get('/api/refreshtoken', async (req, res) => {
  try {
    const token = req.query.token
    const info = await sso.getAccessToken(token, true)
    const token_data = parseAccesToken(info)

    res.send(token_data)
  }
  catch (e) {
    res.send({ 'error': 'error' })
  }
})


// firing
app.listen(PORT, () => {
  console.log(`EVE PI backend listening on port ${PORT}`)
})