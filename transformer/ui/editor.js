/* eslint-env browser */
/* global GoBoardApi */
/* eslint no-console: 0 */
/**
 * A function for rendering the viewer/editor
 * @param {object} [options=]
 * @param {boolean} [options.inhibitForRoot = true] When flagged, the function does nothing when the current window's location.path is empty. (Useful for preventing the script from running when several posts are displayed at the home page of the blog.)
 */
'use strict'
let goVariantsEditor = function (editorOptions) {
	'use strict'
	let callbackLastCalled = Date.now()
		// , disableCallback = false
		,
		oGameTree = null,
		showBoard = null,
		// offset = null,
		// cachedCoordinatesType = null,
		warnedEmptySgf = null,
		boardDisplayed = false,
		wraparoundAndCoords,
		previousWraparound,
		usePreviousWraparound,
		transformerModX,
		transformerModY,
		DataObject = function () {
			let values = {
					sgf: null,
					variantSgf: null,
					moveReference: null,
					offset: [0, 0],
					boardDimensions: [11, 11],
					process: 0
					/*
					0: Δ(variantSgf) ⟼ Δ(sgf)
					1: Δ(sgf) ⟼ Δ(variantSgf)
					*/
				},
				onSgfUpdated0 = null,
				onSgfUpdated1 = null,
				onVariantSgfUpdated = null,
				_updateSgf = (newSgf) => {
					// if (values.sgf !== newSgf) {
					values.sgf = newSgf

					if (values.process === 0 && onSgfUpdated0) {
						onSgfUpdated0() //onSgfUpdated0.call()
					} else
					if (values.process === 1 && onSgfUpdated1) {
						onSgfUpdated1() // onSgfUpdated1.call()
					}

					// }
				},
				_updateVariantSgf = (newVariantSgf) => {
					// if (values.variantSgf !== newVariantSgf) {
					values.variantSgf = newVariantSgf


					if (onVariantSgfUpdated) {
						onVariantSgfUpdated() //onVariantSgfUpdated.call()
					}

					// }
				},
				setCallbacks = (callbacks) => {
					if (callbacks.onVariantSgfUpdated) onVariantSgfUpdated = callbacks.onVariantSgfUpdated

					if (callbacks.onSgfUpdated0) onSgfUpdated0 = callbacks.onSgfUpdated0
					if (callbacks.onSgfUpdated1) onSgfUpdated1 = callbacks.onSgfUpdated1
				},
				getValues = () => {
					return values
				},
				setValue = (name, value) => {
					switch (name) {
						case "sgf":
							_updateSgf(value)
							break;
						case "variantSgf":
							_updateVariantSgf(value)
							break;
						case "moveReference":
							values.moveReference = value
							break;

						case "boardDimensions":
							values.boardDimensions = value
							break;
						case "offset":
							values.offset = value
							// if (onVariantSgfUpdated) {
							// 	onVariantSgfUpdated()
							// }
							break;
						case "process":
							values.process = value
							break;
					}

				}
			return {
				getValues,
				setValue,
				setCallbacks
			}

		}(),
		nullFunction = () => {},
		onGameTreeModifiedCallback = () => {
			// console.log('log onGameTreeModifiedCallback' + debugCounter++)
			//when a move is played, the updateVariantSgf is raised twice in quick succession. We want to only do work on the second call.
			// if (disableCallback) return

			if (!callbackLastCalled) {
				callbackLastCalled = Date.now()
				return;
			}
			if ((Date.now() - callbackLastCalled < 300)) {
				getSgfFromBoard()
				// // oGameTree = null
				// let tSgf = transformer.inverseTransform(sgf)
				// getElementByIdSuffix("sgfIn").value = tSgf
				// showBoard({ tSgf, moveReference })
			} else callbackLastCalled = Date.now()

		},
		getSgfFromBoard = () => {
			let newSgf = GoBoardApi.Save_Sgf(oGameTree)
			// if (newSgf == sgf) {
			// 	return
			// }
			// sgf = newSgf
			let moveReference = GoBoardApi.Get_MoveReference(oGameTree, false)
			DataObject.setValue("moveReference", moveReference)
			DataObject.setValue("process", 1)
			DataObject.setValue("sgf", newSgf)
		},
		updateBoard = () => {
			console.log('updateBoard')
			// if (DataObject.getValues().process === 0) {
			getElementByIdSuffix("sgfOut").value = DataObject.getValues().sgf


			let firstTime = (oGameTree === null)

			if (firstTime) {
				oGameTree = GoBoardApi.Create_GameTree()


				GoBoardApi.Set_DrawHandicapMarks(oGameTree, false)
				GoBoardApi.Set_CapturingMode(oGameTree, false)
				GoBoardApi.Create_BoardCommentsButtonsNavigator(oGameTree, rootId + '_' + "playerDiv")
				window.onresize = function () {
					GoBoardApi.Update_Size(oGameTree);
				}
				// GoBoardApi.Toggle_Rulers(oGameTree)
			} else GoBoardApi.Set_OnGameTreeModifiedCallback(oGameTree, nullFunction)

			// setUpCallback(viewer, oGameTree)
			// GoBoardApi.Create_EditorVer(oGameTree, "playerDiv");
			if (DataObject.getValues().moveReference !== undefined)
				GoBoardApi.Load_Sgf(oGameTree, DataObject.getValues().sgf, undefined, DataObject.getValues().moveReference);
			else
				GoBoardApi.Load_Sgf(oGameTree, DataObject.getValues().sgf);
			// if (firstTime) {
			// 	// window.setTimeout(()=>{
			// 		GoBoardApi.Toggle_Rulers(oGameTree)
			// 	// }, 200) 
			// }

			// 	GoBoardApi.Toggle_Rulers(oGameTree)
			// 	GoBoardApi.Set_DrawHandicapMarks(oGameTree, false)
			// 	GoBoardApi.Set_CapturingMode(oGameTree, false)
			// 	GoBoardApi.Create_BoardCommentsButtonsNavigator(oGameTree, rootId + '_' + "playerDiv")
			// 	window.onresize = function () {
			// 		GoBoardApi.Update_Size(oGameTree);
			// }
			// }
			// setUpCallback(viewer, oGameTree)
			// disableCallback = false
			GoBoardApi.Set_OnGameTreeModifiedCallback(oGameTree, onGameTreeModifiedCallback)
			// return
			// }

		}

	// ,
	// setUpCallback = (viewer, oGameTree//, clear
	// ) => {
	// 	// if (clear)
	// 	// 	GoBoardApi.Set_OnGameTreeModifiedCallback(oGameTree, () => { })
	// 	// else
	// 	GoBoardApi.Set_OnGameTreeModifiedCallback(oGameTree, updateVariantSgf(viewer))
	// }


	editorOptions = {
		rootId: 'sgfEditor',
		showExtras: true,
		inhibitForRoot: true,
		...editorOptions
	}
	let {
		rootId,
		showExtras
	} = editorOptions, editorTemplate = require('./editor.jsx'), go_variants_transformer = require('../src/transformer'), getElementByIdSuffix = (suffix) => document.getElementById(rootId + '_' + suffix),
		getTransformer = (useWraparoundAndCoords) => {
			let wraparound = Number(getElementByIdSuffix('wraparoundSelect').value),
				wraparoundMarkersType = Number(getElementByIdSuffix('wraparoundBorderSelect').value),
				coordinatesType = Number(getElementByIdSuffix('coordinateSelect').value),
				addComments = getElementByIdSuffix('addComments').checked,
				values = DataObject.getValues(),
				offset = values.offset,
				boardDimensions = values.boardDimensions
			// if (coordinatesType > 0) wraparound++
			let args = {
				boardDimensions,
				addComments,
				wraparoundMarkersType,
				coordinatesType,
				projectionSettings: {
					offset,
					wraparound
				}
			}
			if (useWraparoundAndCoords)
				args.wraparoundAndCoords = wraparoundAndCoords

			if (usePreviousWraparound)
				args.projectionSettings.wraparound = previousWraparound

			previousWraparound = wraparound

			let result = go_variants_transformer(args)
			transformerModX = result.modX
			transformerModY = result.modY
			return result
		}

	DataObject.setCallbacks({
		onSgfUpdated1: () => {
			console.log('onSgfUpdated1')
			let transformer = getTransformer(true),
				variantSgf = transformer.inverseTransform(DataObject.getValues().sgf)
			DataObject.setValue("process", 0)
			DataObject.setValue("variantSgf", variantSgf)

		},
		onSgfUpdated0: updateBoard,

		onVariantSgfUpdated: () => {

			console.log('onVariantSgfUpdated')
			let values = DataObject.getValues()
			getElementByIdSuffix("sgfIn").value = values.variantSgf
			let transformer = getTransformer()
			let sgf = transformer.transform(values.variantSgf)
			wraparoundAndCoords = transformer.wraparoundAndCoords
			DataObject.setValue("boardDimensions", transformer.options.boardDimensions)
			DataObject.setValue("sgf", sgf)
		}
	})

	showBoard = (options) => {
		if (options === undefined) options = {}
		let {
			tSgf,
			panningDirection,
			// moveReference,
			reset
		} = options
		let offset = DataObject.getValues().offset
		if (reset || !offset) offset = [0, 0]
		if (panningDirection) {
			let right = offset[0],
				up = offset[1]
			switch (panningDirection) {

				case "↑":
					{
						up--
						break
					}

				case "↓":
					{
						up++
						break
					}
				case "←":
					{
						right--
						break
					}

				case "→":
					{
						right++
						break
					}
			}
			offset = [right, up]

			DataObject.setValue("moveReference", GoBoardApi.Get_MoveReference(oGameTree, false))
			DataObject.setValue("process", 0)
			DataObject.setValue("offset", offset)
			DataObject.setValue("variantSgf", DataObject.getValues().variantSgf)

		}

		if (tSgf === undefined || tSgf === null) {
			tSgf = getElementByIdSuffix("sgfIn").value
		}
		if (tSgf === '') {
			if (!warnedEmptySgf) {
				alert('No SGF was entered, so showing a simple sample instead.')
				warnedEmptySgf = true
			}
			tSgf = '(;GM[1]FF[4]CA[UTF-8]AP[go-variants-transformer]ST[0]SZ[4]KM[0]HA[0]PB[Black]PW[White]C[Here is a small sample game of Toroidal Go. It ends in a seki.];B[ad];W[bd];B[bc];W[ac];B[bb];W[aa];B[ab];W[dd];B[ca];W[cd];B[db];W[dc];B[cc];MA[ba]C[It’s a seki; neither player should play at X now - if they do, they put their own stones in atari. This is shown in the next two variations.]W[da](;B[ba];W[cb])(;B[];W[ba];B[ad]))' //forked from sample7

		}

		DataObject.setValue("variantSgf", tSgf)
		// let wraparound = Number(getElementByIdSuffix('wraparoundSelect').value)
		// 	, wraparoundMarkersType = Number(getElementByIdSuffix('wraparoundBorderSelect').value)
		// 	, coordinatesType = Number(getElementByIdSuffix('coordinateSelect').value)
		// 	, addComments = getElementByIdSuffix('addComments').checked
		// try {
		// 	transformer = go_variants_transformer({
		// 		addComments,
		// 		wraparoundMarkersType,
		// 		coordinatesType,
		// 		projectionSettings: {
		// 			offset,
		// 			wraparound
		// 		}
		// 	})
		// 	sgf = transformer.transform(tSgf)
		// 	getElementByIdSuffix("sgfOut").value = sgf

		// }
		// catch (e) {
		// 	alert('an error occurred.')
		// 	return
		// }

		if (!boardDisplayed) {
			getElementByIdSuffix('viewerControls').style.display = "inline-block"
			getElementByIdSuffix('updateButtonDiv').style.display = "inline-block"

			if (showExtras) {
				getElementByIdSuffix('transformedSgfFs').style.display = "inline-block"
			}
			boardDisplayed = true

		}
		if (panningDirection) {
			// setUpCallback(viewer, oGameTree, true)
			// disableCallback = true

			// moveReference = GoBoardApi.Get_MoveReference(oGameTree, false)
			// GoBoardApi.Load_Sgf(oGameTree, sgf, undefined, moveReference)
			// // setUpCallback(viewer, oGameTree)
			// disableCallback = false
			let offset = DataObject.getValues().offset
			getElementByIdSuffix('offsetTr').innerHTML = 'panned: [' +
				transformerModX(offset[0]) +
				', ' + transformerModY(-offset[1]) + ']'
		}

	}
	// if (viewer.ran) return
	// viewer.ran = true//just run this function once
	///ok
	//startup
	let optionsNode = document.querySelectorAll(
		`#${rootId} .go-variants-options`)
	if (optionsNode.length > 0) {
		let options = JSON.parse(optionsNode[0].innerText)
		editorOptions = { ...editorOptions,
			...options
		}
	}
	if (editorOptions.inhibitForRoot && location.pathname === '') return

	document.getElementById(rootId).appendChild(editorTemplate(editorOptions))

	getElementByIdSuffix('updateButton').addEventListener('click', () => {
		usePreviousWraparound = true
		getSgfFromBoard()
		usePreviousWraparound = false
	})

	;
	[].forEach.call(document.querySelectorAll(`#${rootId}_viewerControls input[type=button]`), function (el) {
		el.addEventListener('click', function (e) {
			let target = e.target || e.srcElement
			showBoard({
				panningDirection: target.value
			})
		})
	})

	if (showExtras) {
		[].forEach.call(document.querySelectorAll(`#${rootId} .go-variants-extras`), function (el) {
			el.style.display = 'inline-block'
		})

		// ;/*another semicolon that's needed...*/[].forEach.call(document.querySelectorAll(`#${rootId} fieldset.go-variants-extras`), function (el) {
		// 	el.style.display = 'inline-block'
		// })


		let select = getElementByIdSuffix('sizeSelect')
		for (var index = 4; index < 20; index++) {
			const option = document.createElement('option')
			option.value = '' + index
			option.appendChild(document.createTextNode(index))
			select.appendChild(option)
		}

	} else {
		[].forEach.call(document.querySelectorAll(`#${rootId} .go-variants-extras`), function (el) {
			//el.parentNode.removeChild(el)
			el.style.display = 'none'
		})
	}

	getElementByIdSuffix('goButton').addEventListener('click', function () {
		showBoard()
	})
	getElementByIdSuffix('goLgButton').addEventListener('click', function () {
		getLittleGolemSgfAndShowBoard()
	})
	getElementByIdSuffix('newButton').addEventListener('click', function () {
		getElementByIdSuffix("sgfIn").value = `(;GM[1]FF[4]AP[go-variants-transformer]SZ[${getElementByIdSuffix('sizeSelect').value}])`
		DataObject.setValue('offset', [0, 0])
		showBoard()
	})

	getElementByIdSuffix('viewerControls').style.display = "none"

	//startup
	let inputSgfNode = document.querySelectorAll(
		// `#${rootId} .go-variants-data:first-of-type`)
		`#${rootId} .go-variants-data`)
	if (inputSgfNode.length > 0) {
		getElementByIdSuffix("sgfIn").value = inputSgfNode[0].innerText

		showBoard()
	} else {
		let params = new URLSearchParams((new URL(window.location)).search.slice(1))
		if (params.has('sgf')) {
			let sgf = params.get('sgf')
			if (looksLikeSgf(sgf)) {
				getElementByIdSuffix("sgfIn").value = sgf
				showBoard()
			}
		} else if (params.has('littlegolemid')) {
			let id = params.get('littlegolemid')
			if (/^\d+$/g.test(id)) {
				getElementByIdSuffix('littleGolemId').value = id
				getLittleGolemSgfAndShowBoard()
			}
		}
	}


	function looksLikeSgf(sgf, size) {
		let result = sgf.startsWith('(')
		// && sgf.indexOf('GM[1]') > 0 //SGF LG doesn't!

		if (size) {
			return result && sgf.indexOf(`SZ[${size}]` > 3)
		}
		return result && /SZ\[\d+]/.test(sgf)
	}


	function getLittleGolemSgfAndShowBoard() {
		let gameId = getElementByIdSuffix('littleGolemId').value
		if (gameId === '') {
			//gameId = '1860795'
			alert('enter the ID of a game from LittleGolem, e.g. “1860795”')
			return
		}
		gameId = gameId.trim()

		let proxyurl = "https://cors-anywhere.herokuapp.com/"
		let url = `http://littlegolem.net/servlet/sgf/${gameId}/game${gameId}.sgf`
		if (!/^\d+$/g.test(gameId)) {
			alert('invalid ID')
			return
		}
		getElementByIdSuffix('goLgMsg').innerText = 'loading…'
		let myHeaders = new Headers({
			"Content-Type": "application/sgf"
		});
		const failMsg = 'load from littel Golem failed'
		fetch(proxyurl + url, {
			headers: myHeaders
		}).then(
			function (response) {
				if (response.status !== 200) {
					console.log('Looks like there was a problem. Status Code: ' + response.status);

					getElementByIdSuffix('goLgMsg').innerText = failMsg
					return;
				}

				// Examine the text in the response
				response.text().then(function (sgf) {
					if (!looksLikeSgf(sgf, 11 /*LG is always 11x11*/ )) {
						console.log('invalid SGF. Received:' + sgf)

						getElementByIdSuffix('goLgMsg').innerText = failMsg
						return
					}
					sgf = sgf.replace('SZ[11]', `SZ[11]SO[http://littlegolem.net/jsp/game/game.jsp?gid=${gameId}`)

					// getElementByIdSuffix("sgfIn").value = sgf
					// showBoard()

					getElementByIdSuffix('goLgMsg').innerText = 'game loaded from Little Golem'
					DataObject.setValue('offset', [0, 0])
					DataObject.setValue("variantSgf", sgf)
				});
			}
		).catch(function (err) {
			console.log('Fetch Error :-S', err);
		});
	}




}
document.goVariantsEditor = goVariantsEditor
document.addEventListener('DOMContentLoaded', function () {

	window.localStorage.setItem('HTMLGoBoardRulers', '');
	[].forEach.call(document.querySelectorAll('.go-variants-editor'), function (el) {
		let options = {
			rootId: el.id
		}
		if (el.classList.contains('go-variants-hide-extras')) {
			options.showExtras = false
		}
		document.goVariantsEditor(options)
	})
})