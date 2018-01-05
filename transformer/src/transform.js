/* globals module: false, require: false

*/


module.exports = (variantSgf, options) => {
  'use strict' 
  let transformer = require('./transformer')
	,  smartgame = require('smartgame')
	,  smartgamer = require('smartgamer')
	,  tGo = require('go-variants-engine')()
    return (transformer(options)).transform(
  
    variantSgf
    , tGo
    , smartgame
    , smartgamer
    )
  }