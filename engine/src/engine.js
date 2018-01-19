/* globals module: false, require: false */
module.exports = function (options) {
	'use strict';
	// let _ = require('lodash/core')
	let _fi = require('lodash/findIndex')
		, _iseq = require('lodash/isEqual')
		, _clone = require('lodash/clone')
	//utilities
	function myIndexOf(a, b) {
		return _fi(a, function (x) { return _iseq(x, b) });
	}

	options = options || {}
	// boardMode = options.boardMode || 't'/*t:toroid; c:classic ...*/
	// , boardDimensions = options.boardDimensions || [11, 11]/*move later*/
	// , rules = options.rules || {
	// suicide: true,
	// superko: false
	// }
	let $ = {}
		, rules = options.rules || {
			suicide: true,
			superko: false /*⇒todo: enforce when true?*/,
			komi: 7.5
		}

	// $.moves = options.moves || []
	$.options = options
	options.boardDimensions = options.boardDimensions || [11, 11]
	options.boardMode = options.boardMode || 't'/*t:toroid; c:classic ...*/
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
						break;
					case 1:
						newPoint = [point[0] - 1, point[1]]
						break;
					case 2:
						newPoint = [point[0], point[1] + 1]
						break;
					case 3:
						newPoint = [point[0], point[1] - 1]
						break;
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
						break;
					case 1:
						newPoint = [point[0] - 1, point[1]]
						break;
					case 2:
						newPoint = [point[0], point[1] + 1]
						break;
					case 3:
						newPoint = [point[0], point[1] - 1]
						break;
				}
				if (newPoint[0] >= 0 && newPoint[0] < options.boardDimensions[0]
					&& newPoint[1] >= 0 && newPoint[1] < options.boardDimensions[1]
				)
					result.push(newPoint)
			}
			return result
		}
	//todo: klein, projective plane, ...

	$.board.isEmpty = function (point) {
		return myIndexOf($.board.blackStones, point) < 0
			&& myIndexOf($.board.whiteStones, point) < 0;
	}
	$.board.getColour = function (point) {
		if (myIndexOf($.board.blackStones, point) >= 0) return 'b'
		if (myIndexOf($.board.whiteStones, point) >= 0) return 'w'
		return 'e'
	}
	function chainHasLiberty (startPoint, chainColour, stopColour) {
		if (stopColour === undefined)
			stopColour = 'e'//by default, stop getting the chain when there is a liberty.
		if (chainColour === null)
			chainColour = $.board.getColour(startPoint)
		let
			chain = [startPoint]
			, toExplore = []
			, point = startPoint //assumed to be of colour chainColour

		while (point !== undefined) {

			let neighbours = $.board.getNeighbours(point)
			for (let i = 0; i < neighbours.length; i++) {
				let newPoint = neighbours[i],
					newColour = $.board.getColour(newPoint)
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
	$.board.getComponent = function (startPoint, deadStones) {
		//Use for scoring.
		//It returns all points of the same colour (B, W or E) that are linked to the startPoint.
		//deadStones: array of B or W points that defines (via this function) B or W components that are treated as E when getting an E component.
		//todo
		return {
			points: []
			, colour: []
			, isDead: false//for B or W chains
			, isBlackTerritory: false//for empty components
		}
	}

	$.board.score = function (deadStones) {
		/*
		go through the whole board 
		use getComponent to split up into B, W and E
		*/

		let result = {
			whiteComponents: {}
			, blackComponents: {}
			, emptyComponents: {}
			, totalBlackDead: 0
			, totalWhiteDead: 0
			, totalBlackPrisoners: 0
			, totalWhitePrisoners: 0
			, totalBlackTerritory: 0
			, totalWhiteTerritory: 0

		}
		//todo: implement other rulesets. For now, just do territory + prisoners (Japanese style counting)
		result.blackScore =
			result.totalWhiteDead
			+ result.totalBlackPrisoners
			+ result.totalBlackTerritory
		result.whiteScore =
			result.totalBlackDead
			+ result.totalWhitePrisoners
			+ result.totalWhiteTerritory
			+ komi //todo
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
			throw new Error('point is not empty');
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
				if (rules.suicide) {
					$.removeChain(s, playerColour)
					suicide = s
				}
				else {
					throw new Error('suicide');//isn’t allowed
					//todo: remove point from whiteStones or blackStones
				}
			}
		}

		/*
			storing the situation in memory - would be useful when implementing going back a move, superko, ...
			not needed for now
		*/
		//$.moves.push([playerColour,point,_.clone($.board.whiteStones),_.clone($.board.blackStones)])
		// $.moves.push([playerColour,point])

		// getNeighbours[i] = [getNeighbours[i], $.board.getColour[getNeighbours[i]]
		// //...


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