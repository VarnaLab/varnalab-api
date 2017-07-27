
module.exports = (jwt) => (req, res, next) => {
  var error = new Error()
  error.code = 401

  var header = req.headers.authorization || req.headers.Authorization

  if (!header) {
    error.message = 'Missing Authorization Header'
    next(error)
    return
  }

  var token = header.replace('Bearer ', '')

  try {
    var valid = jwt.verify(token)
  }
  catch (err) {
    error.message = err.message
    next(error)
    return
  }

  if (!valid) {
    error.message = 'Invalid Authorization Header'
    next(error)
    return
  }

  var payload = jwt.decode(token).payload

  if (!payload.sub.admin) {
    error.message = 'Not an Admin'
    next(error)
    return
  }

  var now = Math.floor(new Date().getTime() / 1000)

  if (payload.exp <= now) {
    error.message = 'Authorization Expired'
    next(error)
    return
  }

  res.locals.admin = payload.sub
  next()
}
