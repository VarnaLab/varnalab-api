
var t = require('assert')
var fs = require('fs')
var path = require('path')
var api = require('../')
var DB = api.lib.db

var fixtures = {
  known: path.join(__dirname, 'fixtures/known.json'),
  unknown: path.join(__dirname, 'fixtures/unknown.json'),
}


describe('db', () => {
  var db

  it('init', () => {
    db = DB(fixtures)
    t.deepEqual(db.state, {
      known: [{id: 0, name: 'known'}],
      unknown: [{id: 0, name: 'unknown'}]
    })
  })

  it('read', (done) => {
    db.read('known')
      .then((known) => {
        t.deepEqual(known, [{id: 0, name: 'known'}])
        done()
      })
  })

  it('write', (done) => {
    db.write('known', [{id: 0, name: 'known1'}])
      .then((known) => {
        db.read('known')
          .then((known) => {
            t.deepEqual(known, [{id: 0, name: 'known1'}])
            done()
          })
      })
  })

  after((done) => {
    db.write('known', [{id: 0, name: 'known'}])
      .then(done)
  })
})
