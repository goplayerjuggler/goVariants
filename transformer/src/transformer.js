/* globals module: false, require: false */
module.exports = function (options
) {
	'use strict';
	var _ = require('lodash/core')
	options = options || {}
	
	if (options.addPasses === undefined)
		options.addPasses = true;
		if (options.addMarkersForWraparound === undefined)
			options.addMarkersForWraparound = true;
	options.boardDimensions = options.boardDimensions || [11, 11]

	if (options.transformToString === undefined)
		options.transformToString = true;

	if (options.addComments === undefined)
		options.addComments = true;
	options.projectionSettings = Object.assign({wraparound: 4, offset: [0, 0]}, options.projectionSettings)//{wraparound: 4, offset: [0, 0] , ... options.projectionSettings} //options.projectionSettings || { wraparound: 4, offset: [0, 0] }

	var $ = {}
		// , _markersForWraparound = null
		, coordinateLabels = function (i) {
			// 97..122 and 65..90
			return String.fromCharCode(i < 26 ? i + 97 : i + 39)
			//65 - 26 =
		}
	// , mod = function(m) {return ((m % n) + n) % n}

	$.coordinateLabels = coordinateLabels
	$.options = options

	$.projectOnLine = function (a, isVertical) {
		/*
		m: boardDimensions[0] : 11
		n: wraparound : 4
		line: 0,...,(m-1)
		=>
		0,...,(n-1), (start line) n, ... , (n + m - 1) end line,  (n+m), ... , (2n + m - 1)
		
		coordinate a ∈ {0 .. m-1} projects to n + a in main area
		all projections are of the form n + a + xm, x ∈ ℤ s.t. 0 ≤ n + a + xm ≤ 2n + m -1
		-xm ≤ n + a 
			smallest such x < 0 is ceil(-(n+a)/m)
		 xm ≤ n + m - 1 -a
			largest such x is floor((n + m - 1 -a) / m)
		
		
			var m = options.boardDimensions[isVertical?1:0]
			var n = options.projectionSettings.wraparound
			var r = (a+n-m >= 0) ? [a+n-m, a + n] : [a + n]
			if (a+n+m < m + (2*n)) r.push(a+n+m)
			return r
		
		*/

		var m //= options.boardDimensions[0]
			= options.boardDimensions[isVertical ? 1 : 0]
		var n = options.projectionSettings.wraparound
		var r = []

		for (var i = Math.ceil(-(n + a) / m); i <= (n + m - 1 - a) / m; i++)
			r.push(n + a + i * m)
		return r
	}
	$.projectOnFlat = function (p) {
		var a = $.projectOnLine(p[0] + options.projectionSettings.offset[0])
		var b = $.projectOnLine(p[1] + options.projectionSettings.offset[1])
		var r = []
		for (var i = 0; i < a.length; i++)
			for (var j = 0; j < b.length; j++)
				r.push([a[i], b[j]])
		return r
	}

	var setUpMarkers = () => {
		$.markersForWraparound = []

		// $.getMarkersForWraparound = function (){
		if (options.addMarkersForWraparound) {
			var m = options.boardDimensions[0]
			var n = options.projectionSettings.wraparound
			/*
			m: boardDimensions[0] : 11
			n: wraparound : 4
			line: 0,...,(m-1)
			=>
			0,...,(n-1), (start line) n, ... , (n + m - 1) end line,  (n+m), ... , (2n + m - 1)
			
			
			for(var i = 1; i<12;i++)
			{
				board.push(coordinateLabels[3]+coordinateLabels[3+i]+":│")//":|")
				board.push(coordinateLabels[15]+coordinateLabels[3+i]+":│")
				// if (i==0 || i== 12) continue;
				board.push(coordinateLabels[3+i]+coordinateLabels[3]+":─")
				board.push(coordinateLabels[3+i]+coordinateLabels[15]+":─")	
			}
			//┘  ┌  └ ┐
			board.push(coordinateLabels[3]+coordinateLabels[15]+":└")
			board.push(coordinateLabels[15]+coordinateLabels[15]+":┘")
			board.push(coordinateLabels[3]+coordinateLabels[3]+":┌")
			board.push(coordinateLabels[15]+coordinateLabels[3]+":┐")
			
			
			*/

			var board = []
			for (var i = 1; i <= m; i++) {
				board.push(coordinateLabels(n - 1) + coordinateLabels(n - 1 + i) + ":│")
				board.push(coordinateLabels(n + m) + coordinateLabels(n - 1 + i) + ":│")
				board.push(coordinateLabels(n - 1 + i) + coordinateLabels(n - 1) + ":─")
				board.push(coordinateLabels(n - 1 + i) + coordinateLabels(n + m) + ":─")
			}
			//┘  ┌  └ ┐
			board.push(coordinateLabels(n - 1) + coordinateLabels(n + m) + ":└")
			board.push(coordinateLabels(n + m) + coordinateLabels(n + m) + ":┘")
			board.push(coordinateLabels(n - 1) + coordinateLabels(n - 1) + ":┌")
			board.push(coordinateLabels(n + m) + coordinateLabels(n - 1) + ":┐")
			$.markersForWraparound = board
		}
	}
	setUpMarkers()




	// convert coordinates to a string 
	$.coords2String = function coords2String(coords) {
		return coordinateLabels(coords[0]) + coordinateLabels(coords[1])
	}

	$.inverseTransform = function (
		sgf
		, smartgame
		, smartgamer) {

	}

	$.transform = function (
		tGoSgf //eg 11x11 sgf from LittleGolem
		, tGo //app implementing t-Go
		, smartgame
		, smartgamer) {

		if (tGo === undefined) {
			tGo = require('go-variants-engine')({
				// boardMode:'t', 
				boardDimensions: options.boardDimensions
			})
			// tGo = require('../node_modules/go-variants-engine')({boardMode:'t', boardDimensions:options.boardDimensions})
			// tGo = require('../node_modules/go-variants-engine/src/engine')({boardMode:'t', boardDimensions:options.boardDimensions})
		}
		// else {
		// 	tGo.options.boardDimensions = options.boardDimensions
		// }

		if (smartgame === undefined) {
			smartgame = require('smartgame')
		}
		if (smartgamer === undefined) {
			smartgamer = require('smartgamer')
		}
		// console.log(tGo)
		var parsed = smartgame.parse(tGoSgf)
			, wrappedGame = smartgamer(parsed)
			, node = wrappedGame.node()
			, passes = 0
			, pending = []
			, currentPath = { m: 0 }
		if (node.SZ !== undefined) {
			var sz = Number(node.SZ)
			// sz+= 2*options.projectionSettings.wraparound
			options.boardDimensions = [sz, sz]
			tGo.options.boardDimensions = options.boardDimensions
			setUpMarkers()
		}
		node.SZ = "" + (options.boardDimensions[0] + 2 * options.projectionSettings.wraparound)//not sure how to make a rectangular goban!
		let setLabels = () => {
			//node.LB = $.markersForWraparound
			var labels = []
			if (node.LB !== undefined) {
				labels = node.LB
				if (!Array.isArray(labels))
					labels = [labels]

				/* jshint loopfunc: true */
				var labels2 = _.chain(labels)
					.map(function (x) { return x.split(':', 2) })//assume the label doesn’t contain “:”
					.map(function (x) { return [wrappedGame.translateCoordinates(x[0]), x[1]] })
					.map(function (x) { return [$.projectOnFlat(x[0]), x[1]] })
					.value()
				labels = []
				for (var i = 0; i < labels2.length; i++)
					labels = labels.concat(
						_.map(labels2[i][0], function (x) {
							return $.coords2String(x) + ":" + labels2[i][1]
						})
					)
			}

			node.LB = $.markersForWraparound.concat(labels)
			if (node.LB.length === 0)
				delete node['LB']
		}
		
		setLabels()
		
		if (node.SO !== undefined)
			node.SO = wrappedGame.game.nodes[0].SO + " (source sgf for toroidal Go has been adapted by go-variants-transformer so as to be rendered by any standard Go application)"
		node.AP = "go-variants-transformer"


		function comment(isPass, isBlack) {
			if (!options.addComments)
				return

			var r = 'move ' + currentPath.m + '\n' + 'Black captures: ' + tGo.board.captured[1] + '\nWhite captures: ' + tGo.board.captured[0]
			//var r =  'Black captures: ' + tGo.board.captured[1] + '\r\nWhite captures: ' + tGo.board.captured[0]
			if (isPass)
				r += '\n' + (isBlack ? 'Black passes' : 'White passes')
			r += (node.C === undefined ? '' : '\n' + node.C)
			node.C = r
			return
		}

		function goThroughTree()//(wrappedGame, tGo, node, next)
		{
			var nbVariations = wrappedGame.variations().length
			if (nbVariations > 0) {
				// if(currentPath[m] === undefined)
				// currentPath[m] = 0
				// else
				// currentPath[m] += 1
				// currentPath.m += 1
				for (var i = 1; i < nbVariations; i++) {
					var pathForLater = Object.assign({}, currentPath)//{...currentPath}
					pathForLater[currentPath.m + 1] = i
					pathForLater.m += 1


					pending.push({ path: pathForLater, tGoData: tGo.exportData() })

				}
				node = wrappedGame.next().node()
				currentPath[currentPath.m + 1] = 0
				currentPath.m += 1
				return
			}

			var nextNode = wrappedGame.next().node()
			if (node === nextNode) {//at a leaf: 
				if (pending.length === 0) {
					node = null
					return//finished
				}
				var fromStack = pending.pop()
				// if (fromStack === null) {
				// 	node = null
				// 	return//finished!
				// }
				tGo.loadData(fromStack.tGoData)
				node = wrappedGame.goTo(fromStack.path).node()
				currentPath = fromStack.path
				return
			}
			else {
				currentPath.m += 1
				node = nextNode
				return
			}
		}
		goThroughTree()
		while (node !== null) {


			var
				isBlack = node.B !== undefined
				, move = isBlack ? node.B : node.W
				, isPass = move === "" || (options.boardDimensions[0] === options.boardDimensions[1]
					&& options.boardDimensions[0] <= 19
					&& move === "tt" //weird SGF[3] way to show a pass move!
				)
			if (move === undefined) {
				goThroughTree()
				continue
			}
			setLabels()

			if (isPass) {
				delete node[isBlack ? 'B' : 'W']
				comment(isPass, isBlack)
				// if (passes === 2) {
				// 	//wrappedGame.game.nodes.splice(i+1)//get rid of nodes afterwards -- may not work with variations! todo
				// 	//todo:score!
				// 	break;//stop after 3 successive passes for now
				// }
				passes++
				if (passes >= 1000)
					break//just in case! 
				goThroughTree();
			}
			else {
				// run move through tGo and update game accordingly
				try {
					var
					coords = wrappedGame.translateCoordinates(move)
					, playResult = tGo.play(isBlack ? 'b' : 'w', coords)
					, projectedCoords = $.projectOnFlat(coords)
					, toAdd = _.map(projectedCoords, $.coords2String)
					, toRemove =
						_.chain(playResult.removed)
							.flatten(true)
							.map($.projectOnFlat)
							.flatten(true)
							.map($.coords2String)
							.value()	
				} catch (error) {
					if (error.message==='point is not empty') {
					 /*ignore this - it happens with some sgf from littleGolem. Todo: look into scoring the position here. */  
					 goThroughTree();
					 continue;
					}
					else throw(error)
				}
				

				//alter the node 
				if (options.addPasses)
					node[isBlack ? 'B' : 'W'] = ''
				else delete node[isBlack ? 'B' : 'W']
				// node[isBlack ? 'B' : 'W'] = ''
				node[isBlack ? 'AB' : 'AW'] = toAdd
				node.CR = toAdd
				if (toRemove.length > 0)
					node.AE = toRemove
				comment(isPass, isBlack)


					/*
					todo: other properties with board coordinates
					Leave for now:
					AR
					LN				
					*/

					;/*note this semicolon is needed! (TBC) */
				[
					//'CR',todo: add if not marking the move
					'DD', 'MA', 'SL', 'SQ', 'TR'].forEach(function (sgfProperty) {
						// _.map(['DD','MA','SL','SQ','TR'], function(sgfProperty){
						if (node[sgfProperty] === undefined) return
						var points = []
						if (Array.isArray(node[sgfProperty])) {
							points = node[sgfProperty]
						}
						else {
							points = [node[sgfProperty]]
						}
						points = _.chain(points)
							.map(wrappedGame.translateCoordinates)
							.map($.projectOnFlat)
							.flatten(true)
							.map($.coords2String)
							.value()
						node[sgfProperty] = points
					})
				node.MN = currentPath.m
				// move to next node
				goThroughTree()
			}
		}
		if (options.transformToString)
			return smartgame.generate({ gameTrees: [wrappedGame.game] });
		else return wrappedGame
	}
	return $

}