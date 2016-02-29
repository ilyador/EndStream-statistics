// setup
var _ = require('lodash');
var Promise = require("bluebird");
var google_spreadsheet = require("google-spreadsheet");
var agents_sheet = new google_spreadsheet('1m1nZ8qNmFOJhRNfuH7jT_uRfXZtZtv9OP5iGdUI-wls');
var creds = require('./creds.json');

// data
var price_cols = [3,6,8,10]
var price_options = {}
var turnpoint_deck = {
  'm': 15,
  's': 15,
  'p': 15
}

// shuffle & shift n cards for each player, shuffle agenda
// see if a certain price is payable

Promise.promisifyAll(agents_sheet)

agents_sheet.useServiceAccountAuth(creds, function(error){

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
    _.forEach(rawData, function (item) {
      var price = item.value

      if (price_options.hasOwnProperty(price)){
        price_options[price] += 1
      } else {
        price_options[price] = 1
      }
    })

    console.log(price_options);
  });
})

