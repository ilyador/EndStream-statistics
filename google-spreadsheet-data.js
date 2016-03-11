"use strict";

var Promise = require('bluebird')
var _ = require('lodash')
var creds = require('./creds.json')
var GoogleSpreadsheet = require('google-spreadsheet')
var agentsSheet = new GoogleSpreadsheet('1m1nZ8qNmFOJhRNfuH7jT_uRfXZtZtv9OP5iGdUI-wls')
const priceCols = [3,6,8,10]

Promise.promisifyAll(agentsSheet)



_.mixin({
  'sortKeysBy': (obj, comparator) => {
    var keys = _.sortBy(_.keys(obj), key => comparator ? comparator(obj[key], key) : key)
    return _.zipObject(keys, _.map(keys, (key) => obj[key]))
  }
})



module.exports = () => {
  return agentsSheet.useServiceAccountAuthAsync(creds).then( () => {

    var dataPromises = priceCols.map( col =>
      agentsSheet.getCellsAsync(1, {
        'min-row': 2,
        'max-row': 30,
        'min-col': col,
        'max-col': col,
        'return-empty': false
      })
    )

    return Promise.all(dataPromises).then( data => {
      var priceOptions = {}
      var priceOptions1 = []

      _.forEach( _.flattenDeep(data), item => {
        priceOptions[item.value] = (priceOptions[item.value] + 1) || 1
        priceOptions1.push(item.value)
      })

      //return _.sortKeysBy(priceOptions, value => -value)
      return _.uniq(priceOptions1)
    })
  })
}
