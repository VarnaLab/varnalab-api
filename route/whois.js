
var express = require('express')


module.exports = (db, admin, user, log) => {
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
    var {add} = user.create(req.body.user)
    log({author: req.author, add})
    res.json({id: add.id})
  })

  api.patch('/known', (req, res, next) => {
    var {update, change} = user.update(req.body.user)
    log({author: req.author, update, change})
    res.json({id: change.id})
  })

  api.delete('/known', (req, res, next) => {
    var {remove} = user.remove(req.body.user)
    log({author: req.author, remove})
    res.json({id: remove.id})
  })

  return api
}
