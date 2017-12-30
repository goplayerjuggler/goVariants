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
			expect(transformer.options.addMarkersForWraparound).toEqual(true)
			expect(transformer.options.boardDimensions).toEqual([11, 11])
			expect(transformer.options.projectionSettings).toEqual({ wraparound: 4, offset: [0, 0] })


			expect(transformer.markersForWraparound)
				.toEqual(['de:│', 'pe:│', 'ed:─', 'ep:─', 'df:│', 'pf:│', 'fd:─', 'fp:─',
					'dg:│', 'pg:│', 'gd:─', 'gp:─', 'dh:│', 'ph:│', 'hd:─', 'hp:─', 'di:│', 'pi:│',
					'id:─', 'ip:─', 'dj:│', 'pj:│', 'jd:─', 'jp:─', 'dk:│', 'pk:│', 'kd:─', 'kp:─',
					'dl:│', 'pl:│', 'ld:─', 'lp:─', 'dm:│', 'pm:│', 'md:─', 'mp:─', 'dn:│', 'pn:│',
					'nd:─', 'np:─', 'do:│', 'po:│', 'od:─', 'op:─', 'dp:└', 'pp:┘', 'dd:┌', 'pd:┐'])

			transformer = require('../src/transformer')({ addMarkersForWraparound: false })
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
			transformerInstance =  transformer({
				boardDimensions: [5, 5],
				projectionSettings: { wraparound: 5, offset:[1,2] }

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
	describe("transform", () => {
		let transform = require('../src/transform')
		it("transforms an sgf string to a string or an object (an instance of smartGame)", () => {
			let sgf = `(;
FF[4]
CA[UTF-8]
GM[1]
SZ[4]
AP[maxiGos:6.45 (daoqi Ed)]
;B[ad];W[bd];B[bc];W[ac];B[bb]
;W[aa];B[ab];W[dd])`
			let transformedSgf = transform(sgf, { addMarkersForWraparound: false, addComments: false })

			expect(transformedSgf).toEqual(`(;FF[4]CA[UTF-8]GM[1]SZ[12]AP[go-variants-transformer];B[]AB[ad][ah][al][ed][eh][el][id][ih][il]CR[ad][ah][al][ed][eh][el][id][ih][il]MN[1];W[]AW[bd][bh][bl][fd][fh][fl][jd][jh][jl]CR[bd][bh][bl][fd][fh][fl][jd][jh][jl]MN[2];B[]AB[bc][bg][bk][fc][fg][fk][jc][jg][jk]CR[bc][bg][bk][fc][fg][fk][jc][jg][jk]MN[3];W[]AW[ac][ag][ak][ec][eg][ek][ic][ig][ik]CR[ac][ag][ak][ec][eg][ek][ic][ig][ik]MN[4];B[]AB[bb][bf][bj][fb][ff][fj][jb][jf][jj]CR[bb][bf][bj][fb][ff][fj][jb][jf][jj]MN[5];W[]AW[aa][ae][ai][ea][ee][ei][ia][ie][ii]CR[aa][ae][ai][ea][ee][ei][ia][ie][ii]MN[6];B[]AB[ab][af][aj][eb][ef][ej][ib][if][ij]CR[ab][af][aj][eb][ef][ej][ib][if][ij]MN[7];W[]AW[dd][dh][dl][hd][hh][hl][ld][lh][ll]CR[dd][dh][dl][hd][hh][hl][ld][lh][ll]AE[ad][ah][al][ed][eh][el][id][ih][il]MN[8])`)

			transformedSgf = transform(sgf, { addMarkersForWraparound: false, addComments: false, transformToString: false })
			expect(transformedSgf.game.nodes.length).toEqual(9)



		})
		it("transforms all 5 samples successfully", () => {

			let path = require('path');
			let fs = require('fs');
			//let appDir = path.dirname(require.main.filename);
			let appDir = process.cwd();
			// expect(appDir).toEqual(`C:				Users\\schonfield_m\\LocalData\\personal\\dev\\goVariants\\transformer`)
			let transform = require('../src/transform')
			for (let i = 1; i < 6; i++) {

				// let filePath = `${appDir}\\sample-${i}.sgf`
				let filePath = path.join(appDir, 'samples', `sample-${i}.sgf`)
				let transformedFile = path.join(appDir, 'samples', `.sample-${i}_transformed.sgf`)
				// expect(filePath).toEqual(`C:				Users\\schonfield_m\\LocalData\\personal\\dev\\goVariants\\transformer\\samples\\sample-${i}.sgf`)
				// fs.unlink(transformedFile)
				// console.log(filePath)
				fs.readFile(filePath, 'utf-8', function (err, sgfData) {
					// if(err)
					//     console.log(err.message)
					// console.log(sgfData)

					fs.writeFile(transformedFile, transform(sgfData), (err) => {
						if (err !== null)
							console.log(err.message)

					})
				});
				// var data = fs.readFileSync(filePath);
				// console.log(data)
				// expect(1).toEqual(1)
			}

		})

	})
})