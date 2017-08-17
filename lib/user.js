
var uuid = require('uuid')
var gravatar = require('gravatar-url')


module.exports = (db) => {

  var create = (user) => {
    var id = uuid()
    var email = user.email || (user.name.replace(' ', '') + '@gmail.com')
    var hash = gravatar(email).replace('https://gravatar.com/avatar/', '')

    var add = Object.assign({}, user, {id, gravatar: hash})

    db.state.known.push(add)
    db.write('known')

    return {add}
  }

  var update = (user) => {
    var index = db.state.known.findIndex((u) => u.id === user.id)

    var update = db.state.known[index]
    var change = Object.assign({}, update, user)

    db.state.known[index] = change
    db.write('known')

    return {update, change}
  }

  var remove = (user) => {
    var index = db.state.known.findIndex((u) => u.id === user.id)

    var remove = db.state.known[index]

    db.state.known.splice(index, 1)
    db.write('known')

    return {remove}
  }

  return {create, update, remove}
}
