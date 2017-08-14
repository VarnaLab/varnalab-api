
module.exports = () => {

  var attachment = {
    error: (message) => ({
      fallback: 'VarnaLab Command',
      color: 'danger',
      pretext: '> ' + message,
      mrkdwn_in: ['pretext']
    }),

    known: (users) => ({
      fallback: 'VarnaLab Command',
      text: users
        .reduce((text, user) => (
          text +=
            (
              user.slack
              ? '<https://varnalab.slack.com/team/' +
                user.slack + '|@' + user.slack + '> '
              : ''
            ) +
            '_' + user.name + '_\n',
          text
        ), ''),
      mrkdwn_in: ['text']
    }),

    unknown: (devices) => ({
      fallback: 'VarnaLab Command',
      text: devices
        .reduce((text, device) => (
          text += '_' + device.host + '_' +
          (device.vendor ? ' - _' + device.vendor + '_' : '') + '\n',
          text
        ), ''),
      mrkdwn_in: ['text']
    }),

    event: (event) => ({
      fallback: 'VarnaLab Command',
      title: event.name,
      title_link: 'https://www.facebook.com/events/' + event.id,
      text: event.description,
      image_url: event.photo,
      footer: new Date(event.start_time).toLocaleString(),
      mrkdwn_in: ['text']
    })
  }

  return {attachment}
}
