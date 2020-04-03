import express from 'express'
import Game from './game.js'

const app = express()
const port = 3000
const games = []

app.get('/games', (req, res) => {
  res.send({ games })
})

app.post('/games', (req, res) => {
  let { user } = req.headers
  let game = new Game()

  game.addPlayer(user)
  games.push(game)
  res.send(game)
})

app.get('/games/join/:gameId', (req, res) => {
  let { user } = req.headers
  let { gameId } = req.params
  let game = games.find(g => g.id === gameId)

  game.addPlayer(user)
  res.send(game)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
