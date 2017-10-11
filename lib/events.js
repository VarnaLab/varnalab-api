
module.exports = (db) => {

  var upcoming = () => {
    var now = new Date().getTime()
    var upcoming = []

    for (var event of db.state.events) {
      var end = new Date(event.end_time || event.start_time).getTime()
      if (end >= now) {
        upcoming.push(event)
      }
      else {
        break
      }
    }

    return upcoming
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
  }

  return {upcoming}
}
