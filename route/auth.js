
var express = require('express')
var GitHub = require('../lib/github')


module.exports = (jwt, gh) => {
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
      res.json({jwt: jwt.sign(payload)})
    })
    .catch((err) => next(err))
  })

  return api
}
