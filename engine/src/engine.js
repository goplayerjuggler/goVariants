/* globals module: false, require: false */
module.exports = function (options) {
	'use strict';
	let _fi = require('lodash/findIndex')
		// , _iseq = require('lodash/isEqual')
		, _clone = require('lodash/clone')
		//utilities
		// const

		, _iseq = (x, y) => {

			if (!Array.isArray(x) || !Array.isArray(y)) {
				return x == y// eslint-disable-line eqeqeq
				// return x === y
			}
			if (x.length !== y.length) return false
			for (let index = 0; index < x.length; index++) {
				if (!_iseq(x[index], y[index])) {
					return false
				}
			}
			return true

		}
		, myIndexOf = (a, b) => {
			return _fi(a, function (x) { return _iseq(x, b) });
		}
	// this version, without the _fi dependency, doesn't work!todo
	//  , myIndexOf = (array, item) => {
	// 		for (let index = 0; index < array.length; index++) {
	// 			if (_iseq(array[index], item)) {
	// 				return index;

	// 			}
	// 			return -1;
	// 		}

	// 	}

	// 	, _clone = require('lodash/clone')


	options = options || {}
	// boardMode = options.boardMode || 't'/*t:toroid; c:classic …*/
	// , boardDimensions = options.boardDimensions || [11, 11]/*move later*/
	// , rules = options.rules || {
	// suicide: true,
	// superko: false
	// }
	let $ = {}
	////problem with the object spread operator and the build so using Object.assign instead.
	// $.rules = {
	// 		suicide: true,
	// 		// superko: false /*⇒todo: enforce when true?*/,
	// 		komi: 7.5,
	// 		... options.rules
	// 	}
	$.rules = Object.assign({}, {
		suicide: true,
		// superko: false /*⇒todo: enforce when true?*/,
		komi: 7.5,
	}, options.rules)

	// $.moves = options.moves || []
	$.options = options
	options.boardDimensions = options.boardDimensions || [11, 11]
	options.boardMode = options.boardMode || 't'/*t:toroid; c:classic …*/
	$.board = {}
	$.board.blackStones = options.blackStones || []
	$.board.whiteStones = options.whiteStones || []

	$.board.nextPlayer = options.nextPlayer || "b"
	$.board.captured = options.captured || [0, 0]

	$.exportData = function () {
		return {
			blackStones: $.board.blackStones.map(_clone),

			whiteStones: $.board.whiteStones.map(_clone),
			captured: _clone($.board.captured),
			nextPlayer: $.board.nextPlayer
		}
	}

	$.loadData = function (data) {
		$.board.blackStones = data.blackStones
		$.board.whiteStones = data.whiteStones
		$.board.captured = data.captured
		$.board.nextPlayer = data.nextPlayer
	}

	//toroid
	if (options.boardMode === 't') $.board.getNeighbours =
		function (point) {
			let result = []
			for (let i = 0; i < 4; i++) {
				let newPoint
				switch (i) {
					case 0:
						newPoint = [point[0] + 1, point[1]]
						break
					case 1:
						newPoint = [point[0] - 1, point[1]]
						break
					case 2:
						newPoint = [point[0], point[1] + 1]
						break
					case 3:
						newPoint = [point[0], point[1] - 1]
						break
				}
				result.push([(newPoint[0] + options.boardDimensions[0]) % options.boardDimensions[0], (newPoint[1] + options.boardDimensions[1]) % options.boardDimensions[1]])
			}
			return result
		}
	if (options.boardMode === 'c') $.board.getNeighbours =
		function (point) {
			let result = []
			for (let i = 0; i < 4; i++) {
				let newPoint
				switch (i) {
					case 0:
						newPoint = [point[0] + 1, point[1]]
						break
					case 1:
						newPoint = [point[0] - 1, point[1]]
						break
					case 2:
						newPoint = [point[0], point[1] + 1]
						break
					case 3:
						newPoint = [point[0], point[1] - 1]
						break
				}
				if (newPoint[0] >= 0 && newPoint[0] < options.boardDimensions[0]
					&& newPoint[1] >= 0 && newPoint[1] < options.boardDimensions[1]
				)
					result.push(newPoint)
			}
			return result
		}
	//todo: klein, projective plane, …

	$.board.isEmpty = function (point) {
		return myIndexOf($.board.blackStones, point) < 0
			&& myIndexOf($.board.whiteStones, point) < 0
	}
	$.board.getColour = function (point) {
		if (myIndexOf($.board.blackStones, point) >= 0) return 'b'
		if (myIndexOf($.board.whiteStones, point) >= 0) return 'w'
		return 'e'
	}
	/**
	 * Determines if a point is part of a chain with a liberty; if there are no liberties then it returns the chain of stones of the same colour that are connected to `startPoint`. Also used for counting to return connected components of same colour (black, white or empty).
	 * @param {*} startPoint 
	 * @param {string|null} chainColour indicates the colour of the starting point.
	 * @param {*} [stopColour='e'] stop working if the chain meets this colour
	 * @param {Function} [getColour=$.board.getColour] Function used to determine the colour of a point.
	 * @returns {bool|array} Returns `true` if the the component meets `stopColour`, and an array containing connected component of points linked to `startPoint` otherwise. 
	 */	
	function chainHasLiberty (startPoint, chainColour, stopColour, getColour) {
		if (stopColour === undefined)
			stopColour = 'e'//by default, stop getting the chain when there is a liberty.
		if (getColour === undefined)
			getColour = $.board.getColour//by default, use the usual board colour function

		if (chainColour === null)
			chainColour = getColour(startPoint)
		let
			chain = [startPoint]
			, toExplore = []
			, point = startPoint //assumed to be of colour chainColour

		while (point !== undefined) {

			let neighbours = $.board.getNeighbours(point)
			for (let i = 0; i < neighbours.length; i++) {
				let newPoint = neighbours[i],
					newColour = getColour(newPoint)
				if (newColour === stopColour) return true;
				if (newColour === chainColour) {
					if (myIndexOf(chain, newPoint) < 0) {
						chain.push(newPoint)
						// if (myIndexOf(toExplore, newPoint) < 0)
						toExplore.push(newPoint)
					}
				}
			}
			point = toExplore.pop()
		}

		return chain;
	}

	$.board.chainHasLiberty = chainHasLiberty 

	$.board.score = function (deadStones) {
		/*
		go through the whole board 
		*/
		if (deadStones === undefined) {
			deadStones = []
		}

		let result = {
			blackEmpty: []
			, whiteEmpty: []
			, dame: []
			, blackAlive: []
			, whiteAlive: []
			, blackDead: []
			, whiteDead: []
			, totalBlackCaptured: $.board.captured[0] //nb B stones removed by W during the game
			, totalWhiteCaptured: $.board.captured[1] //nb W stones removed by B during the game
			//todo:could replace by an class. data stored in a big array of pairs [point, status]
		}

		for (let index = 0; index < deadStones.length; index++) {
			const deadStone = deadStones[index];
			let deadColour = $.board.getColour(deadStone)
			if (deadColour === 'e') throw new Error('invalid marked dead stone')
			let
				deadToFill = deadColour === 'b' ? result.blackDead : result.whiteDead
				, emptyToFill = deadColour === 'b' ? result.whiteEmpty : result.blackEmpty
				, aliveToFill = deadColour === 'b' ? result.whiteAlive : result.blackAlive
				, processPoint = (point, colour) => {
					if (colour === deadColour && myIndexOf(deadToFill, point) < 0) {
						deadToFill.push(point)
						emptyToFill.push(point)
					}
					if ((colour === deadColour || colour === 'e') && myIndexOf(emptyToFill, point) < 0) {
						emptyToFill.push(point)
					}
					if (colour !== deadColour && colour !== 'e' && myIndexOf(aliveToFill, point) < 0) {
						aliveToFill.push(point)
					}
				}
				, getColourForDeadComponent = (point) => {
					let colour = $.board.getColour(point)
					processPoint(point, colour)
					return colour === deadColour ? 'e' : colour
				}
			processPoint(deadStone, deadColour)
			$.board.chainHasLiberty(deadStone, 'e', '', getColourForDeadComponent)
		}

		for (let i = 0,exitLoop = false; i < options.boardDimensions[0]; i++) {
			if (exitLoop) {
				break
			}
			for (let j = 0; j < options.boardDimensions[1]; j++) {
				if (result.blackEmpty.length
					+ result.whiteEmpty.length
					+ result.dame.length
					+ result.blackAlive.length
					+ result.whiteAlive.length
					// + result.blackDead.length
					// + result.whiteDead.length
					=== options.boardDimensions[0] * options.boardDimensions[1]
				) {
					exitLoop = true
					break
				}
				const point = [i, j], colour = $.board.getColour(point)

				if (colour === 'b'
				) {
					if (myIndexOf(result.blackAlive, point) < 0
						&& myIndexOf(result.blackDead, point) < 0) {
						result.blackAlive.push(point)
					} else continue
				}
				if (colour === 'w') {
					if (myIndexOf(result.whiteAlive, point) < 0
						&& myIndexOf(result.whiteDead, point) < 0) {
						result.whiteAlive.push(point)
					} else continue
				}

				if (colour === 'e') {
					if (myIndexOf(result.blackEmpty, point) >= 0
						|| myIndexOf(result.whiteEmpty, point) >= 0
						|| myIndexOf(result.dame, point) >= 0) {
						continue
					}

					let
						meetsBlack = false
						, meetsWhite = false
						, isBlackTerritory = false
						, isWhiteTerritory = false
						, getColourForScoring = (point) => {

							let colour = $.board.getColour(point)
							switch (colour) {
								case 'b':
									if (myIndexOf(result.blackDead, point) >= 0) {
										colour = 'e'
										isWhiteTerritory = true
									}
									else {
										meetsBlack = true
										if (myIndexOf(result.blackAlive, point) < 0) {
											result.blackAlive.push(point)
										}
									}
									break;
								case 'w':
									if (myIndexOf(result.whiteDead, point) >= 0) {
										colour = 'e'
										isBlackTerritory = true
									}
									else {
										meetsWhite = true
										if (myIndexOf(result.whiteAlive, point) < 0) {
											result.whiteAlive.push(point)
										}
									}
									break;

								default://nothing needed for 'e'
									break;
							}
							return colour
						}
					let emptyComponent = $.board.chainHasLiberty(point, 'e', '', getColourForScoring)
					if (!meetsBlack && !meetsWhite) {
						throw new Error('counting an empty board!')
					}
					if (isBlackTerritory && isWhiteTerritory) {
						throw new Error('too many stones marked as dead')
					}
					//could store the different empty components: V2 
					if (meetsBlack && meetsWhite) {
						result.dame = result.dame.concat(emptyComponent)
						continue
					}
					if (meetsBlack) {
						result.blackEmpty = result.blackEmpty.concat(emptyComponent)
						continue
					}
					if (meetsWhite) {
						result.whiteEmpty = result.whiteEmpty.concat(emptyComponent)
						continue
					}
				}
			}
		}
		//totals
		result.totalBlackDead = result.blackDead.length
		result.totalWhiteDead = result.whiteDead.length
		result.totalBlackTerritory = result.blackEmpty.length
		result.totalWhiteTerritory = result.whiteEmpty.length


		//todo: implement other rulesets. For now, just do territory + prisoners (Japanese style counting)
		result.blackScore =
			result.totalWhiteDead
			+ result.totalWhiteCaptured
			+ result.totalBlackTerritory
		result.whiteScore =
			result.totalBlackDead
			+ result.totalBlackCaptured
			+ result.totalWhiteTerritory
			+ $.rules.komi
		let r = result.blackScore - result.whiteScore
		if (r === 0) result.RE = '0'
		else if (r > 0) result.RE = 'B+' + r
		else result.RE = 'W+' + (-r)
		return result
	}

	$.board.empty = function () {
		$.board.whiteStones = []
		$.board.blackStones = []
		$.board.captured = [0, 0]

	}

	$.removeChain = function (chain, colour) {
		let toRemoveFrom = colour === 'w' ? $.board.whiteStones : $.board.blackStones
		for (let j = 0; j < chain.length; j++) {
			let index = myIndexOf(toRemoveFrom, chain[j])
			toRemoveFrom.splice(index, 1)
			if (colour === 'w') $.board.captured[1] = $.board.captured[1] + 1
			else $.board.captured[0] = $.board.captured[0] + 1
		}
	}
	$.play = function (playerColour, point) {



		// let result = "ok"
		if (!$.board.isEmpty(point))
			throw new Error('point is not empty')
		// console.log('point is not empty' + point)

		if (playerColour === 'b') $.board.blackStones.push(point)
		else $.board.whiteStones.push(point)

		let neighbours = $.board.getNeighbours(point)
			, removed = []//chains removed

		for (let i = 0; i < neighbours.length; i++) {
			let neighbour = neighbours[i], colour = $.board.getColour(neighbour)
			if (colour === playerColour || colour === 'e') continue
			let oppColour = $.getOppositeColour(playerColour),
				r = $.board.chainHasLiberty(neighbour, oppColour)
			if (r === true) continue
			////remove - no liberties
			removed[removed.length] = r

			$.removeChain(r, oppColour)

			// let chainToRemove = r[1],
			// toRemoveFrom = playerColour === 'b' ? $.board.whiteStones : $.board.blackStones
			// for (let j = 0; j<chainToRemove.length; j++)
			// {
			// let index = myIndexOf(toRemoveFrom,chainToRemove[j])
			// toRemoveFrom.splice(index, 1)
			// if (playerColour === 'b') $.board.captured[1] = $.board.captured[1] + 1
			// else $.board.captured[0] = $.board.captured[0] + 1
			// }
			// removed = true
		}
		let suicide = false
		if (removed.length === 0) {
			let s = $.board.chainHasLiberty(point, playerColour)
			if (s !== true) {
				if ($.rules.suicide) {
					$.removeChain(s, playerColour)
					suicide = s
				}
				else {
					throw new Error('suicide')//isn’t allowed
					//todo: remove point from whiteStones or blackStones
				}
			}
		}

		/*
			storing the situation in memory - would be useful when implementing going back a move, superko, …
			not needed for now
		*/
		//$.moves.push([playerColour,point,_.clone($.board.whiteStones),_.clone($.board.blackStones)])
		// $.moves.push([playerColour,point])

		// getNeighbours[i] = [getNeighbours[i], $.board.getColour[getNeighbours[i]]
		// //…


		return { removed, suicide }
	}
	$.getOppositeColour = function (colour) {
		switch (colour) {
			case 'b':
				return 'w'
			case 'w':
				return 'b'
		}
		return null
	}
	return $

}