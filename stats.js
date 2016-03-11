'use strict';

var _ = require('lodash')
var n_k = require('combinations-js')
var cmb = require('js-combinatorics')
var getAgentPrices = require('./google-spreadsheet-data')

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

    var m_n = stream.replace(/[^m]/g, '').length
    var s_n = stream.replace(/[^s]/g, '').length
    var p_n = stream.replace(/[^p]/g, '').length

    var m_k = price.replace(/[^m]/g, '').length
    var s_k = price.replace(/[^s]/g, '').length
    var p_k = price.replace(/[^p]/g, '').length

    var probability = n_k(m_n, m_k) * n_k(s_n, s_k) * n_k(p_n, p_k)

    return sum + probability
  }, 0)
}

var megaStats = (prices, times) => {
  for (let i = 0; i < times; i++) {
    _.forOwn(prices, (val, key) => {
      prices[key] += priceStats( priceDeconstructor(key), createStream(streamSize) )
    })
  }

  return prices
}



getAgentPrices().then( data => {
  console.log(megaStats(data, 1))
})
