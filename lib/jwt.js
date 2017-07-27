
var jws = require('jws')


module.exports = (keys) => {

  var sign = (payload, expires) =>
    (
      (
        epoch =
          Math.floor(new Date().getTime() / 1000)
      ) =>
      jws.sign({
        header: {
          alg: 'RS256',
          typ: 'JWT'
        },
        payload: {
          // issuer
          iss: 'VarnaLab',
          // expiration (1 hour)
          exp: epoch + (typeof expires === 'number' ? expires : (3600 * 1)),
          // subject
          sub: payload,
          // audience
          aud: 'VarnaLab App',
          // issued at (epoch)
          iat: epoch
        },
        secret: keys.private
      })
    )()

  var verify = (signature) =>
    jws.verify(signature, 'RS256', keys.public)

  var decode = (signature) =>
    jws.decode(signature)

  return {sign, verify, decode}
}
