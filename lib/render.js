
var render = require('mithril-node-render')
// var html = require('html')

var m = (() => {
  // https://github.com/lhorie/mithril.js/issues/1279#issuecomment-278561782

  var m

  // Polyfill DOM env for mithril
  global.window = require('mithril/test-utils/browserMock.js')()
  global.document = window.document

  // Require the lib AFTER THE POLYFILL IS UP
  m = require('mithril')

  // Make available globally for client scripts running on the server
  global.m = m

  // Export for normal server usage
  return m
})()


var utils = {
  url: ({scheme, host, uri}, path) =>
    scheme + '://' + host + uri.replace(/\/$/, '') + path,

  description: (string) => string
    .replace(/<(?:.|\n)*?>/gm, '')
    .replace(/&(nbsp|amp|quot|lt|gt);/gm, '')
    .replace(/\n/gm, '')
    // .slice(0, 150) + '...'
}

var defaults = [
  {"charset": "utf-8"},
  {
    "name": "viewport",
    "content": "width=device-width, initial-scale=1"
  },
  {"name": "theme-color", "content": "#000"},
  {"name": "author", "content": "Simeon Velichkov"},
  {"name": "copyright", "content": "VarnaLab"},
  {"name": "robots", "content": "follow,index"},
  {"name": "title", "content": "VarnaLab"},
  {
    "name": "keywords",
    "content": "varnalab, hackerspace, varna, bulgaria",
    "lang": "en-us"
  },
  {"name": "description", "content": "VarnaLab"},
]

var meta = {
  event: (event) => [
    {property: 'og:title', content: event.name},
    {property: 'og:description', content: utils.description(event.description)},
    {property: 'og:image', content: event.photo},
    {property: 'og:image:alt', content: 'Event Cover'},
    {property: 'og:url', content: 'https://www.facebook.com/events/' + event.id},
    {property: 'og:site_name', content: 'VarnaLab'},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: event.photo},
    {name: 'twitter:image:alt', content: 'VarnaLab'},
  ],
  defaults: (args) => [
    {property: 'og:title', content: 'VarnaLab'},
    {property: 'og:description', content: 'VarnaLab Hackerspace'},
    {property: 'og:image', content: utils.url(args, '/assets/images/logo-512.png')},
    {property: 'og:image:alt', content: 'VarnaLab Logo'},
    {property: 'og:url', content: utils.url(args, '/')},
    {property: 'og:site_name', content: 'VarnaLab'},
    {property: 'og:type', content: 'website'},
    {name: 'twitter:card', content: utils.url(args, '/assets/images/logo-512.png')},
    {name: 'twitter:image:alt', content: 'VarnaLab'},
  ]
}


module.exports = () => {

  var template = (meta) =>
    m('html',
      m('head',
        meta.map((attrs) =>
          m('meta', attrs)
        ),

        m('title', 'VarnaLab'),

        // TODO: needs the /varnalab/app prefix passed as querystring!
        // m('link', {rel: 'shortcut icon', href: static.favicon}),
        // m('link', {rel: 'manifest', href: static.manifest}),
      ),
      m('body'),
    )

  var html = (meta = []) =>
    render({
      view: () => template(defaults.concat(meta))
    })
    .then((rendered) =>
      // `html` dep
      // html.prettyPrint(
        '<!DOCTYPE html>\n' + rendered,
        // {indent_size: 2}
      // )
    )

  return {html, meta}
}
