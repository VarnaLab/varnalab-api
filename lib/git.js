
var crypto = require('crypto')


module.exports = () => {

  var verify = (signature, payload, secret) =>
    crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from('sha1=' +
        crypto.createHmac('sha1', secret).update(payload).digest('hex')
      )
    )

  return {verify}
}
