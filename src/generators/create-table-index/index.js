var assert = require('@smallwins/validate/assert')
var parallel = require('run-parallel')
var index = require('./_create-index')

module.exports = function _createIndex(params, callback) {

  assert(params, {
    index: Object,
    app: String,
  })

  var name = Object.keys(params.index)[0]
  var attr = params.index[name]

  parallel([
    function _createStaging(callback) {
      index(`${params.app}-staging-${name}`, attr, callback)
    },
    function _createProduction(callback) {
      index(`${params.app}-production-${name}`, attr, callback)
    }
  ],
  function _done(err) {
    if (err) {
      console.log(err)
    }
    callback()
  })
}
