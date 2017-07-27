
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})


module.exports = (config) => {
  var github = purest({
    provider: 'github',
    config: config || require('@purest/providers'),
    defaults: {
      headers: {'user-agent': 'VarnaLab App'}
    }
  })

  var user = (token) =>
    github
      .get('user')
      .auth(token)
      .request()
      .then(([res, user]) => ({
        id: user.id,
        login: user.login
      }))

  // requires `read:org` OAuth Scope
  var admin = (token, id) =>
    github
      .get('user/teams')
      .auth(token)
      .request()
      .then(([res, teams]) =>
        teams
          .some((team) => team.id === id)
      )

  return {user, admin}
}
