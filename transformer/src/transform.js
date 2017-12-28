/* globals module: false, require: false

*/

/**
 * 
 * @param {string} variantSgf SGF for a game.
 * @param {object} [options=] Defines various options for the output SGF. May be omitted, in which case the default options (see below) are used.
 * @param {boolean} [options.addComments = true] When flagged, comments are added to each node giving the move number and the number of stones captured by Black and White.
 * @param {boolean} [options.addMarkersForWraparound = true] When flagged, the start of the “wraparound” area is shown in the viewer. This is done by adding labels at the edge of the wraparound, to each node in the game. 
 * @param {boolean} [options.addPasses = true] When flagged, a pass is added to each node corresponding to a move by a player. This can make the output more easy to navigate in some viewers.
 * @param {array} [options.boardDimensions = [11, 11]] May be used for rectangular t-Go. Should be ommitted for [n, n] t-Go, where n is specified in the input SGF (@param variantSgf).
 * @param {object} [options.projectionSettings=] Further optional settings for how the (toroidal, or other sort of) board is projected to a flat grid.
 * @param {number} [options.projectionSettings.wraparound = 4]  Number of lines to add for the “wraparound”.
 * @param {array} [options.projectionSettings.offset = [0,0]]  Translation to apply to all moves.
 * @param {boolean} [options.transformToString=true] When set to false, the output is an object (an instance of a Smartgame).
 * 
 * @returns {string|object} SGF that can be viewed in a standard SGF viewer. (See `options.transformToString` for the data type of the value returned.)
 */
/*todos:
options.markLastMove Default value: 'CR'
opions.placesToCount Default: undefined. May be: 'last'|[countInfo1, .. countInfo1]. countInfo is a path plus an array with a point for each chain to be considered as dead. {path, deadChains: [...]}
options.projectionSettings.rotation {integer} Default value: 0. Allowed values: 0 .. 3
options.projectionSettings.normalize1stMove array, or one of: C, TL TR BL BR 
options.projectionSettings.normalize2ndMove 

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