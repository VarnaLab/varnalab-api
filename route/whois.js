
var express = require('express')


module.exports = (db, admin) => {
  var api = express()

  api.get('/known', (req, res) => {
    res.json(db.state.known
      .map(
        ({id, name, gravatar, backer, github, twitter}) =>
        ({id, name, gravatar, backer, github, twitter})
      )
    )
  })

  api.get('/online', (req, res) => {
    res.json(db.state.online)
  })

  api.use(admin)

  api.post('/known', (req, res, next) => {
    next(new Error('Not Implemented'))
  })

  api.patch('/known/:id', (req, res, next) => {
    next(new Error('Not Implemented'))
  })

  return api
}
