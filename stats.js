'use strict';

var _ = require('lodash')
var n_k = require('combinations-js')
var cmb = require('js-combinatorics')

_.mixin({
  'sortKeysBy': (obj, comparator) => {
    var keys = _.sortBy(_.keys(obj), key => comparator ? comparator(obj[key], key) : key)
    return _.zipObject(keys, _.map(keys, (key) => obj[key]))
  }
})

var prices = {
  '2m 1x': 0,
  '1m 1ms': 0,
  '1s 1x': 0,
  '2p 1x': 0,
  '1p 1x': 0,
  '1m 1x': 0,
  '2s 1x': 0,
  '2ms': 0,
  '2mp': 0,
  '2sp': 0,
  '1m 2x': 0,
  '3ms': 0,
  '3x': 0,
  '4x': 0,
  '3mp': 0,
  '2x': 0,
  '1x': 0,
  '1p': 0,
  '1m': 0,
  '1s': 0,
  '2m': 0,
  '1ms': 0,
  '1mp': 0,
  '1s 1mp': 0,
  '3s': 0,
  '3m': 0,
  '1sp': 0,
  '1m 2ms': 0,
  '1s 2x': 0,
  '2s': 0,
  '1m 1sp': 0,
  '2s 2x': 0,
  '4mp': 0
}
const streamDeck = {
  'm': 15,
  's': 15,
  'p': 15
}
const streamSize = 6



var createStream = size => {
  let stream = [].concat(..._.map(streamDeck,
    (times, agenda) => _.times(times, () => agenda)
  ))

  return _.shuffle(stream).splice(0, size).join('')
}

var priceDeconstructor = price => {
  var priceCombinations = []
  var split = price.split(' ')

  for (let i = 0; i < split.length; i++) {
    for (let j = 0; j < parseInt(split[i][0]); j++) {
      let singlePrice = split[i].substr(1)
      if (singlePrice === 'x') singlePrice = 'msp'
      priceCombinations.push(singlePrice)
    }
  }

  var opts = cmb.cartesianProduct(...priceCombinations).toArray()
  var o = [];

  _.forEach(opts, function (item) {
    o.push(_.sortBy(item))
  })

  o = o.map( priceArray => priceArray.join('') )

  return _.uniq(o)
}

var priceStats = (priceCombinations, stream) => {
  return priceCombinations.reduce( (sum, price) => {
    var s = stream
    var probability

    let M_n = s.replace(/[^m]/g, '').length
    let S_n = s.replace(/[^s]/g, '').length
    let P_n = s.replace(/[^p]/g, '').length

    let M_k = price.replace(/[^m]/g, '').length
    let S_k = price.replace(/[^s]/g, '').length
    let P_k = price.replace(/[^p]/g, '').length

    probability = n_k(M_n, M_k) * n_k(S_n, S_k) * n_k(P_n, P_k)

    return sum + probability
  }, 0)
}

var reduceStream = (stream, agenda, times) => {
  var rx1 = new RegExp('^([^'+ agenda +']*' + agenda +'){' + times + '}','g')
  var rx2 = new RegExp(agenda,'g')

  return stream.replace(rx1, function(match) {
    return match.replace(rx2, '')
  })
}

var megaStats = (prices, times) => {
  for (let i = 0; i < times; i++) {
    if ((i % 1000) === 0) console.log(i)
    let stream = createStream(streamSize)
    _.forOwn(prices, (val, key) => {
      prices[key] += priceStats( priceDeconstructor(key), stream)
    })
  }
  return _.sortKeysBy(prices, value => -value)
}


console.log(megaStats(prices, 100000))


// getAgentPrices().then( data => {
//   console.log(data)
// })
