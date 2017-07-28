
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
    if (data instanceof Error) {
      log('error', data.message)
      console.error(data.stack)
    }
    else {
      log('log', data)
    }
    // data instanceof Error ? log('error', data.message) : log('log', data)
  }
}
