import uuid from 'uuid'
import TarotGame from 'tarot-core'

const { v4 } = uuid

const GAME_MIN_PLAYERS = 3
const GAME_MAX_PLAYERS = 4

export default class Game {
  constructor() {
    this.id = v4()
    this.players = []
    this.tarotGame
  }
  addPlayer(player) {
    if (!this.players.includes(player) && this.players.length <= GAME_MAX_PLAYERS) {
      this.players.push(player)
    } else throw new GameError('player already registered or max players reached')
  }
  start() {
    let { players } = this
    if (players.length >= GAME_MIN_PLAYERS) {
      this.tarotGame = new TarotGame({
        handDealSize: 3,
        dogDealSize: 1,
        dogMaxSize: 6,
        players
      })
      this.tarotGame.start()
    }
  }
  exec(playerId, action, payload) {
    let player = this.tarotGame.state.players.findId(playerId)
    let tarotGamePayload = Object.assign({}, payload, { player })
    console.log(tarotGamePayload);

    this.tarotGame.exec(action, tarotGamePayload)
  }
}

export class GameError extends Error {
}