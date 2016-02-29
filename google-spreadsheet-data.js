var Promise = require('bluebird')
var _ = require('lodash')
var creds = require('./creds.json')
var GoogleSpreadsheet = require('google-spreadsheet')
var agentsSheet = new GoogleSpreadsheet('1m1nZ8qNmFOJhRNfuH7jT_uRfXZtZtv9OP5iGdUI-wls')
const priceCols = [3,6,8,10]

Promise.promisifyAll(agentsSheet)


_.mixin({
  'sortKeysBy': function (obj, comparator) {
    var keys = _.sortBy(_.keys(obj), function (key) {
      return comparator ? comparator(obj[key], key) : key
    })

    return _.zipObject(keys, _.map(keys, function (key) {
      return obj[key]
    }))
  }
})


agentsSheet.useServiceAccountAuthAsync(creds).then(function(){

  var data_promises = priceCols.map(function (col) {
    return agentsSheet.getCellsAsync(1, {
      'min-row': 2,
      'max-row': 30,
      'min-col': col,
      'max-col': col,
      'return-empty': false
    })
  })

  Promise.all(data_promises).then(function (data) {
    var rawData = _.flattenDeep(data)
    var priceOptions = {}

    _.forEach(rawData, function (item) {
      var price = item.value

      if (priceOptions.hasOwnProperty(price)){
        priceOptions[price] += 1
      } else {
        priceOptions[price] = 1
      }
    })

    var priceOptionsSorted = _.sortKeysBy(priceOptions, function (value, key) {
      return (- value)
    })
  })
})
