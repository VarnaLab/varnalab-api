
var express = require('express')
var Events = require('../lib/events')


module.exports = (db) => {
  var events = Events(db)
  var api = express()

  api.get('/', (req, res) => {
    if (req.query.id) {
      var id = req.query.id
      res.json(db.state.events.find((event) => event.id === id))
    }
    else {
      var offset = parseInt(req.query.offset || 0)
      var limit = parseInt(req.query.limit || 10)
      res.json(db.state.events.slice(offset, offset + limit))
    }
  })

  api.get('/upcoming', (req, res) => {
    res.json(events.upcoming())
  })

  return api
}
