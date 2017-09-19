
var express = require('express')
var parser = require('body-parser')

var route = {
  auth: require('./auth'),
  whois: require('./whois'),
  finance: require('./finance'),
  events: require('./events'),
  slack: require('./slack'),
  render: require('./render'),
  git: require('./git'),
}

var lib = {
  db: require('../lib/db'),
  jwt: require('../lib/jwt'),
  log: require('../lib/log'),
  user: require('../lib/user'),
  git: require('../lib/git'),
}

var mw = {
  admin: require('../mw/admin'),
  git: require('../mw/git'),
  error: require('../mw/error'),
}


module.exports = (config) => {
  var log = config.log || lib.log('varnalab')

  var db = lib.db(config.db, log)
  var jwt = lib.jwt(config.auth)
  var user = lib.user(db)

  var admin = mw.admin(jwt)
  var error = mw.error(config)
  var git = mw.git(config, lib.git())

  var api = express()
  api.use(parser.json())

  api.use('/auth', route.auth(jwt, config.github, config.auth.callback))

  api.use('/whois', route.whois(db, admin, user, log))
  api.use('/finance', route.finance(db))
  api.use('/events', route.events(db))
  api.use('/slack', route.slack(db, config.slack.token))
  api.use('/render', route.render(db))
  api.use('/git', route.git(config, git))

  api.use(error)

  return api
}
