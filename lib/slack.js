
module.exports = () => {

  var attachment = {
    error: (message) => ({
      fallback: 'VarnaLab Command',
      color: 'danger',
      pretext: '> ' + message,
      mrkdwn_in: ['pretext']
    }),

    whois: ({known, unknown, error}) =>
      error ?
      [
        {
          fallback: 'VarnaLab Whois Command',
          text: '_Услугата временно не е налична_',
          mrkdwn_in: ['text']
        }
      ]
      : !known.length && !unknown.length ?
      [
        {
          fallback: 'VarnaLab Whois Command',
          text: '_Няма никой_',
          mrkdwn_in: ['text']
        }
      ]
      :
      [
        {
          fallback: 'VarnaLab Whois Command',
          text: known.reduce((text, user) => text +=
            (
              user.slack
              ? '<https://varnalab.slack.com/team/' +
                user.slack + '|@' + user.slack + '> '
              : ''
            ) +
            '_' + user.name + '_\n'
          , ''),
          mrkdwn_in: ['text']
        },
        {
          fallback: 'VarnaLab Whois Command',
          text: unknown.reduce((text, device) => text +=
            '_' + device.host + '_' +
            (device.vendor ? ' - _' + device.vendor + '_' : '') + '\n'
          , ''),
          mrkdwn_in: ['text']
        }
      ],

    event: (event) => ({
      fallback: 'VarnaLab Events Command',
      color: '#3D3C40',
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
