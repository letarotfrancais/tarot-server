import uuid from 'uuid'
import TarotGame from 'tarot-core'

const { v4 } = uuid

const GAME_MIN_PLAYERS = 3
const GAME_MAX_PLAYERS = 4

export default class Game {
  constructor(owner) {
    this.id = v4()
    this.owner = owner
    this.players = []
    this.tarotGame
    this.status = 'created'
    this.addPlayer(owner)
  }
  addPlayer(player) {
    if (!this.players.some(p => p.uuid === player.uuid) && this.players.length <= GAME_MAX_PLAYERS) {
      this.players.push(player)
    } else throw new GameError('player already joined or max players reached')
  }
  start() {
    let { players } = this
    if (players.length >= GAME_MIN_PLAYERS) {
      this.tarotGame = new TarotGame({
        handDealSize: 3,
        dogDealSize: 1,
        dogMaxSize: 6,
        players: this.players.map(p => p.uuid)
      })
      this.tarotGame.start()
      this.status = 'started'
    } else {
      throw new GameError('invalid number of players', players.length)
    }
  }
  exec(playerId, action, payload) {
    let player = this.tarotGame.state.players.findId(playerId)
    let tarotGamePayload = Object.assign({}, payload, { player })
    this.tarotGame.exec(action, tarotGamePayload)
  }
}

export class GameError extends Error {
}