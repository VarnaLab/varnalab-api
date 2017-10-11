
var express = require('express')
var Slack = require('../lib/slack')
var Events = require('../lib/events')


module.exports = (db, token) => {
  var slack = Slack()
  var events = Events(db)
  var api = express()

  api.use((req, res, next) => {
    if (req.body.token !== token) {
      res.json({attachments: [
        slack.attachment.error('Invalid Token')
      ]})
    }
    else {
      next()
    }
  })

  api.post('/whois', (req, res) => {
    res.json({attachments: slack.attachment.whois({
      known: (db.state.online.known || [])
        .map((id) => db.state.users.find((user) => user.id === id)),
      unknown: db.state.online.unknown,
      error: db.state.online.error,
    })})
  })

  api.post('/events', (req, res) => {
    res.json({attachments:
      events.upcoming()
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
        .map((event) => slack.attachment.event(event))
    })
  })

  return api
}
