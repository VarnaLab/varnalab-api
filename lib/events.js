
module.exports = (db) => {

  var upcoming = () => {
    var now = new Date().getTime()
    var upcoming = []

    for (var event of db.state.events) {
      var start = new Date(event.start_time).getTime()
      if (start >= now) {
        upcoming.push(event)
      }
      else {
        break
      }
    }

    return upcoming
  }

  return {upcoming}
}
