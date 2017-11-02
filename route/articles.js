
var express = require('express')


module.exports = (db) => {
  var api = express()

  api.get('/', (req, res) => {
    res.json(db.state.articles)
  })

  return api
}
