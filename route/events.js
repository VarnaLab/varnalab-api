
var express = require('express')


module.exports = (db) => {
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
    var now = new Date().getTime()
    var upcoming = []

    for (var event of db.state.events) {
      var start = new Date(event.start_time).getTime()
      if (start >= now) {
        upcoming.push(event)
      }
      else {
        break
      }
    }

    res.json(upcoming)
  })

  return api
}
