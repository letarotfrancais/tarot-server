import uuid from 'uuid'

const { v4 } = uuid

const GAME_MIN_PLAYERS = 3
const GAME_MAX_PLAYERS = 4

export default class Game {
  constructor() {
    this.id = v4()
    this.players = []
  }
  addPlayer(player) {
    if (!this.players.includes(player) && this.players.length <= GAME_MAX_PLAYERS) {
      this.players.push(player)
    } else throw GameError('player already registered or max players reached')
  }
}

export class GameError extends Error {
}