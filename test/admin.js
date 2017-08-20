
var t = require('assert')
var path = require('path')
var request = require('@request/client')
var express = require('express')
var api = require('../')


var port = 3000
var origin = 'http://localhost:' + port

var keys = {
  valid: {
    public: path.resolve(__dirname, 'cert/public.pem'),
    private: path.resolve(__dirname, 'cert/private.pem'),
  },
  tampered: {
    public: path.resolve(__dirname, 'cert/public-tampered.pem'),
    private: path.resolve(__dirname, 'cert/private-tampered.pem'),
  },
}

var config = {
  api: {
    db: {
      users: path.resolve(__dirname, './fixtures/users.json'),
    },
    auth: keys.valid,
    github: {
      config: {github: {}},
    },
    slack: {},
    log: () => {}
  },
}


describe('admin', () => {
  var server

  before((done) => {
    var app = express()
    app.use(api(config.api))
    server = app.listen(port, done)
  })

  it('Missing Authorization Header', (done) => {
    request({
      method: 'POST',
      url: origin + '/whois/known',
      parse: {json: true},
      callback: (err, res, body) => {
        t.equal(res.statusCode, 401)
        t.equal(res.statusMessage, 'Unauthorized')
        t.deepEqual(body, {error: 'Missing Authorization Header'})
        done()
      }
    })
  })

  it('Invalid Authorization Header - jws throws', (done) => {
    request({
      method: 'POST',
      url: origin + '/whois/known',
      headers: {authorization: 'hey'},
      parse: {json: true},
      callback: (err, res, body) => {
        t.equal(res.statusCode, 401)
        t.equal(res.statusMessage, 'Unauthorized')
        t.deepEqual(body, {error: 'Cannot read property \'toString\' of undefined'})
        done()
      }
    })
  })

  it('Invalid Authorization Header - tampered token', (done) => {
    var jwt = api.lib.jwt(keys.tampered)
    var token = jwt.sign({id: 1, login: 'pencho', admin: true})
    request({
      method: 'POST',
      url: origin + '/whois/known',
      headers: {authorization: 'Bearer ' + token},
      parse: {json: true},
      callback: (err, res, body) => {
        t.equal(res.statusCode, 401)
        t.equal(res.statusMessage, 'Unauthorized')
        t.deepEqual(body, {error: 'Invalid Authorization Header'})
        done()
      }
    })
  })

  it('Not an Admin', (done) => {
    var jwt = api.lib.jwt(keys.valid)
    var token = jwt.sign({id: 1, login: 'simov', admin: false})
    request({
      method: 'POST',
      url: origin + '/whois/known',
      headers: {authorization: 'Bearer ' + token},
      parse: {json: true},
      callback: (err, res, body) => {
        t.equal(res.statusCode, 401)
        t.equal(res.statusMessage, 'Unauthorized')
        t.deepEqual(body, {error: 'Not an Admin'})
        done()
      }
    })
  })

  it('Authorization Expired', (done) => {
    var jwt = api.lib.jwt(keys.valid)
    var token = jwt.sign({id: 1, login: 'simov', admin: true}, -50)
    request({
      method: 'POST',
      url: origin + '/whois/known',
      headers: {authorization: 'Bearer ' + token},
      parse: {json: true},
      callback: (err, res, body) => {
        t.equal(res.statusCode, 401)
        t.equal(res.statusMessage, 'Unauthorized')
        t.deepEqual(body, {error: 'Authorization Expired'})
        done()
      }
    })
  })

  describe('update', () => {
    var id
    it('POST /whois/known', (done) => {
      var jwt = api.lib.jwt(keys.valid)
      var token = jwt.sign({id: 1, login: 'simov', admin: true})
      request({
        method: 'POST',
        url: origin + '/whois/known',
        headers: {authorization: 'Bearer ' + token},
        json: {user: {id: 1, name: 'simo'}},
        parse: {json: true},
        callback: (err, res, body) => {
          id = body.id
          request({
            method: 'GET',
            url: origin + '/whois/known',
            parse: {json: true},
            callback: (err, res, users) => {
              t.equal(users.length, 2)
              t.equal(users[1].name, 'simo')
              done()
            }
          })
        }
      })
    })

    it('PATCH /whois/known', (done) => {
      var jwt = api.lib.jwt(keys.valid)
      var token = jwt.sign({id: 1, login: 'simov', admin: true})
      request({
        method: 'PATCH',
        url: origin + '/whois/known',
        headers: {authorization: 'Bearer ' + token},
        json: {user: {id, name: 'simov'}},
        parse: {json: true},
        callback: (err, res, body) => {
          id = body.id
          request({
            method: 'GET',
            url: origin + '/whois/known',
            parse: {json: true},
            callback: (err, res, users) => {
              t.equal(users.length, 2)
              t.equal(users[1].name, 'simov')
              done()
            }
          })
        }
      })
    })

    it('DELETE /whois/known', (done) => {
      var jwt = api.lib.jwt(keys.valid)
      var token = jwt.sign({id: 1, login: 'simov', admin: true})
      request({
        method: 'DELETE',
        url: origin + '/whois/known',
        headers: {authorization: 'Bearer ' + token},
        json: {user: {id}},
        parse: {json: true},
        callback: (err, res, body) => {
          id = body.id
          request({
            method: 'GET',
            url: origin + '/whois/known',
            parse: {json: true},
            callback: (err, res, users) => {
              t.equal(users.length, 1)
              done()
            }
          })
        }
      })
    })
  })

  after((done) => {
    server.close(done)
  })
})
