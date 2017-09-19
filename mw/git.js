
module.exports = (config, git) => (req, res, next) => {
  var error = new Error()
  error.code = 400

  var sig = req.headers['x-hub-signature']
  var event = req.headers['x-github-event']
  var id = req.headers['x-github-delivery']

  if (!sig) {
    error.message = 'No X-Hub-Signature found on request'
    next(error)
    return
  }

  if (!event) {
    error.message = 'No X-Github-Event found on request'
    next(error)
    return
  }

  if (!id) {
    error.message = 'No X-Github-Delivery found on request'
    next(error)
    return
  }

  if (event !== 'push') {
    error.message = 'X-Github-Event is not acceptable'
    next(error)
    return
  }

  if (!git.verify(sig, JSON.stringify(req.body), config.git.secret)) {
    error.message = 'X-Hub-Signature does not match blob signature'
    next(error)
    return
  }

  next()
}
