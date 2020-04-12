import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import User from './user.js'
import guards from './guards.js'
import session from './session.js'
import Game from './game.js'

const {
  APP_HOST,
  APP_PORT,
  JWT_SECRET,
  JWT_EXPIRE,
} = dotenv.config().parsed

const app = express()
const games = []
const { guardMember, guardOwner, guardStatus } = guards(games)
const { checkSession, sendSession } = session(JWT_SECRET, JWT_EXPIRE)

app.use(express.json())
app.use(cors())

User.create({ displayName: 'a', email: 'a', password: 'a' })
User.create({ displayName: 'b', email: 'b', password: 'b' })
User.create({ displayName: 'c', email: 'c', password: 'c' })

app.post('/login', async (req, res, next) => {
    let { email, password } = req.body
    try {
      let user = await User.find({ email })
      if (user.validatePassword(password)) {
        req.user = user
        next()
      } else {
        throw Error('invalid password')
      }
    } catch (e) {
      res.sendStatus(403)
    }
  },
  sendSession
)

app.get('/games', checkSession, (req, res) => {
  res.send(games)
})

app.post('/games', checkSession, (req, res) => {
  let { user } = req
  let game = new Game(user.uuid)

  games.push(game)
  res.send(game)
})

app.get('/games/:gameId', checkSession, (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  if (!game) {
    res.status(404).send('Game not found')
  } else {
    res.send(game)
  }
})

app.delete('/games/:gameId', checkSession, guardOwner(), (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  delete games.splice(games.indexOf(game), 1)
  res.send(`Deleted game ${gameId}`)
})

app.get('/games/:gameId/join',checkSession, guardStatus('created'), (req, res) => {
  let { user } = req
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  try {
    game.addPlayer(user.uuid)
    res.send(game)
  } catch (e) {
    res.status(403).send('Could not join game')
  }
})

app.get('/games/:gameId/start', checkSession, guardOwner(), guardStatus('created'), (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  try {
    game.start()
    res.send(game)
  } catch (e) {
    res.status(403).send('Could not start game, unmet requirements')
  }
})

app.post('/games/:gameId/action', checkSession, guardMember(), (req, res) => {
  let { user } = req
  let { action, payload } = req.body
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  try {
    game.exec(user.uuid, action, payload)
    res.send(game)
  } catch (e) {
    res.status(403).send('Could not execute action')
  }
})

app.listen(APP_PORT, APP_HOST, () => console.log(`Server listening at http://localhost:${APP_PORT}`))
