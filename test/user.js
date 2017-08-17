
var t = require('assert')
var fs = require('fs')
var path = require('path')
var api = require('../')


var port = 3000
var origin = 'http://localhost:' + port

var config = {
  db: {
    known: path.resolve(__dirname, './fixtures/known.json'),
    finance: {},
    stats: [],
    online: {},
  },
  log: () => {}
}

describe('user', () => {
  var id
  var db = api.lib.db(config.db, config.log)
  var user = api.lib.user(db)

  it('create', (done) => {
    var {add} = user.create({name: 'simo'})
    t.equal(Object.keys(add).length, 3)
    t.ok(/[^-]{8}-[^-]{4}-[^-]{4}-[^-]{4}-[^-]{12}/.test(add.id))
    t.equal(add.name, 'simo')
    t.equal(add.gravatar, '9ae7c2641396f254519ccdfdd36b7e47')
    id = add.id

    setTimeout(() => {
      t.equal(db.state.known[1].name, 'simo')
      t.equal(db.state.known[1].gravatar, '9ae7c2641396f254519ccdfdd36b7e47')
      t.equal(JSON.parse(fs.readFileSync(config.db.known, 'utf8'))[1].name, 'simo')
      done()
    }, 50)
  })

  it('update', (done) => {
    var {update, change} = user.update({id, name: 'simov'})
    t.equal(update.name, 'simo')
    t.equal(change.name, 'simov')

    setTimeout(() => {
      t.equal(db.state.known[1].name, 'simov')
      t.equal(JSON.parse(fs.readFileSync(config.db.known, 'utf8'))[1].name, 'simov')
      done()
    }, 50)
  })

  it('remove', (done) => {
    var {remove} = user.remove({id})
    t.equal(remove.name, 'simov')

    setTimeout(() => {
      t.equal(db.state.known.length, 1)
      t.equal(JSON.parse(fs.readFileSync(config.db.known, 'utf8')).length, 1)
      done()
    }, 50)
  })
})
