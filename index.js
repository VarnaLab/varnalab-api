
var app = require('./route/')

app.lib = {
  db: require('./lib/db'),
  events: require('./lib/events'),
  github: require('./lib/github'),
  jwt: require('./lib/jwt'),
  log: require('./lib/log'),
  slack: require('./lib/slack'),
  user: require('./lib/user'),
}

app.mw = {
  admin: require('./mw/admin'),
  error: require('./mw/error'),
}

module.exports = app
