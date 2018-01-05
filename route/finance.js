
var express = require('express')


module.exports = (db) => {
  var api = express()

  api.get('/', (req, res) => {
    res.json(db.state.finance)
  })

  api.get('/stats', (req, res) => {
    res.json(db.state.stats)
  })

  api.get('/stats/backers', (req, res) => {
    res.json(db.state.stats[0])
  })

  api.get('/invbg/cachebox', (req, res) => {
    res.json(db.state.invbg)
  })

  return api
}
