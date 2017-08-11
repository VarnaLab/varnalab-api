
var express = require('express')


module.exports = (db) => {
  var api = express()

  api.get('/', (req, res) => {
    var offset = parseInt(req.query.offset || 0)
    var limit = parseInt(req.query.limit || 10)
    res.json(db.state.events.slice(offset, offset + limit))
  })

  return api
}
