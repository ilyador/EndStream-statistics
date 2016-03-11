"use strict";

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



var priceStats = (priceCombinations, stream) => {
  return priceCombinations.reduce( (sum, price) => {

    var m_n = stream.replace(/[^m]/g, "").length
    var s_n = stream.replace(/[^s]/g, "").length
    var p_n = stream.replace(/[^p]/g, "").length

    var m_k = price.replace(/[^m]/g, "").length
    var s_k = price.replace(/[^s]/g, "").length
    var p_k = price.replace(/[^p]/g, "").length

    var probability = n_k(m_n, m_k) * n_k(s_n, s_k) * n_k(p_n, p_k)

    return sum + probability
  }, 0)
}



function cartesianProductOf() {
  return _.reduce(arguments, function(a, b) {
    return _.flatten(_.map(a, function(x) {
      return _.map(b, function(y) {
        return x.concat([y])
      });
    }), false)
  }, [ [] ])
}
//console.log("cartesianProductOf", cartesianProductOf([ 'm', 'msp', 'msp' ]))



var megaStats = (prices, times, stream) => {
  var stats = {}

  for (let i = 0; i < times; i++) {
    _.forEach(prices, val => {
      stats[val] = priceStats( priceDeconstructor(val), stream )
    })
  }

  return stats
}



getAgentPrices().then( data => {
  console.log(megaStats(data, 10, createStream(streamSize)))
})


//console.log("priceDeconstructor: ", priceDeconstructor('1m 2x'))
//console.log( priceStats( priceDeconstructor('1m 2x'), createStream(streamSize) ))
