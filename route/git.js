
var cp = require('child_process')
var express = require('express')


module.exports = (config, git) => {
  var api = express()

  api.use(git)

  api.post('/pull', (req, res, next) => {
    var cmd = [
      'cd', config.git.repo, '&& git pull', config.git.remote, config.git.branch,
    ].join(' ')

    cp.exec(cmd, (err) => {
      if (err) {
        next(err.message)
        return
      }
      res.end('OK')
    })
  })

  return api
}
