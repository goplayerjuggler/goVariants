/* globals module: false, require: false */

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
			expect(transformer.options.projectionSettings.wraparoundMarkersType).toEqual(2)
			expect(transformer.options.boardDimensions).toEqual([11, 11])
			expect(transformer.options.projectionSettings).toEqual({ wraparound: 4, offset: [0, 0], wraparoundMarkersType:2 })
			transformer = require('../src/transformer')({ projectionSettings:{wraparoundMarkersType: 1} })


			expect(transformer.markersForWraparound.sort())
				.toEqual(['de:│', 'pe:│', 'ed:─', 'ep:─', 'df:│', 'pf:│', 'fd:─', 'fp:─',
					'dg:│', 'pg:│', 'gd:─', 'gp:─', 'dh:│', 'ph:│', 'hd:─', 'hp:─', 'di:│', 'pi:│',
					'id:─', 'ip:─', 'dj:│', 'pj:│', 'jd:─', 'jp:─', 'dk:│', 'pk:│', 'kd:─', 'kp:─',
					'dl:│', 'pl:│', 'ld:─', 'lp:─', 'dm:│', 'pm:│', 'md:─', 'mp:─', 'dn:│', 'pn:│',
					'nd:─', 'np:─', 'do:│', 'po:│', 'od:─', 'op:─', 'dp:└', 'pp:┘', 'dd:┌', 'pd:┐'].sort())

			transformer = require('../src/transformer')({ projectionSettings:{wraparoundMarkersType: 0} })
			expect(transformer.markersForWraparound)
				.toEqual([])
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
			//default: assume projection 11x11 to 19x19
			var default_tGo2normal = transformer()
			expect(default_tGo2normal.projectOnFlat([0, 0]))
				.toEqual([[4, 4], [4, 15], [15, 4], [15, 15]])
			expect(default_tGo2normal.projectOnFlat([0, 1]))
				.toEqual([[4, 5], [4, 16], [15, 5], [15, 16]])
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
			expect(default_tGo2normal.projectOnLine(0))
				.toEqual([4, 15])
		})
		it("works with custom settings", function () {
			var custom_tGo2Normal = transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 5 }
				/*
	0 1 2 3 4 | 5 6 7 8 9 | 10 11 12 13 14 			
				*/
			})
			expect(custom_tGo2Normal.projectOnLine(0))
				.toEqual([0, 5, 10])
			expect(custom_tGo2Normal.projectOnLine(2))
				.toEqual([2, 7, 12])
		})
		it("works with custom settings - offset is ignored!", function () {
			var custom_tGo2Normal = transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 5, offset: [1, 2] }
				/*
	0 1 2 3 4 | 5 6 7 8 9 | 10 11 12 13 14 			
				*/
			})
			expect(custom_tGo2Normal.projectOnLine(0))
				.toEqual([0, 5, 10])
		})
		it("works with custom settings #2", function () {
			var custom_tGo2Normal = transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 11 }
				/*
	0 | 1 2 3 4 5 | 6 7 8 9 10 | 11 12 13 14 15 16 | 17 .. 27			
				*/
			})
			expect(custom_tGo2Normal.projectOnLine(0))
				.toEqual([1, 6, 11, 16, 21, 26])
			expect(custom_tGo2Normal.projectOnLine(2))
				.toEqual([3, 8, 13, 18, 23])
		})

	})
	describe("transform & inverseTransform", () => {
		let transform = require('../src/transform')
		it("transform transforms an sgf string to a string or an object (an instance of smartGame); inverseTransform is an inverse", () => {
			let sgf = `(;
FF[4]
CA[UTF-8]
GM[1]
SZ[4]
AP[maxiGos:6.45 (daoqi Ed)]
SO[foo]
;B[ad];W[bd];B[bc];W[ac];B[bb]
;W[aa];B[ab];W[dd])`

			let options = { projectionSettings:{wraparoundMarkersType: 0}, addComments: false }, transformedSgf = transform(sgf, options)

			expect(transformedSgf).toEqual(`(;FF[4]CA[UTF-8]GM[1]SZ[12]AP[go-variants-transformer]SO[foo (source sgf for toroidal Go has been adapted by go-variants-transformer so as to be rendered by any standard Go application)];B[]AB[ad][ah][al][ed][eh][el][id][ih][il]CR[ad][ah][al][ed][eh][el][id][ih][il]MN[1];W[]AW[bd][bh][bl][fd][fh][fl][jd][jh][jl]CR[bd][bh][bl][fd][fh][fl][jd][jh][jl]MN[2];B[]AB[bc][bg][bk][fc][fg][fk][jc][jg][jk]CR[bc][bg][bk][fc][fg][fk][jc][jg][jk]MN[3];W[]AW[ac][ag][ak][ec][eg][ek][ic][ig][ik]CR[ac][ag][ak][ec][eg][ek][ic][ig][ik]MN[4];B[]AB[bb][bf][bj][fb][ff][fj][jb][jf][jj]CR[bb][bf][bj][fb][ff][fj][jb][jf][jj]MN[5];W[]AW[aa][ae][ai][ea][ee][ei][ia][ie][ii]CR[aa][ae][ai][ea][ee][ei][ia][ie][ii]MN[6];B[]AB[ab][af][aj][eb][ef][ej][ib][if][ij]CR[ab][af][aj][eb][ef][ej][ib][if][ij]MN[7];W[]AW[dd][dh][dl][hd][hh][hl][ld][lh][ll]CR[dd][dh][dl][hd][hh][hl][ld][lh][ll]AE[ad][ah][al][ed][eh][el][id][ih][il]MN[8])`)

			let transformer = require('../src/transformer')(options)
			let smartGame = require('smartgame')
				, inverseTransformedSgf = transformer.inverseTransform(transformedSgf, smartGame)
			expect(inverseTransformedSgf).toEqual('(;FF[4]CA[UTF-8]GM[1]SZ[4]AP[go-variants-transformer]SO[foo];MN[1]B[ad];MN[2]W[bd];MN[3]B[bc];MN[4]W[ac];MN[5]B[bb];MN[6]W[aa];MN[7]B[ab];MN[8]W[dd])')

			options.transformToString = false
			transformedSgf = transform(sgf, options)
			expect(transformedSgf.game.nodes.length).toEqual(9)



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
			expect (require('./testInverseTransform2.js').game.sequences[1].sequences.length).toEqual(3)
		})
	})
})