
var t = require('assert')
var fs = require('fs')
var path = require('path')
var api = require('../')
var DB = api.lib.db

var fixtures = {
  users: path.join(__dirname, 'fixtures/users.json'),
  devices: path.join(__dirname, 'fixtures/devices.json'),
}


describe('db', () => {
  var db

  it('init', () => {
    db = DB(fixtures, () => {})
    t.deepEqual(db.state, {
      users: [{id: 0, name: 'known'}],
      devices: [{id: 0, name: 'unknown'}]
    })
  })

  it('read', (done) => {
    db.read('users')
      .then((users) => {
        t.deepEqual(users, [{id: 0, name: 'known'}])
        done()
      })
  })

  it('write', (done) => {
    db.write('users', [{id: 0, name: 'known1'}])
      .then((users) => {
        db.read('users')
          .then((users) => {
            t.deepEqual(users, [{id: 0, name: 'known1'}])
            done()
          })
      })
  })

  it('watch', (done) => {
    t.deepEqual(db.state.users, [{id: 0, name: 'known1'}])
    db.write('users', [{id: 0, name: 'known'}])
      .then((users) => {
        setTimeout(() => {
          t.deepEqual(db.state.users, [{id: 0, name: 'known'}])
          done()
        }, 50)
      })
  })

  after((done) => {
    db.write('users', [{id: 0, name: 'known'}])
      .then(done)
  })
})
