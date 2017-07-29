
var t = require('assert')
var path = require('path')
var request = require('@request/client')
var express = require('express')
var api = require('../')


var port = 3000
var origin = 'http://localhost:' + port

var config = {
  db: {
    known: [],
    finance: {income: 'hey', spend: 'wow'},
    stats: ['stat1', 'stat2'],
    online: {},
  },
  auth: {
    public: path.resolve(__dirname, 'cert/public.pem'),
    private: path.resolve(__dirname, 'cert/private.pem'),
  },
  github: {
    config: {github: {}},
  },
  log: () => {}
}


describe('finance', () => {
  var server

  before((done) => {
    var app = express()
    app.use(api(config))
    server = app.listen(port, done)
  })

  it('GET /finance', (done) => {
    request({
      method: 'GET',
      url: origin + '/finance',
      parse: {json: true},
      callback: (err, res, body) => {
        t.deepEqual(body, config.db.finance)
        done()
      }
    })
  })

  it('GET /finance/stats', (done) => {
    request({
      method: 'GET',
      url: origin + '/finance/stats',
      parse: {json: true},
      callback: (err, res, body) => {
        t.deepEqual(body, config.db.stats)
        done()
      }
    })
  })

  it('GET /finance/stats/backers', (done) => {
    request({
      method: 'GET',
      url: origin + '/finance/stats/backers',
      parse: {json: true},
      callback: (err, res, body) => {
        t.deepEqual(body, config.db.stats[0])
        done()
      }
    })
  })

  after((done) => {
    server.close(done)
  })
})
