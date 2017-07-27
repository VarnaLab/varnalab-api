
var t = require('assert')
var fs = require('fs')
var path = require('path')
var express = require('express')
var session = require('express-session')
var grant = require('grant').express()
var request = require('@request/client')
var qs = require('qs')
var api = require('../')
var JWT = api.lib.jwt


var port = 3000
var origin = 'http://localhost:' + port

var config = {
  grant: {
    github: {
      protocol: 'http',
      host: 'localhost:3000',
      transport: 'session',
      authorize_url: '/grant/authorize',
      access_url: origin + '/grant/access',
      callback: '/auth/login/callback',
      oauth: 2,
    }
  },
  api: {
    db: {},
    auth: {
      public: fs.readFileSync(
        path.resolve(__dirname, 'cert/public.pem'), 'utf8'),
      private: fs.readFileSync(
        path.resolve(__dirname, 'cert/private.pem'), 'utf8'),
    },
    github: {
      connect: '/connect/github',
      team: 2,
      config: {
        github: {
          [origin]: {
            'github/{endpoint}': {
              __path: {
                alias: '__default',
                auth: {auth: {bearer: '[0]'}}
              }
            }
          }
        }
      },
    }
  },
  request: {
    method: 'GET',
    url: origin + '/auth/login',
    cookie: true,
    redirect: true,
    parse: {json: true},
  },
}

var fixtures = {
  oauth: {
    code: 'hi',
    access_token: 'hey',
  },
  github: {
    teams: [{id: 1}, {id: 2}],
    user: {id: 1, login: 'simov', name: 'simo'},
  },
  jwt: {
    user: {id: 1, login: 'simov', admin: false},
    admin: {id: 1, login: 'simov', admin: true},
  }
}


describe('auth', () => {
  var server
  var jwt = JWT(config.api.auth)

  before((done) => {
    var app = express()

    app.use(session({
      name: 'grant',
      secret: 'very secret',
      saveUninitialized: false,
      resave: false,
    }))
    app.use(grant(config.grant))
    app.use(api(config.api))

    app.use('/grant/authorize', (req, res) => {
      res.redirect('/connect/github/callback?' +
        qs.stringify({
          code: fixtures.oauth.code
        })
      )
    })
    app.use('/grant/access', (req, res) => {
      res.end(qs.stringify({
        access_token: fixtures.oauth.access_token
      }))
    })

    app.use('/github/user/teams', (req, res) => {
      t.equal(req.headers.authorization, 'Bearer hey')
      t.equal(req.headers['user-agent'], 'VarnaLab App')
      res.json(fixtures.github.teams)
    })

    app.use('/github/user', (req, res) => {
      t.equal(req.headers.authorization, 'Bearer hey')
      t.equal(req.headers['user-agent'], 'VarnaLab App')
      res.json(fixtures.github.user)
    })

    server = app.listen(port, done)
  })

  it('GET /auth/login', (done) => {
    fixtures.github.teams = [{id: 1}]
    request(Object.assign({}, config.request, {
      callback: (err, res, body) => {
        var token = jwt.decode(body.jwt)
        t.deepEqual(token.payload.sub, fixtures.jwt.user)
        done()
      }
    }))
  })

  it('GET /auth/login - admin', (done) => {
    fixtures.github.teams = [{id: 1}, {id: 2}]
    request(Object.assign({}, config.request, {
      callback: (err, res, body) => {
        var token = jwt.decode(body.jwt)
        t.deepEqual(token.payload.sub, fixtures.jwt.admin)
        done()
      }
    }))
  })

  it('GET /auth/login - error', (done) => {
    fixtures.github.teams = null
    request(Object.assign({}, config.request, {
      callback: (err, res, body) => {
        t.equal(res.statusCode, 500)
        t.equal(res.statusMessage, 'Internal Server Error')
        t.deepEqual(body, {error: 'Cannot read property \'some\' of null'})
        done()
      }
    }))
  })

  after((done) => {
    server.close(done)
  })
})
