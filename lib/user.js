
var uuid = require('uuid')
var gravatar = require('gravatar-url')


module.exports = (db) => {

  var create = (user) => {
    var id = uuid()
    var email = user.email || (user.name.replace(' ', '') + '@gmail.com')
    var hash = gravatar(email).replace('https://gravatar.com/avatar/', '')

    var add = Object.assign({}, user, {id, gravatar: hash})

    db.state.users.push(add)
    db.write('users')

    return {add}
  }

  var update = (user) => {
    var index = db.state.users.findIndex((u) => u.id === user.id)

    var update = db.state.users[index]
    var change = Object.assign({}, update, user)

    db.state.users[index] = change
    db.write('users')

    return {update, change}
  }

  var remove = (user) => {
    var index = db.state.users.findIndex((u) => u.id === user.id)

    var remove = db.state.users[index]

    db.state.users.splice(index, 1)
    db.write('users')

    return {remove}
  }

  return {create, update, remove}
}
