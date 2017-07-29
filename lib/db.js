
var fs = require('fs')
var util = require('util')

var file = {
  read: util.promisify(fs.readFile),
  write: util.promisify(fs.writeFile),
}


module.exports = (config, log) => {

  var read = (source) =>
    file.read(config[source], 'utf8')
    .then((data) => JSON.parse(data))


  var write = (source, data) =>
    file.write(
      config[source],
      JSON.stringify(data || state[source], null, 2),
      'utf8')


  var watch = (source) =>
    fs.watch(config[source])
      .on('change', (event, fname) => {
        read(source)
          .then((data) => state[source] = data)
          .catch(log)
      })
      .on('error', log)


  var state =
    Object.keys(config)
      .reduce((state, source) => (
        state[source] =
          (typeof config[source] === 'string')
          ? (
              watch(source),
              JSON.parse(fs.readFileSync(config[source], 'utf8'))
            )
          : config[source],
        state
      ), {})


  return {state, read, write}
}
