
var t = require('assert')
var path = require('path')
var request = require('@request/client')
var express = require('express')
var api = require('../')


var port = 3000
var origin = 'http://localhost:' + port

var config = {
  db: {
    known: [{
      id: 1, name: 'simo', gravatar: 'hey', backer: 'sure',
      github: 'empty', twitter: 'yus',
      email: 'hq@varnalab.org', mac: ['mac1', 'mac2']
    }],
    finance: {},
    stats: [],
    online: {known: [], unknown: []},
  },
  auth: {
    public: path.resolve(__dirname, 'cert/public.pem'),
    private: path.resolve(__dirname, 'cert/private.pem'),
  },
  github: {
    config: {github: {}},
  },
  slack: {},
  log: () => {}
}


describe('whois', () => {
  var server

  before((done) => {
    var app = express()
    app.use(api(config))
    server = app.listen(port, done)
  })

  it('GET /whois/known', (done) => {
    request({
      method: 'GET',
      url: origin + '/whois/known',
      parse: {json: true},
      callback: (err, res, body) => {
        t.deepEqual(body, config.db.known
          .map(
            ({id, name, gravatar, backer, github, twitter}) =>
            ({id, name, gravatar, backer, github, twitter})
          ))
        done()
      }
    })
  })

  it('GET /whois/online', (done) => {
    request({
      method: 'GET',
      url: origin + '/whois/online',
      parse: {json: true},
      callback: (err, res, body) => {
        t.deepEqual(body, config.db.online)
        done()
      }
    })
  })

  after((done) => {
    server.close(done)
  })
})
