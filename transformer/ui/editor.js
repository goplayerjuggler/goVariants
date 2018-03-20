/* eslint-env browser */
/* global GoBoardApi */
/* eslint no-console: 0 */
document.goVariantsEditor = function (editorOptions) {
	editorOptions = { rootId: 'sgfEditor', showExtras: true, ...editorOptions }
	var { rootId, showExtras } = editorOptions
		, editorTemplate = require('./editor.jsx')
		, go_variants_transformer = require('../src/transformer')
	// document.viewer = {}
	// var viewer = document.viewer
	var viewer = {}
	if (viewer.ran) return
	viewer.ran = true//just run this function once

	document.getElementById(rootId).appendChild(editorTemplate(rootId))

	var getElementByIdSuffix = (suffix) => document.getElementById(rootId + '_' + suffix)


	getElementByIdSuffix('updateButton').addEventListener('click', updateVariantSgf)

		;[].forEach.call(document.querySelectorAll(`#${rootId}_viewerControls input[type=button]`), function (el) {
			el.addEventListener('click', function (e) {
				var target = e.target || e.srcElement
				showBoard({ panningDirection: target.value })
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
		for (let index = 4; index < 20; index++) {
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
		showBoard()
	})

	getElementByIdSuffix('viewerControls').style.display = "none"

	//startup
	var inputSgfNode = document.querySelectorAll(
		// `#${rootId} .go-variants-data:first-of-type`)
		`#${rootId} .go-variants-data`)
	if (inputSgfNode.length > 0) {
		getElementByIdSuffix("sgfIn").value = inputSgfNode[0].innerText

		showBoard()
	}
	else {
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


	function showBoard(options) {
		if (options === undefined) options = {}
		var { tSgf, panningDirection, moveReference, reset } = options
		if (reset || !viewer.offset) viewer.offset = [0, 0]
		if (panningDirection) {
			var right = viewer.offset[0], up = viewer.offset[1]
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
			viewer.offset = [right, up]
		}

		if (tSgf === undefined || tSgf === null) {
			tSgf = getElementByIdSuffix("sgfIn").value
		}
		if (tSgf === '') {
			if (!viewer.warnedEmptySgf) {
				alert('No SGF was entered, so showing a simple sample instead.')
				viewer.warnedEmptySgf = true
			}
			tSgf = '(;GM[1]FF[4]CA[UTF-8]AP[go-variants-transformer]ST[0]SZ[4]KM[0]HA[0]PB[Black]PW[White]C[Here is a small sample game of Toroidal Go. It ends in a seki.];B[ad];W[bd];B[bc];W[ac];B[bb];W[aa];B[ab];W[dd];B[ca];W[cd];B[db];W[dc];B[cc];MA[ba]C[It’s a seki; neither player should play at X now - if they do, they put their own stones in atari. This is shown in the next two variations.]W[da](;B[ba];W[cb])(;B[];W[ba];B[ad]))'//forked from sample7
			getElementByIdSuffix("sgfIn").value = tSgf
		}
		var wraparound = Number(getElementByIdSuffix('wraparoundSelect').value)
			, wraparoundMarkersType = Number(getElementByIdSuffix('wraparoundBorderSelect').value)
			, coordinatesType = Number(getElementByIdSuffix('coordinateSelect').value)
			, addComments = getElementByIdSuffix('addComments').checked
			, sgf = ''
		try {
			var transformer = go_variants_transformer({
				addComments,
				wraparoundMarkersType,
				coordinatesType,
				projectionSettings: {
					offset: viewer.offset,
					wraparound
				}
			})
			sgf = transformer.transform(tSgf)
			getElementByIdSuffix("sgfOut").value = sgf
			viewer.transformer = transformer
		}
		catch (e) {
			alert('an error occurred.')
			return
		}

		viewer.sgf = sgf
		if (!panningDirection) {

			var oGameTree = GoBoardApi.Create_GameTree()
			viewer.oGameTree = oGameTree

			GoBoardApi.Set_OnGameTreeModifiedCallback(oGameTree, () => { })
			GoBoardApi.Toggle_Rulers(oGameTree)
			GoBoardApi.Set_DrawHandicapMarks(oGameTree, false)
			GoBoardApi.Set_CapturingMode(oGameTree, false)

			GoBoardApi.Create_BoardCommentsButtonsNavigator(oGameTree, rootId + '_' + "playerDiv")
			// GoBoardApi.Create_EditorVer(oGameTree, "playerDiv");
			if (moveReference !== undefined)
				GoBoardApi.Load_Sgf(viewer.oGameTree, sgf, undefined, moveReference);
			else
				GoBoardApi.Load_Sgf(oGameTree, sgf);

			GoBoardApi.Set_OnGameTreeModifiedCallback(oGameTree, gameTreeModifiedCallback)

			window.onresize = function () {
				GoBoardApi.Update_Size(oGameTree);
			};


			getElementByIdSuffix('viewerControls').style.display = "inline-block"
			getElementByIdSuffix('updateButtonDiv').style.display = "inline-block"

			if (showExtras) {
				getElementByIdSuffix('transformedSgfFs').style.display = "inline-block"
			}
		}
		else {
			GoBoardApi.Set_OnGameTreeModifiedCallback(viewer.oGameTree, () => { })
			moveReference = GoBoardApi.Get_MoveReference(viewer.oGameTree, false)
			GoBoardApi.Load_Sgf(viewer.oGameTree, sgf, undefined, moveReference)
			GoBoardApi.Set_OnGameTreeModifiedCallback(viewer.oGameTree, gameTreeModifiedCallback)
			getElementByIdSuffix('offsetTr').innerHTML = 'panned: ['
				+ viewer.transformer.modX(viewer.transformer.options.projectionSettings.offset[0])
				+ ', ' + viewer.transformer.modY(-viewer.transformer.options.projectionSettings.offset[1]) + ']'
		}

	}

	function gameTreeModifiedCallback() {
		//when a move is played, the callback is raised twice in quick succession. We want to only do work on the second call.
		if (!viewer.callbackLastCalled) {
			viewer.callbackLastCalled = Date.now()
			return;
		}
		if (Date.now() - viewer.callbackLastCalled < 300) {
			updateVariantSgf()
		}
		else viewer.callbackLastCalled = Date.now()
	}

	function looksLikeSgf(sgf, size) {
		let result = sgf.startsWith('(')
		// && sgf.indexOf('GM[1]') > 0 //SGF LG doesn't!

		if (size) {
			return result && sgf.indexOf(`SZ[${size}]` > 3)
		}
		return result && /SZ\[\d+]/.test(sgf)
	}
	function updateVariantSgf() {
		var sgf = GoBoardApi.Save_Sgf(viewer.oGameTree)
		if (sgf == viewer.sgf) {
			return
		}
		viewer.sgf = sgf
		var moveReference = GoBoardApi.Get_MoveReference(viewer.oGameTree, false)
		// var options = viewer.transformer.options
		// options.boardDimensions = options.boardDimensions.map((x) => x - 2 * options.projectionSettings.wraparound) 
		var tSgf = viewer.transformer.inverseTransform(sgf)
		getElementByIdSuffix("sgfIn").value = tSgf
		showBoard({ tSgf, moveReference })
	}

	function getLittleGolemSgfAndShowBoard() {
		var gameId = getElementByIdSuffix('littleGolemId').value
		if (gameId === '') {
			//gameId = '1860795'
			alert('enter the ID of a game from LittleGolem, e.g. “1860795”')
			return
		}
		gameId = gameId.trim()

		var proxyurl = "https://cors-anywhere.herokuapp.com/"
		var url = `http://littlegolem.net/servlet/sgf/${gameId}/game${gameId}.sgf`
		if (!/^\d+$/g.test(gameId)) {
			alert('invalid ID')
			return
		}
		getElementByIdSuffix('goLgMsg').innerText = 'loading…'
		var myHeaders = new Headers({
			"Content-Type": "application/sgf"
		});
		const failMsg = 'load from littel Golem failed'
		fetch(proxyurl + url, { headers: myHeaders }).then(
			function (response) {
				if (response.status !== 200) {
					console.log('Looks like there was a problem. Status Code: ' + response.status);

					getElementByIdSuffix('goLgMsg').innerText = failMsg
					return;
				}

				// Examine the text in the response
				response.text().then(function (sgf) {
					if (!looksLikeSgf(sgf, 11 /*LG is always 11x11*/)) {
						console.log('invalid SGF. Received:' + sgf)

						getElementByIdSuffix('goLgMsg').innerText = failMsg
						return
					}
					sgf = sgf.replace('SZ[11]', `SZ[11]SO[http://littlegolem.net/jsp/game/game.jsp?gid=${gameId}`)

					getElementByIdSuffix("sgfIn").value = sgf
					showBoard()

					getElementByIdSuffix('goLgMsg').innerText = 'game loaded from Little Golem'
				});
			}
		).catch(function (err) {
			console.log('Fetch Error :-S', err);
		});
	}




}
document.addEventListener('DOMContentLoaded', function () {
	[].forEach.call(document.querySelectorAll('.go-variants-editor'), function (el) {
		var options = { rootId: el.id }
		if (el.classList.contains('go-variants-hide-extras')) {
			options.showExtras = false
		}
		document.goVariantsEditor(options)
	})
})