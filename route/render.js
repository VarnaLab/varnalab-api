
var express = require('express')
var Render = require('../lib/render')


var meta = (db) => {
  var render = Render()
  var api = express()

  api.get('/event/:id/', (req, res) => {
    var event = db.state.events.find((event) => event.id === req.params.id)
    var meta = render.meta.event(event)

    res.set('content-type', 'text/html')
    render.html(meta)
      .then((html) => res.end(html))
  })

  api.use((req, res) => {
    var meta = render.meta.defaults(req.query)

    res.set('content-type', 'text/html')
    render.html(meta)
      .then((html) => res.end(html))
  })

  return api
}


module.exports = (db) => {
  var api = express()

  api.use('/meta', meta(db))

  return api
}
