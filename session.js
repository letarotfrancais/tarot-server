import jwt from 'jsonwebtoken'
import User from './user'

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
    checkSession: (req, res, next) => {
      try {
        let token = extractToken(req)
        jwt.verify(token, secret, async (err, { uuid }) => {
          if(err) {
            throw new Error(err)
          } else {
            let user = await User.find({ uuid })
            req.user = user
            next()
          }
        })
      } catch (error) {
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