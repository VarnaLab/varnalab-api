
module.exports = (service) => {

  var log = (type, data) => {
    console[type](JSON.stringify({
      service,
      timestamp: new Date().getTime(),
      date: new Date().toString(),
      data
    }))
  }

  return (data) => {
    data instanceof Error ? log('error', data.message) : log('log', data)
  }
}
