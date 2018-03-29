/* globals module: false, require: false */
let _iseq = require('lodash/isEqual'),
	_isEqAsSets = (a, b) => {
		if (a.length !== b.length) {
			return false
		}
		for (let index = 0; index < a.length; index++) {
			if (b.findIndex((x) => _iseq(a[index], x)) < 0) return
		}

		return true

	}
describe("transformer", function () {
	'use strict';
	describe("coordinateLabels", function () {
		it("takes an integer i and returns the i'th item in a..z, A..Z", function () {
			var transformer = require('../src/transformer')()
			//assume projection 11x11 to 19x19
			expect(transformer.coordinateLabels(0))
				.toEqual("a")
			expect(transformer.coordinateLabels(51))
				.toEqual("Z")
		})

	})
	describe("markersForWraparound", function () {
		it("has borders, for default settings", function () {
			var transformer = require('../src/transformer')()
			//assume projection 11x11 to 19x19
			expect(transformer.options.wraparoundMarkersType).toEqual(1)
			expect(transformer.options.boardDimensions).toEqual([11, 11])
			expect(transformer.options.projectionSettings).toEqual({ wraparound: 4, offset: [0, 0] })
			transformer = require('../src/transformer')({ wraparoundMarkersType: 1, coordinatesType: 0 })


			expect(transformer.wraparoundAndCoords.sort())
				.toEqual(['de:│', 'pe:│', 'ed:─', 'ep:─', 'df:│', 'pf:│', 'fd:─', 'fp:─',
					'dg:│', 'pg:│', 'gd:─', 'gp:─', 'dh:│', 'ph:│', 'hd:─', 'hp:─', 'di:│', 'pi:│',
					'id:─', 'ip:─', 'dj:│', 'pj:│', 'jd:─', 'jp:─', 'dk:│', 'pk:│', 'kd:─', 'kp:─',
					'dl:│', 'pl:│', 'ld:─', 'lp:─', 'dm:│', 'pm:│', 'md:─', 'mp:─', 'dn:│', 'pn:│',
					'nd:─', 'np:─', 'do:│', 'po:│', 'od:─', 'op:─', 'dp:└', 'pp:┘', 'dd:┌', 'pd:┐'].sort())

			transformer = require('../src/transformer')({ wraparoundMarkersType: 0, coordinatesType: 0 })
			expect(transformer.wraparoundAndCoords)
				.toEqual([])
			transformer = require('../src/transformer')({ wraparoundMarkersType: 0, coordinatesType: 4 })
			expect(transformer.wraparoundAndCoords)
				.toContain('ae:一')
			expect(transformer.wraparoundAndCoords)
				.toContain('ao:十一')
		})

	})
	// describe("default settings", function() {
	var transformer = require('../src/transformer')

	describe("projectOnFlat", function () {
		// beforeEach(function () {					
		// go.board.empty()	go.play('b',[0,0])
		// go.play('w',[0,1])
		// go.play('w',[1,0])
		// });


		it("takes a move on a toroidal board and projects it to a flat board", function () {
			expect(_isEqAsSets([1, 2], [2, 1])).toBe(true)

			//default: assume projection 11x11 to 19x19
			var default_tGo2normal = transformer()
			expect(_isEqAsSets(default_tGo2normal.projectOnFlat([0, 0]), [[4, 4], [4, 15], [15, 4], [15, 15]]))
				.toBe(true)
			expect(_isEqAsSets(default_tGo2normal.projectOnFlat([0, 1]), [[4, 5], [4, 16], [15, 5], [15, 16]]))
				.toBe(true)
			expect(_isEqAsSets(default_tGo2normal.projectOnFlat([0, 5]), [[4,9], [15,9]]))
				.toBe(true)
		})
	})


	describe("inverseProjectOnFlat", function () {
		// beforeEach(function () {					
		// go.board.empty()	go.play('b',[0,0])
		// go.play('w',[0,1])
		// go.play('w',[1,0])
		// });
		it("is an inverse of projectOnFlat", function () {
			//default: assume projection 11x11 to 19x19
			var transformerInstance = transformer()
			expect(transformerInstance.inverseProjectOnFlat([[4, 4], [4, 15], [15, 4], [15, 15]]))
				.toEqual([0, 0])

			expect(transformerInstance.inverseProjectOnFlat(transformerInstance.projectOnFlat([0, 0])))
				.toEqual([0, 0])
			expect(transformerInstance.inverseProjectOnFlat(transformerInstance.projectOnFlat([1, 2])))
				.toEqual([1, 2])

			//mutiple=true
			expect(transformerInstance.inverseProjectOnFlat([
				[4, 4], [4, 15], [15, 4], [15, 15],
				[4, 5], [4, 16], [15, 5], [15, 16]]))
				.toEqual([0, 0], [0, 1])

			transformerInstance = transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 5, offset: [1, 2] }

			})
			expect(transformerInstance.inverseProjectOnFlat(transformerInstance.projectOnFlat([0, 0])))
				.toEqual([0, 0])
			expect(transformerInstance.inverseProjectOnFlat(transformerInstance.projectOnFlat([1, 2])))
				.toEqual([1, 2])
		})
	})

	// describe("inverseProjectOnLine", function () {

	// 	it("works with default settings", function () {
	// 		var default_tGo2normal = transformer()
	// 		//projection 11x11 to 19x19
	// 		expect(default_tGo2normal.inverseProjectOnLine([9]))
	// 			.toEqual(5)
	// 		expect(default_tGo2normal.inverseProjectOnLine([4, 15]))
	// 			.toEqual(0)
	// 	})

	// 	it("works with custom settings", function () {
	// 		var custom_tGo2Normal = transformer({
	// 			boardDimensions: [5, 5],
	// 			projectionSettings: { wraparound: 5 }
	// 			/*
	// 0 1 2 3 4 | 5 6 7 8 9 | 10 11 12 13 14 			
	// 			*/
	// 		})
	// 		expect(custom_tGo2Normal.inverseProjectOnLine([0, 5, 10]))
	// 			.toEqual(0)
	// 		expect(custom_tGo2Normal.inverseProjectOnLine([2, 7, 12]))
	// 			.toEqual(2)
	// 	})
	// 	it("works with custom settings #2", function () {
	// 		var custom_tGo2Normal = transformer({
	// 			boardDimensions: [5, 5],
	// 			projectionSettings: { wraparound: 11 }
	// 			/*
	// 0 | 1 2 3 4 5 | 6 7 8 9 10 | 11 12 13 14 15 16 | 17 .. 27			
	// 			*/
	// 		})
	// 		expect(custom_tGo2Normal.inverseProjectOnLine([1, 6, 11, 16, 21, 26]))
	// 			.toEqual(0)
	// 		expect(custom_tGo2Normal.inverseProjectOnLine([3, 8, 13, 18, 23]))
	// 			.toEqual(2)
	// 	})
	// })
	describe("projectOnLine", function () {

		it("works with default settings", function () {
			var default_tGo2normal = transformer()
			//projection 11x11 to 19x19
			expect(default_tGo2normal.projectOnLine(5))
				.toEqual([9])
			expect(_isEqAsSets(default_tGo2normal.projectOnLine(0), [4, 15]))
				.toBe(true)
		})
		it("works with custom settings", function () {
			var custom_tGo2Normal = transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 5 }
				/*
	0 1 2 3 4 | 5 6 7 8 9 | 10 11 12 13 14 			
				*/
			})
			expect(_isEqAsSets(custom_tGo2Normal.projectOnLine(0), [0, 5, 10]))
				.toBe(true)
			expect(_isEqAsSets(custom_tGo2Normal.projectOnLine(2), [2, 7, 12]))
				.toBe(true)
		})
		it("works with custom settings - offset is ignored!", function () {
			var custom_tGo2Normal = transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 5, offset: [1, 2] }
				/*
	0 1 2 3 4 | 5 6 7 8 9 | 10 11 12 13 14 			
				*/
			})
			expect(_isEqAsSets(custom_tGo2Normal.projectOnLine(0), [0, 5, 10]))
				.toBe(true)
		})
		it("works with custom settings #2", function () {
			var custom_tGo2Normal = transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 11 }
				/*
	0 | 1 2 3 4 5 | 6 7 8 9 10 | 11 12 13 14 15 16 | 17 .. 27			
				*/
			})
			expect(_isEqAsSets(custom_tGo2Normal.projectOnLine(0), [1, 6, 11, 16, 21, 26]))
				.toBe(true)
			expect(_isEqAsSets(custom_tGo2Normal.projectOnLine(2), [3, 8, 13, 18, 23]))
				.toBe(true)
		})

	})
	describe("transform & inverseTransform", () => {
		let transform = require('../src/transform')
		it("transform transforms an sgf string to a string or an object (an instance of smartGame); inverseTransform is an inverse", () => {
			const sgf = `(;
FF[4]
CA[UTF-8]
GM[1]
SZ[4]
AP[maxiGos:6.45 (daoqi Ed)]
SO[foo]
;B[ad];W[bd];B[bc];W[ac];B[bb]
;W[aa];B[ab];W[dd])`

			let options = {
				wraparoundMarkersType: 0
				, coordinatesType: 0
				, addComments: false
				, moveType: 1
				, markLastMove: 'CR'
			}
				, transformedSgf = transform(sgf, options)

			expect(transformedSgf).toEqual(`(;FF[4]CA[UTF-8]GM[1]SZ[12]AP[go-variants-transformer]SO[foo (source sgf for toroidal Go has been adapted by go-variants-transformer so as to be rendered by any standard Go application)];B[]AB[ad][ah][al][ed][eh][el][id][ih][il]CR[ad][ah][al][ed][eh][el][id][ih][il];W[]AW[bd][bh][bl][fd][fh][fl][jd][jh][jl]CR[bd][bh][bl][fd][fh][fl][jd][jh][jl];B[]AB[bc][bg][bk][fc][fg][fk][jc][jg][jk]CR[bc][bg][bk][fc][fg][fk][jc][jg][jk];W[]AW[ac][ag][ak][ec][eg][ek][ic][ig][ik]CR[ac][ag][ak][ec][eg][ek][ic][ig][ik];B[]AB[bb][bf][bj][fb][ff][fj][jb][jf][jj]CR[bb][bf][bj][fb][ff][fj][jb][jf][jj];W[]AW[aa][ae][ai][ea][ee][ei][ia][ie][ii]CR[aa][ae][ai][ea][ee][ei][ia][ie][ii];B[]AB[ab][af][aj][eb][ef][ej][ib][if][ij]CR[ab][af][aj][eb][ef][ej][ib][if][ij];W[]AW[dd][dh][dl][hd][hh][hl][ld][lh][ll]CR[dd][dh][dl][hd][hh][hl][ld][lh][ll]AE[ad][ah][al][ed][eh][el][id][ih][il])`)

			let transformer = require('../src/transformer')({ boardDimensions: [4, 4], ...options })
			let smartGame = require('smartgame')
				, inverseTransformedSgf = transformer.inverseTransform(transformedSgf, smartGame)
			expect(inverseTransformedSgf).toEqual('(;FF[4]CA[UTF-8]GM[1]SZ[4]AP[go-variants-transformer]SO[foo];B[ad];W[bd];B[bc];W[ac];B[bb];W[aa];B[ab];W[dd])')

			options.transformToString = false
			transformedSgf = transform(sgf, options)
			expect(transformedSgf.game.nodes.length).toEqual(9)

			//with default options for moveType (2) and markLastMove ('')
			options = {
				wraparoundMarkersType: 0
				, coordinatesType: 0
				, addComments: false
			}
				, transformedSgf = transform(sgf, options)

			expect(transformedSgf).toEqual(`(;FF[4]CA[UTF-8]GM[1]SZ[12]AP[go-variants-transformer]SO[foo (source sgf for toroidal Go has been adapted by go-variants-transformer so as to be rendered by any standard Go application)];B[eh]AB[ad][al][ah][id][il][ih][ed][el];W[fh]AW[bd][bl][bh][jd][jl][jh][fd][fl];B[fg]AB[bc][bk][bg][jc][jk][jg][fc][fk];W[eg]AW[ac][ak][ag][ic][ik][ig][ec][ek];B[ff]AB[bb][bj][bf][jb][jj][jf][fb][fj];W[ee]AW[aa][ai][ae][ia][ii][ie][ea][ei];B[ef]AB[ab][aj][af][ib][ij][if][eb][ej];W[hh]AW[dd][dl][dh][ld][ll][lh][hd][hl]AE[ad][al][ah][id][il][ih][ed][el][eh])`)
		
			expect(transform(`(;GM[1]FF[4]CA[UTF-8]AP[go-variants-transformer]ST[2]SZ[11];B[fa])`,options)).toEqual(`(;GM[1]FF[4]CA[UTF-8]AP[go-variants-transformer]ST[2]SZ[19];B[je]AB[jp])`)


		})
		it("transforms all samples successfully and transforms back again too", () => {

			const path = require('path')
				, fs = require('fs')
				, appDir = process.cwd()
				, transformer = require('../src/transformer')()
				, transform = transformer.transform
				, inverseTransform = transformer.inverseTransform
				, writeTransformedSgfToFiles = false

			for (let i = 1; i < 8; i++) {

				let filePath = path.join(appDir, 'samples', `sample-${i}.sgf`)
				if (writeTransformedSgfToFiles)
					var transformedFile = path.join(appDir, 'samples', `.sample-${i}_transformed.sgf`)
				fs.readFile(filePath, 'utf-8', function (err, sgfData) {
					if (writeTransformedSgfToFiles) {
						fs.writeFile(transformedFile, inverseTransform(transform(sgfData)), (err) => {
							if (err !== null)
								console.log(err.message)
						})
					}
					else
						transform(sgfData)
				});
			}

		})

	})
	describe("inverseTransform", () => {
		it("gets rid of node.B[xy] if there is a siblingNode.AB[xy]; similarly for W and AW - this is needed to handle clicks at points where the next move is, with CGoBoard", () => {
			let wrappedGame = require('./testInverseTransform.js')
			wrappedGame.first()
			expect(wrappedGame.game.sequences.length).toEqual(3)
			expect(require('./testInverseTransform2.js').game.sequences[1].sequences.length).toEqual(3)
		})
	})
})