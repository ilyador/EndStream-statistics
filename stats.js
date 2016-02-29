// setup
var _ = require('lodash');
var Promise = require("bluebird");
var google_spreadsheet = require("google-spreadsheet");
var agents_sheet = new google_spreadsheet('1m1nZ8qNmFOJhRNfuH7jT_uRfXZtZtv9OP5iGdUI-wls');
var creds = require('./creds.json');

// data
const price_cols = [3,6,8,10]
const turnpoint_deck = {
  'm': 15,
  's': 15,
  'p': 15
}

// shuffle & shift n cards for each player, shuffle agenda
// see if a certain price is payable

Promise.promisifyAll(agents_sheet)

agents_sheet.useServiceAccountAuthAsync(creds).then(function(){

  var data_promises = price_cols.map(function (col) {
    return agents_sheet.getCellsAsync(1, {
      'min-row': 2,
      'max-row': 30,
      'min-col': col,
      'max-col': col,
      'return-empty': false
    })
  })

  Promise.all(data_promises).then(function (data) {
    var rawData = _.flattenDeep(data)
    var price_options = {}

    _.forEach(rawData, function (item) {
      var price = item.value

      if (price_options.hasOwnProperty(price)){
        price_options[price] += 1
      } else {
        price_options[price] = 1
      }
    })

    var price_options_sorted = _.sortKeysBy(price_options, function (value, key) {
      return value;
    });

    console.log(price_options_sorted);
  })
})


_.mixin({
  'sortKeysBy': function (obj, comparator) {
    var keys = _.sortBy(_.keys(obj), function (key) {
      return comparator ? comparator(obj[key], key) : key;
    })

    return _.zipObject(keys, _.map(keys, function (key) {
      return obj[key];
    }))
  }
})
