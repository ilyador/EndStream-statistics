var _ = require('lodash')
var VerEx = require('verbal-expressions');
var math = require('mathjs')
//var prices = require('./google-spreadsheet-data')

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



function createStream () {
  var deck = []

  Object.keys(streamDeck).forEach(function (agenda) {
    deck = deck.concat( _.fill(Array(streamDeck[agenda]), agenda) )
  })

  return _.shuffle(deck).splice(0, streamSize)
}


var stream = createStream()

// shuffle & shift n cards for each player, shuffle agenda
// see if a certain price is payable
