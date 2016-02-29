// setup
var _ = require('lodash')
var Promise = require('bluebird')
var math = require('mathjs')
var GoogleSpreadsheet = require('google-spreadsheet')
var agentsSheet = new GoogleSpreadsheet('1m1nZ8qNmFOJhRNfuH7jT_uRfXZtZtv9OP5iGdUI-wls')
var creds = require('./creds.json')

// data
const priceCols = [3,6,8,10]
const turnpointDeck = {
  'm': 15,
  's': 15,
  'p': 15
}

// shuffle & shift n cards for each player, shuffle agenda
// see if a certain price is payable

Promise.promisifyAll(agentsSheet)

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

    console.log(priceOptionsSorted)
  })
})


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
