var _ = require('lodash');

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



console.log(_.shuffle(price_options))
