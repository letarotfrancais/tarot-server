export default function(games) {
  return {
    guardOwner: () => (req, res, next) => {
      let { user } = req.headers
      let { gameId } = req.params
      let game = games.find(g => g.id === gameId)

      if (user !== game.owner) {
        res.status(403).send('Check game ownership')
      } else {
        next()
      }
    },

    guardMember: () => (req, res, next) => {
      let { user } = req.headers
      let { gameId } = req.params
      let game = games.find(g => g.id === gameId)

      if (!game.players.includes(user)) {
        res.status(403).send('Check game membership')
      } else {
        next()
      }
    },

    guardStatus: (status) => (req, res, next) => {
      let { gameId } = req.params
      let game = games.find(g => g.id === gameId)

      if (status !== game.status) {
        res.status(403).send('Check game status')
      } else {
        next()
      }
    }
  }
}