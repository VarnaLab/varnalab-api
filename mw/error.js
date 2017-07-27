
var express = require('express')
var Log = require('../lib/log')


module.exports = (config) => {
  var log = config.log || Log('varnalab')

  return (err, req, res, next) => {
    var code = err.code || 500
    log(err)
    res.status(code).json({error: err.message})
  }
}
