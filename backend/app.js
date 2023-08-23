const SingleSignOn = require('./sso')
const express = require('express')
const cors = require('cors')

// acces token parser
const isValidAccesToken = (info) => (
  typeof info === 'object' && info &&
  typeof info['access_token'] === 'string' &&
  typeof info['refresh_token'] === 'string' &&
  typeof info['expires_in'] === 'number' &&
  typeof info['decoded_access_token'] === 'object' && info['decoded_access_token'] &&
  typeof info['decoded_access_token']['name'] === 'string'
)

// dotenv setup
require('dotenv').config()
if(!process.env.SSO_CLIENT_ID || !process.env.SSO_SECRET_KEY) {
  throw new Error("can't find SSO_CLIENT_ID or SSO_SECRET_KEY environment variable")
}

// constants
const PORT = 8000
const CALLBACK_URI = `http://localhost:${PORT}/sso`
const APP_URL = 'http://localhost:5173'

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
app.use(cors({ origin: APP_URL }))


// Handle the SSO callback
app.get('/sso', async (req, res) => {
  try {
    const code = req.query.code
    const token_data = await sso.getAccessToken(code)

    if( !isValidAccesToken(token_data) ) throw new Error("invalid acces token type")

    res.cookie('tokenData', JSON.stringify(token_data))
    res.redirect(302, APP_URL + '/app/')
  }
  catch(e) {
    console.error(e)
    res.redirect(302, APP_URL + '/?loginerror')
  }
})


// Handle SSO token refresh
app.get('/api/token/refresh', async (req, res) => {
  try {
    const token = req.query.token
    const token_data = await sso.getAccessToken(token, true)

    if( !isValidAccesToken(token_data) ) throw new Error("invalid acces token type")

    res.send({ 'data': token_data })
  }
  catch {
    res.send({ 'error': 'error' })
  }
})


// Handle SSO token revoking
app.get('/api/token/revok', async (req, res) => {
  try {
    const token = req.query.token
    await sso.revokAccessToken(token)

    res.send({ 'data': 'success' })
  }
  catch {
    res.send({ 'error': 'error' })
  }
})


// firing
app.listen(PORT, () => {
  console.log(`EVE PI backend listening on port ${PORT}`)
})