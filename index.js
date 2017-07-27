
var app = require('./route/')

app.lib = {
  db: require('./lib/db'),
  github: require('./lib/github'),
  jwt: require('./lib/jwt'),
  // known: require('./lib/known'),
  log: require('./lib/log'),
}

app.mw = {
  admin: require('./mw/admin'),
  error: require('./mw/error'),
}

module.exports = app
