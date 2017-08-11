
var express = require('express')
var parser = require('body-parser')

var route = {
  auth: require('./auth'),
  whois: require('./whois'),
  finance: require('./finance'),
  events: require('./events'),
}

var lib = {
  db: require('../lib/db'),
  jwt: require('../lib/jwt'),
}

var mw = {
  admin: require('../mw/admin'),
  error: require('../mw/error'),
}


module.exports = (config) => {
  var db = lib.db(config.db, config.log)
  var jwt = lib.jwt(config.auth)

  var admin = mw.admin(jwt)
  var error = mw.error(config)

  var api = express()
  api.use(parser.json())

  api.use('/auth', route.auth(jwt, config.github, config.auth.callback))

  api.use('/whois', route.whois(db, admin))
  api.use('/finance', route.finance(db))
  api.use('/events', route.events(db))

  api.use(error)

  return api
}
