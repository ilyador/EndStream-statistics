"use strict";

var _ = require('lodash')
var n_k = require('combinations-js')
var cmb = require('js-combinatorics')
var getAgentPrices = require('./google-spreadsheet-data')

getAgentPrices().then(function (data) {
  console.log(data);
})

const streamDeck = {
  'm': 15,
  's': 15,
  'p': 15
}
const streamSize = 6
const prices = {
  '1p 1x': 8,
  '1s 1x': 7,
  '1m 1x': 7,
  '2ms': 7,
  '1x': 7,
  '3ms': 6,
  '2m 1x': 5,
  '2p 1x': 5,
  '2s 1x': 4,
  '2mp': 4,
  '1m 2x': 3,
  '3mp': 3,
  '1ms': 3,
  '1m 1ms': 2,
  '2sp': 2,
  '4x': 2,
  '2x': 2,
  '1p': 2,
  '1m': 2,
  '1s': 2,
  '2m': 2,
  '1mp': 2,
  '1s 2x': 2,
  '4mp': 2,
  '1p 2mp': 1,
  '1sp': 1,
  '1m 2ms': 1,
  '3x': 1,
  '2m 2ms': 1,
  '2s': 1,
  '1m 1sp': 1,
  '2s 2x': 1
}


var createStream = () => {
  let stream = [].concat(..._.map(streamDeck,
    (times, agenda) => _.times(times, _=>agenda)
  ))

  return _.shuffle(stream).splice(0, streamSize)
}

var priceDeconstructor = (price) => {
  var priceCombinations = []
  var split = price.split(" ")

  for (let i = 0; i < split.length; i++) {
    for (let j = 0; j < parseInt(split[i][0]); j++) {
      let singlePrice = split[i].substr(1)
      if (singlePrice === 'x') singlePrice = 'msp'
      priceCombinations.push(singlePrice)
    }
  }

  var opts = cmb.cartesianProduct(...priceCombinations).toArray()
  return opts.map( priceArray => priceArray.join('') )
}

var basePrice = priceDeconstructor('2ms 1x')
var stream = createStream()

console.log(stream)
console.log(basePrice)

// shuffle & shift n cards for each player, shuffle agenda
// see if a certain price is payable
