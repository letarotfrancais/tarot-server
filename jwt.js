import jwt from 'jsonwebtoken'
import ms from 'ms'

function extractToken(req) {
  let authorizationHeader = req.headers['authorization']
  if (authorizationHeader) {
    let [,token] = bearerHeader.split(' ')
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
    verifyTokenInHeader: (req, res) => {
      try {
        let token = extractToken(req)
        jwt.verify(token, secret, (err, authData) => {
          if(err) {
            throw new Error(err)
          } else {
            return req.authData = authData
          }
        })
      } catch (error) {
        res.sendStatus(403)
      }
    },
    setTokenInCookie: (req, res, next) => {
      jwt.sign({userId: req.user._id}, secret, { expiresIn }, (err, token) => {
        if(err){
          res.sendStatus(500)
        } else {
          res.cookie('access_token', token, { expires: new Date(Date.now() + ms(expiresIn)) })
          next()
        }
      })
    }
  }
}