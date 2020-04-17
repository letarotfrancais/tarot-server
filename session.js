import jwt from 'jsonwebtoken'
import database from './database.js'

const { user: User } = database.sequelize.models

function extractToken(req) {
  let authorizationHeader = req.headers['authorization']
  if (authorizationHeader) {
    let [,token] = authorizationHeader.split(' ')
    if (token) {
      return token
    } else {
      throw new Error('authorization header has no token')
    }
  } else {
    throw new Error('request has no authorization header')
  }
}

export default function(secret, expiresIn) {
  return {
    checkSession: async (req, res, next) => {
      try {
        let token = extractToken(req)
        let { uuid } = jwt.verify(token, secret)
        let user = await User.findOne({ where: { uuid } }) // TODO might be cached with the session
        req.user = user
        next()
      } catch (error) {
        console.log(error);

        res.sendStatus(403)
      }
    },
    sendSession: (req, res) => {
      let { uuid, displayName } = req.user
      jwt.sign({ uuid, displayName }, secret, { expiresIn }, (err, token) => {
          if(err){
            res.sendStatus(500)
          } else {
            res.send({ token })
          }
        }
      )
    }
  }
}