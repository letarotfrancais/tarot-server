import express from 'express'
import cors from 'cors'
import guards from './guards.js'
import Game from './game.js'

const app = express()
const port = 8080
const games = []
const { guardMember, guardOwner, guardStatus } = guards(games)

app.use(express.json())
app.use(cors())

app.get('/games', (req, res) => {
  res.send(games)
})

app.post('/games', (req, res) => {
  let { user } = req.headers
  let game = new Game(user)

  games.push(game)
  res.send(game)
})

app.get('/games/:gameId', (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  if (!game) {
    res.status(404).send('Game not found')
  } else {
    res.send(game)
  }
})

app.delete('/games/:gameId', guardOwner(), (req, res) => {
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

app.post('/games/:gameId/action', guardMember(), (req, res) => {
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

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))
