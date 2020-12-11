
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')
const db = require('./db')

const fetchKeyFromOpenIDServer = async (jwks_uri, token) => {
  const header = JSON.parse( Buffer.from(
      token.split('.')[0], 'base64'
    ).toString('utf-8')
  )
  const {publicKey, rsaPublicKey} = await jwksClient({
    jwksUri: jwks_uri
  }).getSigningKeyAsync(header.kid)
  return publicKey || rsaPublicKey
}

module.exports = ({jwks_uri} = {}) => {
  if(!jwks_uri){
    throw Error('Invalid Settings: jwks_uri is required')
  }
  console.log(jwks_uri)
  return async (req, res, next) => {
    if(! req.headers['authorization'] ){
      res.status(401).send('Missing Access Token')
      return
    }
    const header = req.headers['authorization']
    const nooauth = req.headers['no-oauth']
    const [type, access_token] = header.split(' ')
    if(type !== 'Bearer'){
      res.status(401).send('Authorization Not Bearer')
      return
    }

    if (!nooauth) { // With oauth.
      const key = await fetchKeyFromOpenIDServer(jwks_uri, access_token)
      // Validate the payload
      try{
        const payload = jwt.verify(access_token, key)
        req.user = payload
        next()
      }catch(err){
        res.status(401).send('Invalid Access Token')
      }
    } else { // No oauth.
      const usr = await db.users.getByEmail(req.query.email)

      if (usr.access_token === access_token) {
        // req.user = usr
        next()
      } else {
        res.status(401).send('Invalid Access Token -- no-oauth')
      }

      // const token = await db.user.getToken()
    }
  }
}
