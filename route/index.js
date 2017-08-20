
var express = require('express')
var parser = require('body-parser')

var route = {
  auth: require('./auth'),
  whois: require('./whois'),
  finance: require('./finance'),
  events: require('./events'),
  slack: require('./slack'),
}

var lib = {
  db: require('../lib/db'),
  jwt: require('../lib/jwt'),
  log: require('../lib/log'),
  user: require('../lib/user'),
}

var mw = {
  admin: require('../mw/admin'),
  error: require('../mw/error'),
}


module.exports = (config) => {
  var log = config.log || lib.log('varnalab')

  var db = lib.db(config.db, log)
  var jwt = lib.jwt(config.auth)
  var user = lib.user(db)

  var admin = mw.admin(jwt)
  var error = mw.error(config)

  var api = express()
  api.use(parser.json())

  api.use('/auth', route.auth(jwt, config.github, config.auth.callback))

  api.use('/whois', route.whois(db, admin, user, log))
  api.use('/finance', route.finance(db))
  api.use('/events', route.events(db))
  api.use('/slack', route.slack(db, config.slack.token))

  api.use(error)

  return api
}
