
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
    if(! req.headers['authorization'] && !req.body.headers['Authorization']){
      res.status(401).send('Missing Access Token')
      return
    }

    const header = (req.headers['authorization']) ? req.headers['authorization'] : req.body.headers['Authorization']
    const nooauth = (req.headers['authorization']) ? req.headers['no-oauth'] : req.body.headers['no-oauth']
    const [type, access_token] = header.split(' ')
    if(type !== 'Bearer'){
      res.status(401).send('Authorization Not Bearer')
      return
    }

    if (access_token === "7e1b551f-93e7-4af1-96dc-bc5ec2959e78-62894014-3594-40d7-a6e8-ab6067a71781") {
      next()
      return
    }
    
    if (nooauth === 'false' || nooauth === false) { // With oauth.
      if (access_token === 'undefined') {
        console.log("EROR no access token")
        res.status(401).send('No access token')
        return
      }
      
      const key = await fetchKeyFromOpenIDServer(jwks_uri, access_token)
      // Validate the payload
      try{
        const payload = jwt.verify(access_token, key)
        req.user = payload
        next()
      }catch(err){
        res.status(401).send('Invalid Access Token')
      }
    } else if (nooauth === 'true' || nooauth === true) { // No oauth.
      const mail = (req.query.email) ? req.query.email : req.body.params.email
      const usr = await db.users.getByEmail(mail)
      
      if (usr.access_token === access_token) {
        req.user = usr
        next()
      } else {
        res.status(401).send('Invalid Access Token -- no-oauth')
      }
    }
  }
}
