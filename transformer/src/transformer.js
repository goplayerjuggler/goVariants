/* globals module: false, require: false

*/

/**
 * 
 * @param {object} [options=] Defines various options for the output SGF. May be omitted, in which case the default options (see below) are used.
 * @param {boolean} [options.addComments = true] When flagged, comments are added to each node giving the move number and the number of stones captured by Black and White.
 * @param {boolean} [options.addPasses = true] When flagged, a pass is added to each node corresponding to a move by a player. This can make the output more easy to navigate in some viewers.
 * @param {array} [options.boardDimensions = [11, 11]] May be used for rectangular t-Go. Should be ommitted for [n, n] t-Go, where n is specified in the input SGF (@param variantSgf).
 * @param {object} [options.projectionSettings=] Further optional settings for how the (toroidal, or other sort of) board is projected to a flat grid.
 * 
 * @param {number} [options.projectionSettings.wraparoundMarkersType = 2] 0: no symbols are added to indicate the part of the wraparound area that’s next to the main grid;
 * 1: symbols are added using unicode symbols (from “Box Drawings”);
 * 2: symbols show t-Go coordinates.
 * @param {number} [options.projectionSettings.wraparound = 4]  Number of lines to add for the “wraparound”.
 * @param {array} [options.projectionSettings.offset = [0,0]]  Translation to apply to all moves.
 * @param {boolean} [options.transformToString=true] When set to false, the output is an object (an instance of a Smartgame).
 * @public
 * @return {object} An object exposing functions for going back and forth between SGF for a standard viewer, and SGF for a game of toroidal Go
 *//*todos:
options.markLastMove Default value: 'CR'
opions.placesToCount Default: undefined. May be: 'last'|[countInfo1, .. countInfo1]. countInfo is a path plus an array with a point for each chain to be considered as dead. {path, deadChains: [...]}
options.projectionSettings.rotation {integer} Default value: 0. Allowed values: 0 .. 3
options.projectionSettings.normalize1stMove array, or one of: C, TL TR BL BR 
options.projectionSettings.normalize2ndMove 

*/
function transformer(options
) {
	'use strict';
	const //_ = require('lodash/core')
		_flatten = require('lodash/flatten')
		, _uniqBy = require('lodash/uniqBy')
		, _fi = require('lodash/findIndex')
		, modulo = (x, y) => (x % y + y) % y
		, sourceSgfMessage = 'source sgf for toroidal Go has been adapted by go-variants-transformer so as to be rendered by any standard Go application'
	options = options || {}

	if (options.addPasses === undefined)
		options.addPasses = true;

	options.boardDimensions = options.boardDimensions || [11, 11]

	if (options.transformToString === undefined)
		options.transformToString = true;

	if (options.addComments === undefined)
		options.addComments = true;
	options.projectionSettings = Object.assign({ wraparound: 4, offset: [0, 0], wraparoundMarkersType: 2 }, options.projectionSettings)//{wraparound: 4, offset: [0, 0] ,  wraparoundMarkersType = 1,  ... options.projectionSettings} 

	let wraparound = options.projectionSettings.wraparound

	let $ = {}
		// , _markersForWraparound = null
		, coordinateLabels = function (i) {
			// 97..122 and 65..90
			return String.fromCharCode(i < 26 ? i + 97 : i + 39)
			//65 - 26 =
		}
		,
		translateCoordinate = (c) => {
			let r = c.charCodeAt(0)
			return r >= 97 ? r - 97 : r - 26
		},
		/**
		 * Translate alpha coordinates into an array
		 * @param string alphaCoordinates
		 * @return array [x, y]
		 **/
		translateCoordinates = (alphaCoordinates) => {
			return [translateCoordinate(alphaCoordinates.substring(0, 1))
				, translateCoordinate(alphaCoordinates.substring(1, 2))]

		}


	$.coordinateLabels = coordinateLabels
	$.translateCoordinates = translateCoordinates
	/**
	 * @public
	 */
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


		*/

		const m //= options.boardDimensions[0]
			= options.boardDimensions[isVertical ? 1 : 0]

			, r = []

		for (let i = Math.ceil(-(wraparound + a) / m); i <= (wraparound + m - 1 - a) / m; i++)
			r.push(wraparound + a + i * m)
		return r
	}

	// /**
	//  *
	//  * @param {array} r
	//  * @param {boolean} isVertical
	//  *
	//  * @returns {number} Integer a such that projectOnLine(a) equals r
	//  */
	// $.inverseProjectOnLine = function (r, isVertical) {
	// 	const m //= options.boardDimensions[0]
	// 		= options.boardDimensions[isVertical ? 1 : 0]
	// 		, n = options.projectionSettings.wraparound
	// 	for (let i = 0; i < r.length; i++) {
	// 		if (r[i] < n) continue
	// 		if (r[i] >= n + m) continue//not really needed
	// 		return r[i] - n
	// 	}
	// }


	/**
	 * This is the inverse function to the function “projectOnFlat” – at least it is when “multiple” is false.
	 * @param {Array} points The point or array of points projected onto the grid.
	 * @param {Boolean=false} multiple Whether the argument “points” is the image of a single point (“multiple=false”) or of multiple points.
	 * @returns {Array} When the flag “multiple” is flagged, returns an array of points; otherwise returns a single point (i.e. an array of two integers).
	 */
	function inverseProjectOnFlat(points, multiple) {
		if (!Array.isArray(points[0])) points = [points]
		if (!multiple)
			return [modulo(points[0][0] - options.projectionSettings.offset[0] - wraparound, options.boardDimensions[0])
				, modulo(points[0][1] - options.projectionSettings.offset[1] - wraparound, options.boardDimensions[1])]
		return _uniqBy(points.map(x => inverseProjectOnFlat([x])), (x) => `${x[0]}_${x[1]}`)
	}
	$.inverseProjectOnFlat = inverseProjectOnFlat

	/**
	 * Projects a point on the t-Go board to the array of points on the standard grid/board.
	 * @param {Array} p The point in the t-Go board to be projected on to the grid.
	 * @returns {Array}
	 */
	function projectOnFlat(p) {
		const a = $.projectOnLine(p[0] + options.projectionSettings.offset[0])
			, b = $.projectOnLine(p[1] + options.projectionSettings.offset[1])
			, r = []
		for (let i = 0; i < a.length; i++)
			for (let j = 0; j < b.length; j++)
				r.push([a[i], b[j]])
		return r
	}
	$.projectOnFlat = projectOnFlat

	let setUpMarkers = () => {
		$.markersForWraparound = []

		// $.getMarkersForWraparound = function (){
		if (options.projectionSettings.wraparoundMarkersType > 0 && options.projectionSettings.wraparound > 0) {
			const m = options.boardDimensions[0],
				n = options.boardDimensions[1]


			/*
			m: boardDimensions[0] : 11
			n: wraparound : 4
			line: 0,...,(m-1)
			=>
			0,...,(n-1), (start line) n, ... , (n + m - 1) end line,  (n+m), ... , (2n + m - 1)

			*/

			let board = []
			for (let i = 1; i <= m; i++) {
				let label = '─'//U+2500 Box Drawings Light Horizontal
				if (options.projectionSettings.wraparoundMarkersType === 2) {
					label = coordinateLabels(i - 1)
				}
				board.push(coordinateLabels(wraparound - 1 + i) + coordinateLabels(wraparound - 1) + ":" + label)
				board.push(coordinateLabels(wraparound - 1 + i) + coordinateLabels(wraparound + m) + ":" + label)
			}
			for (let i = 1; i <= n; i++) {

				let label = '│'//unicode too
				if (options.projectionSettings.wraparoundMarkersType === 2) {
					label = '' + i
				}
				board.push(coordinateLabels(wraparound - 1) + coordinateLabels(wraparound - 1 + i) + ":" + label)
				board.push(coordinateLabels(wraparound + n) + coordinateLabels(wraparound - 1 + i) + ":" + label)
			}
			//┘  ┌  └ ┐
			board.push(coordinateLabels(wraparound - 1) + coordinateLabels(wraparound + n) + ":└")
			board.push(coordinateLabels(wraparound + m) + coordinateLabels(wraparound + n) + ":┘")
			board.push(coordinateLabels(wraparound - 1) + coordinateLabels(wraparound - 1) + ":┌")
			board.push(coordinateLabels(wraparound + m) + coordinateLabels(wraparound - 1) + ":┐")
			$.markersForWraparound = board
		}
	}
	setUpMarkers()


	$.coords2String =
		/**
		 * converts coordinates to a string
		 */
		function coords2String(coords) {
			return coordinateLabels(coords[0]) + coordinateLabels(coords[1])
		}

	function goThroughTree(state) {
		let { wrappedGame, node, pending, currentPath, tGo } = state
			, nbVariations = wrappedGame.variations().length
		if (currentPath.m > 1000) throw new Error('seem to be stuck!');
		state.hasSiblings = nbVariations > 0
		if (state.hasSiblings) {
			// if(currentPath[m] === undefined)
			// currentPath[m] = 0
			// else
			// currentPath[m] += 1
			// currentPath.m += 1
			for (let i = nbVariations - 1; i > 0; i--)
			//pile up in this order, as it's FILO and we want the last variation, which may contain a mode added by CGoboard to go last
			{
				let pathForLater = Object.assign({}, currentPath)//{...currentPath}
				pathForLater[currentPath.m + 1] = i
				pathForLater.m += 1

				if (tGo !== undefined)
					pending.push({ path: pathForLater, tGoData: tGo.exportData() })
				else
					pending.push({ path: pathForLater })

			}
			state.node = wrappedGame.next().node()
			currentPath[currentPath.m + 1] = 0
			currentPath.m += 1
			return state.node
		}

		let nextNode = wrappedGame.next().node()
		if (node === nextNode) {//at a leaf:
			if (pending.length === 0) {
				state.node = null
				return state.node//finished
			}
			let fromStack = pending.pop()
			state.hasSiblings = true
			// if (fromStack === null) {
			// 	node = null
			// 	return//finished!
			// }
			if (tGo !== undefined) tGo.loadData(fromStack.tGoData)
			state.node = wrappedGame.goTo(fromStack.path).node()
			state.currentPath = fromStack.path
			return state.node
		}
		else {
			currentPath.m += 1
			state.node = nextNode
			return state.node
		}
	}

	/**
	 * Apart from a few details, this is an inverse of the transform function.
	 * @param {smartgame|string} wrappedGame
	 * @param {smartgame} smartgame
	 * @public
	 */
	function inverseTransform(
		wrappedGame, smartgame) {

		if (smartgame === undefined) {
			smartgame = require('smartgame')
		}

		if (typeof wrappedGame === 'string') {
			var smartgamer = require('smartgamer')
			wrappedGame = smartgamer(smartgame.parse(wrappedGame))
		}

		let node = wrappedGame.first().node()
			, pending = []
			, currentPath = { m: 0 }
			, cleanerRegEx = /^[a-zA-Z :0-9\-\(\r\n]+GoVariantsTransformer\)--[\r\n]*/
			, cleanComments = () => {
				if (node.C !== undefined) {
					node.C = node.C.replace(cleanerRegEx, '')
				}
				if (node.C === '')
					delete node.C
			}
			,
			/**
			 * Function to:
			 * 	- remove the “border” (unicode symbols added by the transform to indicate where the wraparound area meets the main grid).
			 * 	- remove CM (colour map) and CT (colour table) which are nonstandard SGF added by CGoboard for background colour (could be interesting to use this feature later on).
			 */
			cleanLabels = () => {

				let labels = []
				if (node.LB !== undefined) {
					labels = node.LB
					if (!Array.isArray(labels))
						labels = [labels]
					labels = labels.filter(i => !$.markersForWraparound.includes(i))
					/* jshint loopfunc: true */
					labels =
						_uniqBy(
							labels
								.map(function (x) { return x.split(':', 2) })//assume the label doesn’t contain “:”
								.map((x) => [$.coords2String($.inverseProjectOnFlat(translateCoordinates(x[0]))), x[1]])
							, (x) => x[0])
							.map((x) => `${x[0]}:${x[1]}`)


					// labels = []
					// for (let i = 0; i < labels2.length; i++)
					// 	labels = labels.concat(labels2)
				}

				node.LB = labels
				if (node.LB.length === 0)
					delete node.LB

				if (node.CM)
					delete node.CM
				if (node.CT)
					delete node.CT
			}

		cleanLabels()
		node.SZ = options.boardDimensions[0]
		node.AP = "go-variants-transformer"

		if (node.SO !== undefined) {
			let cleanSourceRegex = new RegExp(` \\(${sourceSgfMessage}\\)`)
			node.SO = node.SO.replace(cleanSourceRegex, '')
			// if (node.SO === '')
			// 	delete node.SO
		}

		let state = {
			wrappedGame, node, pending, currentPath, siblingMoves: {}//, parentsWithChildToDelete: [] 
		}

		node = goThroughTree(state)
		while (node !== null) {
			cleanLabels()
			cleanComments()

			const
				isBlack = node.AB !== undefined || node.B !== undefined
				, addedStones = isBlack ? node.AB : node.AW
				, playedStone = isBlack ? node.B : node.W
				, move = addedStones ? addedStones : playedStone
				, moveAsArray = Array.isArray(move) ? move : [move]
				, isAPass = isBlack ? node.B === '' : node.W === ''
				, moveHasCoords = move !== undefined && move !== ''
				, coords = !moveHasCoords ? undefined : $.coords2String($.inverseProjectOnFlat(moveAsArray.map(translateCoordinates)))

			//alter the node

			/*
			logic removing a node added by CGoboard, if there already is the same move as AB or AW in a prior variation; assuming 
			the variation to be removed is the last of the siblings - which does seem to be the way CGoboard behaves when a click 
			is made on a point where the next node is AB or AW.  
			*/
			if (state.hasSiblings) {
				let pathForParent = Object.assign({}, wrappedGame.path)
				pathForParent.m--
				delete pathForParent[pathForParent.m]
				pathForParent = wrappedGame.pathTransform(pathForParent)
				// wrappedGame.previous()
				if (state.siblingMoves[pathForParent] === undefined) {
					state.siblingMoves[pathForParent] = []
				}
				if (addedStones) {
					state.siblingMoves[pathForParent].push(coords)
				}
				else
					if (playedStone && state.siblingMoves[pathForParent].indexOf(coords) > -1) {

						// state.parentsWithChildToDelete.push(pathForParent)
						node.XX = "inverseTransformToDelete"
					}
				// wrappedGame.goTo(currentPath)
			}

			delete node[isBlack ? 'AB' : 'AW']
			delete node[isBlack ? 'B' : 'W']
			delete node.CR
			delete node.AE

			if (isAPass) {
				node[isBlack ? 'B' : 'W'] = ''
			}

			if (moveHasCoords) {
				node[isBlack ? 'B' : 'W'] = coords
			}

			;/*note: this next semicolon is needed! */[
				//'CR',todo: add if not marking the move
				'DD', 'MA', 'SL', 'SQ', 'TR'].forEach(function (sgfProperty) {
					// _.map(['DD','MA','SL','SQ','TR'], function(sgfProperty){
					if (node[sgfProperty] === undefined) return
					let points = []
					if (Array.isArray(node[sgfProperty])) {
						points = node[sgfProperty]
					}
					else {
						points = [node[sgfProperty]]
					}
					points =
						$.inverseProjectOnFlat(
							points.map(translateCoordinates), true
						)
							.map($.coords2String)
					node[sgfProperty] = points
				})
			// move to next node
			node = goThroughTree(state)
		}

		// state.parentsWithChildToDelete.forEach((path) => {
		// 	//remove the sgf node
		// 	wrappedGame.goTo(path)
		// 	let sequences = wrappedGame.game.sequences
		// 	let index = _fi(sequences, (seq) => seq.nodes[0].inverseTransformToDelete)
		// 		, tmpI = 0
		// 	while (index > -1) {
		// 		sequences.splice(index, 1)
		// 		index = _fi(sequences, (seq) => seq.nodes[0].inverseTransformToDelete)
		// 		tmpI++
		// 		if (tmpI > 100) throw new Error('seem to be stuck!');
		// 	}

		// 	// console.log(path)
		// })

		let deleteNodes = (sequence) => {
			if (sequence.sequences) {

				let
					sequences = sequence.sequences
					, index = _fi(sequences, (seq) => seq.nodes[0].XX === 'inverseTransformToDelete')
					, tmpI = 0, max = sequences.length
				while (index > -1) {
					sequences.splice(index, 1)
					index = _fi(sequences, (seq) => seq.nodes[0].XX === 'inverseTransformToDelete')
					tmpI++
					if (tmpI > max) throw new Error('seem to be stuck!');
				}
				for (let index2 = 0; index2 < sequences.length; index2++) {
					// deleteNodes(sequences[index2].nodes[sequences[index2].nodes.length - 1]);
					deleteNodes(sequences[index2]);

				}
			}
			else if (sequence.nodes)
				deleteNodes(sequence.nodes[sequence.nodes.length - 1])

		}
		deleteNodes(wrappedGame.game)

		if (options.transformToString)
			return smartgame.generate({ gameTrees: [wrappedGame.game] });
		else return wrappedGame

	}
	$.inverseTransform = inverseTransform

	/**
	 * Main function; converts SGF for a Go variant (so far, just toroidal Go or t-Go).
	 * @param {string} tSgf
	 * @param {object} tGo Engine for counting liberties in t-Go. An instance of go-variants-engine.
	 * @param {*} smartgame
	 * @param {*} smartgamer
	 * @returns {string|object} SGF that can be viewed in a standard SGF viewer. (See `options.transformToString` for the data type of the value returned.)
	 * @public
	 */
	function transform(
		tSgf //eg 11x11 sgf from LittleGolem
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
		let parsed = smartgame.parse(tSgf)
			, wrappedGame = smartgamer(parsed)
			, node = wrappedGame.node()
			, passes = 0
			, pending = []
			, currentPath = { m: 0 }
		if (node.SZ !== undefined) {
			let sz = Number(node.SZ)
			// sz+= 2*options.projectionSettings.wraparound
			options.boardDimensions = [sz, sz]
			tGo.options.boardDimensions = options.boardDimensions
			setUpMarkers()
		}
		node.SZ = "" + (options.boardDimensions[0] + 2 * options.projectionSettings.wraparound)//not sure how to make a rectangular goban!
		let setLabels = () => {
			//node.LB = $.markersForWraparound
			let labels = []
			if (node.LB !== undefined) {
				labels = node.LB
				if (!Array.isArray(labels))
					labels = [labels]

				/* jshint loopfunc: true */
				let labels2 = labels//_.chain(labels)
					.map(function (x) { return x.split(':', 2) })//assume the label doesn’t contain “:”
					.map(function (x) { return [translateCoordinates(x[0]), x[1]] })
					.map(function (x) { return [$.projectOnFlat(x[0]), x[1]] })
				// .value()
				labels = []
				for (let i = 0; i < labels2.length; i++)
					labels = labels.concat(
						labels2[i][0].map(function (x) {
							return $.coords2String(x) + ":" + labels2[i][1]
						})
					)
			}

			node.LB = $.markersForWraparound.concat(labels)
			if (node.LB.length === 0)
				// delete node['LB']
				delete node.LB
		}

		setLabels()

		if (node.SO !== undefined)
			node.SO = wrappedGame.game.nodes[0].SO + ` (${sourceSgfMessage})`
		//else node.SO = sourceSgfMessage//prefer not to add the message when original Sgf has no SO info.

		node.AP = "go-variants-transformer"


		let state = { wrappedGame, node, pending, currentPath, tGo }

		function comment(isPass, isBlack) {
			if (!options.addComments)
				return

			let r = 'move ' + state.currentPath.m + '\n' + 'White stones captured by Black: ' + tGo.board.captured[1] + '\nBlack stones captured by White: ' + tGo.board.captured[0]
			//let r =  'Black captures: ' + tGo.board.captured[1] + '\r\nWhite captures: ' + tGo.board.captured[0]
			if (isPass)
				r += '\n' + (isBlack ? 'Black passes' : 'White passes')
			r += '\n--(the content above was generated automatically by GoVariantsTransformer)--'
			r += (node.C === undefined ? '' : '\n' + node.C)
			node.C = r
			return
		}

		node = goThroughTree(state)
		while (node !== null) {


			let
				isBlack = node.B !== undefined
				, move = isBlack ? node.B : node.W
				, isPass = move === "" || (options.boardDimensions[0] === options.boardDimensions[1]
					&& options.boardDimensions[0] <= 19
					&& move === "tt" //weird SGF[3] way to show a pass move!
				)
			if (move === undefined && !isPass) {
				node = goThroughTree(state)
				continue
			}
			setLabels()

			if (isPass) {
				delete node[isBlack ? 'B' : 'W']
				comment(isPass, isBlack)
				node[isBlack ? 'AB' : 'AW'] = []
				// if (passes === 2) {
				// 	//wrappedGame.game.nodes.splice(i+1)//get rid of nodes afterwards -- may not work with variations! todo
				// 	//todo:score!
				// 	break;//stop after 3 successive passes for now
				// }
				passes++
				if (passes >= 1000)
					break//just in case!
				node = goThroughTree(state)
			}
			else {
				const coords = translateCoordinates(move)
				let playResult = null
				// run move through tGo and update game accordingly
				try {
					playResult = tGo.play(isBlack ? 'b' : 'w', coords)

				} catch (error) {
					if (error.message !== 'point is not empty' /*ignore this - it happens with some sgf from littleGolem. Todo: look into scoring the position here. */)
						throw (error)
				}
				const projectedCoords = $.projectOnFlat(coords)
				let toAdd = playResult === null ? [] : projectedCoords.map($.coords2String)
					, toRemove = playResult === null ? [] :
						// _.chain(playResult.removed)
						// 	.flatten(true)
						// 	.map($.projectOnFlat)
						// 	.flatten(true)
						// 	.map($.coords2String)
						// 	.value()
						_flatten(
							_flatten(playResult.removed)
								.map($.projectOnFlat))
							.map($.coords2String)

				//alter the node
				if (options.addPasses)
					node[isBlack ? 'B' : 'W'] = ''
				else delete node[isBlack ? 'B' : 'W']
				// node[isBlack ? 'B' : 'W'] = ''
				node[isBlack ? 'AB' : 'AW'] = toAdd
				if (toAdd.length > 0)
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

					;/*note this semicolon is needed! */
				[
					//'CR',todo: add if not marking the move
					'DD', 'MA', 'SL', 'SQ', 'TR'].forEach(function (sgfProperty) {
						// _.map(['DD','MA','SL','SQ','TR'], function(sgfProperty){
						if (node[sgfProperty] === undefined) return
						let points = []
						if (Array.isArray(node[sgfProperty])) {
							points = node[sgfProperty]
						}
						else {
							points = [node[sgfProperty]]
						}
						points =
							// _.chain(points)
							// 	.map(translateCoordinates)
							// 	.map($.projectOnFlat)
							// 	.flatten(true)
							// 	.map($.coords2String)
							// 	.value()
							_flatten(
								points
									.map(translateCoordinates)
									.map($.projectOnFlat)
							)
								.map($.coords2String)
						node[sgfProperty] = points
					})
				node.MN = currentPath.m
				// move to next node
				node = goThroughTree(state)
			}
		}
		if (options.transformToString)
			return smartgame.generate({ gameTrees: [wrappedGame.game] });
		else return wrappedGame
	}
	$.transform = transform
	return $

}
module.exports = transformer