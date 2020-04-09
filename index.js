import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import passportGoogleOAuth from 'passport-google-oauth2'
import User from './user.js'
import guards from './guards.js'
import jwt from './jwt.js'
import Game from './game.js'

const {
  APP_HOST,
  APP_PORT,
  JWT_SECRET,
  JWT_EXPIRE,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID
} = dotenv.config().parsed

const app = express()
const games = []
const { guardMember, guardOwner, guardStatus } = guards(games)
const { verifyTokenInHeader, setTokenInCookie } = jwt(JWT_SECRET, JWT_EXPIRE)

app.use(express.json())
app.use(cors())

// START AUTH

app.use(passport.initialize())

const { Strategy: GoogleStrategy } = passportGoogleOAuth
const OAUTH_PROVIDERS_OPTIONS = {
  'google':  {
    scope: ['https://www.googleapis.com/auth/plus.login'],
    accessType: 'offline',
    approvalPrompt: 'force',
    session: 'false'
  }
}
const strategyOptions = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `http://${APP_HOST}:${APP_PORT}/auth/${'google'}/callback` // 'google' is the provider name, can be made dynamic
}
const verifyCallback = (accessToken, refreshToken, profile, done) => {
  User.findOrCreateByProfile(profile).then((user, err) => done(null, user))
}

passport.use(new GoogleStrategy(strategyOptions, verifyCallback));
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)))

app.get('/auth/:provider', (req, res, next) => {
  let { provider } = req.params
  return passport.authenticate(provider, OAUTH_PROVIDERS_OPTIONS[provider])(req, res, next)
}, (req, res) => status.send('coucou'))

app.get('/auth/:provider/callback',
  (req, res, next) => {
    let { provider } = req.params
    return passport.authenticate(provider, { session: false })(req, res, next)
  },
  setTokenInCookie,
  (req, res) => res.redirect('http://localhost:3000')
)

// END AUTH

app.get('/games', verifyTokenInHeader, (req, res) => {
  res.send(games)
})

app.post('/games', verifyTokenInHeader, (req, res) => {
  let { user } = req.headers
  let game = new Game(user)

  games.push(game)
  res.send(game)
})

app.get('/games/:gameId', verifyTokenInHeader, (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  if (!game) {
    res.status(404).send('Game not found')
  } else {
    res.send(game)
  }
})

app.delete('/games/:gameId', verifyTokenInHeader, guardOwner(), (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  delete games.splice(games.indexOf(game), 1)
  res.send(`Deleted game ${gameId}`)
})

app.get('/games/:gameId/join', guardStatus('created'), (req, res) => {
  let { user } = req.headers
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  try {
    game.addPlayer(user)
    res.send(game)
  } catch (e) {
    res.status(403).send('Could not join game')
  }
})

app.get('/games/:gameId/start', guardOwner(), guardStatus('created'), (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  try {
    game.start()
    res.send(game)
  } catch (e) {
    res.status(403).send('Could not start game, unmet requirements')
  }
})

app.post('/games/:gameId/action', verifyTokenInHeader, guardMember(), (req, res) => {
  let { user } = req.headers
  let { action, payload } = req.body
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  try {
    game.exec(user, action, payload)
    res.send(game)
  } catch (e) {
    res.status(403).send('Could not execute action')
  }
})

app.listen(APP_PORT, APP_HOST, () => console.log(`Server listening at http://localhost:${APP_PORT}`))
