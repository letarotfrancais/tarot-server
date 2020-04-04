import express from 'express'
import cors from 'cors'
import Game from './game.js'

const app = express()
const port = 8080
const games = []

app.use(express.json())
app.use(cors())

app.get('/games', (req, res) => {
  res.send(games)
})

app.post('/games', (req, res) => {
  let { user } = req.headers
  let game = new Game(user)

  game.addPlayer(user)
  games.push(game)
  res.send(game)
})

app.get('/games/:gameId', (req, res) => {
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  res.send(game)
})

app.delete('/games/:gameId', (req, res) => {
  let { user } = req.headers
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)
  if (user === game.owner) {
    delete games.splice(games.indexOf(game), 1)
    res.send('Deleted game')
  } else {
    res.send('Could not delete game, check id and ownership')
  }

})

app.post('/games/:gameId/join', (req, res) => {
  let { user } = req.headers
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  game.addPlayer(user)
  res.send(game)
})

app.get('/games/:gameId/start', (req, res) => {
  let { user } = req.headers
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  if (user === game.owner && game.players.includes(user)) {
    game.start()
  }
  res.send(game)
})

app.post('/games/:gameId/action', (req, res) => {
  let { user } = req.headers
  let { action, payload } = req.body
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  if (game.players.includes(user)) {
    game.exec(user, action, payload)
  }
  res.send(game)
})

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))
