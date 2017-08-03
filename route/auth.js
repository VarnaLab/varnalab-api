
var qs = require('qs')
var express = require('express')
var GitHub = require('../lib/github')


module.exports = (jwt, gh, callback) => {
  var api = express()
  var github = GitHub(gh.config)

  api.get('/login', (req, res) => {
    res.redirect(gh.connect)
  })

  api.get('/login/callback', (req, res, next) => {
    var token = req.session.grant.response.access_token

    Promise.all([
      github.user(token),
      github.admin(token, gh.team),
    ])
    .then(([user, admin]) => {
      var payload = Object.assign(user, {admin})
      var data = Object.assign({}, payload, {jwt: jwt.sign(payload)})
      callback
        ? res.redirect(callback + '?' + qs.stringify(data))
        : res.json(data)
    })
    .catch((err) => next(err))
  })

  return api
}
