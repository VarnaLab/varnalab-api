#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log('--config /path/to/config.json')
  console.log('--port number')
  console.log('--env environment')
  process.exit()
}

if (!argv.config) {
  console.log('Specify --config /path/to/config.json')
  process.exit()
}

if (!argv.port) {
  console.log('Specify --port number')
  process.exit()
}

var env = process.env.NODE_ENV || argv.env || 'development'

var fs = require('fs')
var path = require('path')
var express = require('express')

var config = require(path.resolve(process.cwd(), argv.config))[env]

var server = express()
var api = require('../')

server.use(api(config))
server.listen(argv.port, () => console.log('VarnaLab API', argv.port, '!'))
