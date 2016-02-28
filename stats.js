var _ = require('lodash');
var google_spreadsheet = require("google-spreadsheet");
var agents_sheet = new google_spreadsheet('1m1nZ8qNmFOJhRNfuH7jT_uRfXZtZtv9OP5iGdUI-wls');
var creds = require('./creds.json');

var price_options = [
  '1x',
  '2x',
  '3x',
  '1h',
  '2h',
  '3h',
  '1f',
  '2f',
  '3f',
  '1f 1x',
  '2f 1x',
  '1f 2x',
  '1f 2x',
  '2f 2x',
  '1f 1h',
  '2f 1h',
  '1f 2h',
  '2f 2h'
]


// seed

var turnpoint_deck = {
  'r/b': 15,
  'r/g': 15,
  'g/b': 15
}

// shuffle & shift n cards for each player, shuffle agenda
// 1. see if a certain price is payable

console.log(_.shuffle(price_options))

agents_sheet.useServiceAccountAuth(creds, function(err){
  agents_sheet.getInfo( function(err, sheet_info ){
    console.log( sheet_info.title + ' is loaded' );
  });
})
