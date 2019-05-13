/* globals module: false, require: false */

var goEngine = require('../src/engine')
describe("engine", function () {
	'use strict';
	var go;


	describe("board", function () {
		describe("setup (boardMode:c; boardDimensions:19x19)", function () {

			beforeEach(function () {
				go = goEngine({ boardMode: 'c', boardDimensions: [19, 19] })
			});
			describe("getNeighbours(0,0)", function () {
				var neighboursResult;

				beforeEach(function () {
					neighboursResult = go.board.getNeighbours([0, 0])
				});
				it("should be equal to [[1,0],[0,1]]", function () {
					expect(neighboursResult).toEqual([[1, 0], [0, 1]])
				})

			});
			describe("getNeighbours(2,2)", function () {
				var neighboursResult;

				beforeEach(function () {
					neighboursResult = go.board.getNeighbours([2, 2])
				});
				it("is an array of length 4 containing points 2-3, 2-1, 1-2 and 3-2", function () {
					expect(Object.prototype.toString.call(neighboursResult)).toBe("[object Array]")
					expect(neighboursResult).toContain([2, 3])
					expect(neighboursResult).toContain([2, 1])
					expect(neighboursResult).toContain([1, 2])
					expect(neighboursResult).toContain([3, 2])
					expect(neighboursResult.length).toEqual(4)
				})
			});

			describe("getColour", function () {

				it("returns the colour of a point", function () {
					go.board.blackStones = [[0, 0]]
					expect(go.board.getColour([0, 0])).toEqual('b')
					go.board.blackStones = []
					go.board.whiteStones = [[0, 0]]
					expect(go.board.getColour([0, 0])).toEqual('w')
					expect(go.board.getColour([0, 1])).toEqual('e')
				});
			});
			describe("chainHasLiberty", function () {

				it("says one stone has a liberty", function () {
					// go.board.blackStones = [[2,2]]
					expect(go.board.chainHasLiberty([2, 2], 'b')).toBe(true)
					expect(go.board.chainHasLiberty([2, 2], 'w')).toBe(true)
				});
				it("says a11 has no liberties when a12 a21 are of the opposite colour; it has a liberty when it's part of a chain a11 a12 a21", function () {
					go.board.blackStones = [[0, 1], [1, 0]]
					expect(go.board.chainHasLiberty([0, 0], 'w')).toEqual([[0, 0]])
					expect(go.board.chainHasLiberty([0, 0], 'b')).toBe(true)
					go.board.whiteStones = [[0, 1], [1, 0]]
					go.board.blackStones = []
					expect(go.board.chainHasLiberty([0, 0], 'b')).toEqual([[0, 0]])
					expect(go.board.chainHasLiberty([0, 0], 'w')).toBe(true)
				});
			});


			describe("play", function () {

				beforeEach(function () {
					go.board.empty()
				});
				it("places stones", function () {
					go.play('b', [0, 0])
					expect(go.board.blackStones).toEqual([[0, 0]])
					go.play('w', [0, 1])
					expect(go.board.whiteStones).toEqual([[0, 1]])
				});
				it("may remove stones; when it does it \n" +
					" -updates the tally of captured stones \n" +
					// " -records the move in the internal list of moves\n"+ 
					" -returns all chains removed due to the move", function () {
						expect(go.board.captured[1]).toEqual(0)
						// expect(go.moves.length).toEqual(0)
						var r = go.play('b', [0, 0])
						// expect(go.moves.length).toEqual(1)
						expect(r.removed.length).toEqual(0)
						go.play('w', [0, 1])
						// expect(go.moves.length).toEqual(2)
						r = go.play('w', [1, 0])
						// expect(go.moves.length).toEqual(3)
						expect(go.board.whiteStones).toEqual([[0, 1], [1, 0]])
						expect(go.board.blackStones).toEqual([])
						expect(go.board.captured[0]).toEqual(1)
						expect(r.removed).toEqual([[[0, 0]]])

						go.board.whiteStones = [[1, 0], [1, 1], [0, 1]]
						go.board.blackStones = [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]]
						expect(go.board.captured[1]).toEqual(0)
						r = go.play('b', [0, 0])
						expect(go.board.whiteStones).toEqual([])
						expect(go.board.captured[1]).toEqual(3)

						expect(r.removed).toEqual([[[1, 0], [1, 1], [0, 1]]])
					});

				it("may be “suicide”", function () {
					go.board.whiteStones = [[0, 1], [1, 0]]
					go.play('b', [0, 0])

					expect(go.board.whiteStones).toEqual([[0, 1], [1, 0]])
					expect(go.board.blackStones).toEqual([])
					expect(go.board.captured[0]).toEqual(1)
					//throw
					go = goEngine({ boardMode: 'c', rules: { suicide: false } })

					go.board.whiteStones = [[0, 1], [1, 0]]
					expect(function () { go.play('b', [0, 0]) }).toThrowError('suicide')
				});
			});

			describe("score", function () {
				it("returns dame", function () {
					//two moves; all is dame
					go.board.whiteStones = [[0, 1]]
					go.board.blackStones = [[1, 0]]
					var x = go.board.score()
					expect(x.dame.length).toEqual(361 - 2)
				})
				it("returns territory & dame", function () {
					//white territory + dame
					go.board.whiteStones = [[0, 1], [1, 0]]
					go.board.blackStones = [[1, 1]]
					var x = go.board.score()
					expect(x.dame.length).toEqual(361 - 4)
					expect(x.whiteEmpty).toEqual([[0, 0]])
					expect(x.blackEmpty).toEqual([])
					//two corners
					go.board.whiteStones = [[0, 1], [1, 0]]
					go.board.blackStones = [[0, 17], [1, 18]]
					x = go.board.score()
					expect(x.whiteEmpty).toEqual([[0, 0]])
					expect(x.blackEmpty).toEqual([[0, 18]])
					expect(x.dame.length).toEqual(361 - 3 - 3)

					//just white territory
					go.board.whiteStones = [[0, 1], [1, 0]]
					go.board.blackStones = []
					x = go.board.score()
					expect(x.dame.length).toEqual(0)
					expect(x.whiteEmpty.length).toEqual(361 - 2)
					expect(x.blackEmpty).toEqual([])
					expect(x.blackDead).toEqual([])
				})

				it("returns territory, dame and dead stones", function () {
					//one dead black stone ⇒ all white territory
					go.board.whiteStones = []
					go.board.blackStones = [[1, 1]]
					var x = go.board.score([[1, 1]])//stone marked as dead 
					expect(x.dame.length).toEqual(0)
					expect(x.whiteEmpty.length).toEqual(361)
					expect(x.blackEmpty).toEqual([])
					expect(x.blackDead).toEqual([[1, 1]])

					//white territory + 1 dead stone
					go.board.whiteStones = [[0, 1], [1, 0]]
					go.board.blackStones = [[1, 1]]
					x = go.board.score([[1, 1]])//mark the black stone as dead
					expect(x.dame.length).toEqual(0)
					expect(x.whiteEmpty.length).toEqual(361 - 2)
					expect(x.blackEmpty).toEqual([])
					expect(x.blackDead).toEqual([[1, 1]])
				})

			}
			)

		})


		describe("toroidal boardMode", function () {

			beforeEach(function () {
				go = goEngine()
			});
			describe("getNeighbours", function () {

				describe("getNeighbours(2,2)", function () {
					var neighboursResult;

					beforeEach(function () {
						neighboursResult = go.board.getNeighbours([2, 2])
					});
					it("is an array of length 4 containing points 2-3, 2-1, 1-2 and 3-2", function () {
						expect(Object.prototype.toString.call(neighboursResult)).toBe("[object Array]")
						expect(neighboursResult).toContain([2, 3])
						expect(neighboursResult).toContain([2, 1])
						expect(neighboursResult).toContain([1, 2])
						expect(neighboursResult).toContain([3, 2])
						expect(neighboursResult.length).toEqual(4)
					})
				});
				describe("getNeighbours(0,0)", function () {
					var neighboursResult;

					beforeEach(function () {
						neighboursResult = go.board.getNeighbours([0, 0])
					});
					it("is an array of length 4 containing points 0-1, 1-0, 10-0 and 0-10", function () {
						expect(Object.prototype.toString.call(neighboursResult)).toBe("[object Array]")
						expect(neighboursResult).toContain([0, 1])
						expect(neighboursResult).toContain([1, 0])
						expect(neighboursResult).toContain([10, 0])
						expect(neighboursResult).toContain([0, 10])
						expect(neighboursResult.length).toEqual(4)
					})
				});

			});

			describe("chainHasLiberty", function () {

				beforeEach(function () {
					go.board.blackStones = []
					go.board.whiteStones = []
				});
				it("says one stone has a liberty", function () {
					// go.board.blackStones = [[2,2]]
					expect(go.board.chainHasLiberty([2, 2], 'b')).toBe(true)
					expect(go.board.chainHasLiberty([2, 2], 'w')).toBe(true)
				});
				it("says a11 has a liberty when a12 a21 are of the opposite colour; it has a liberty when it's part of a chain a11 a12 a21", function () {
					go.board.blackStones = [[0, 1], [1, 0]]
					expect(go.board.chainHasLiberty([0, 0], 'w')).toBe(true)
					expect(go.board.chainHasLiberty([0, 0], 'b')).toBe(true)
				});
				it("(as previous with swapped colours)", function () {
					go.board.whiteStones = [[0, 1], [1, 0]]
					expect(go.board.chainHasLiberty([0, 0], 'b')).toBe(true)
					expect(go.board.chainHasLiberty([0, 0], 'w')).toBe(true)
				});
				it("says a11 has no liberty when surrounded by stones of oppposite colour but has liberties when surrounded by stones of same colour ", function () {
					go.board.whiteStones = [[0, 1], [1, 0], [10, 0], [0, 10]]
					expect(go.board.chainHasLiberty([0, 0], 'b')).toEqual([[0, 0]])
					expect(go.board.chainHasLiberty([0, 0], 'w')).toBe(true)
				});
			});

			describe("play", function () {

				beforeEach(function () {
					go.board.empty()
				});
				it("places stones", function () {
					go.play('b', [0, 0])
					expect(go.board.blackStones).toEqual([[0, 0]])
					go.play('w', [0, 1])
					expect(go.board.whiteStones).toEqual([[0, 1]])
				});
				it("may remove stones; when it does it \n" +
					" -updates the tally of captured stones \n" +
					// " -records the move in the internal list of moves\n"+ 
					" -returns all chains removed due to the move", function () {
						expect(go.board.captured[1]).toEqual(0)
						// expect(go.moves.length).toEqual(0)
						var r = go.play('b', [0, 0])
						// expect(go.moves.length).toEqual(1)
						expect(r.removed.length).toEqual(0)
						go.play('w', [0, 1])
						// expect(go.moves.length).toEqual(2)
						r = go.play('w', [1, 0])
						// expect(go.moves.length).toEqual(3)
						expect(r.removed.length).toEqual(0)
						r = go.play('w', [10, 0])
						expect(r.removed.length).toEqual(0)
						r = go.play('w', [0, 10])
						expect(r.removed.length).toEqual(1)
						expect(r.removed).toEqual([[[0, 0]]])

						r = go.play('w', [0, 0])
						expect(r.removed.length).toEqual(0)

					});

				it("may be “suicide”", function () {
					go.board.whiteStones = [[0, 1], [1, 0], [10, 0], [0, 10]]
					var r = go.play('b', [0, 0])

					expect(go.board.whiteStones).toEqual([[0, 1], [1, 0], [10, 0], [0, 10]])
					expect(go.board.blackStones).toEqual([])
					expect(go.board.captured[0]).toEqual(1)

					expect(r.removed).toEqual([])
					expect(r.suicide).toEqual([[0, 0]])
					// //throw
					// go = goEngine({boardMode:'t', rules:{suicide:false}})

					// expect(function() {go.play('b',[0,0])}).toThrowError('suicide')
				});
			});
			describe("score", function () {
				it("returns dame", function () {
					//two moves; all is dame
					go.board.whiteStones = [[0, 1]]
					go.board.blackStones = [[1, 0]]
					var x = go.board.score()
					expect(x.dame.length).toEqual(121 - 2)
				})
				it("returns territory & dame", function () {
					//white territory + dame
					go.board.whiteStones = [[0, 1], [1, 0], [10, 0], [0, 10]]
					go.board.blackStones = [[1, 1]]
					var x = go.board.score()
					expect(x.dame.length).toEqual(121 - 6)
					expect(x.whiteEmpty).toEqual([[0, 0]])
					expect(x.blackEmpty).toEqual([])

					//just white territory
					go.board.whiteStones = [[0, 1], [1, 0], [10, 0], [0, 10]]
					go.board.blackStones = []
					x = go.board.score()
					expect(x.dame.length).toEqual(0)
					expect(x.whiteEmpty.length).toEqual(121 - 4)
					expect(x.blackEmpty).toEqual([])
					expect(x.blackDead).toEqual([])
				})

				it("returns territory, dame and dead stones", function () {
					//one dead black stone ⇒ all white territory
					go.board.whiteStones = []
					go.board.blackStones = [[1, 1]]
					let x = go.board.score([[1, 1]])//stone marked as dead 
					expect(x.dame.length).toEqual(0)
					expect(x.whiteEmpty.length).toEqual(121)
					expect(x.blackEmpty).toEqual([])
					expect(x.blackDead).toEqual([[1, 1]])

					//white territory + 1 dead stone

					go.board.whiteStones = [[0, 1], [1, 0], [10, 0], [0, 10]]
					go.board.blackStones = [[1, 1]]
					x = go.board.score([[1, 1]])//mark the black stone as dead
					expect(x.dame.length).toEqual(0)
					expect(x.whiteEmpty.length).toEqual(121 - 4)
					expect(x.blackEmpty).toEqual([])
					expect(x.blackDead).toEqual([[1, 1]])
				})
				var smartGame, transformer;
		try {
			smartGame = require('../../transformer/node_modules/smartgame')
			transformer = require('../../transformer/src/transformer')()
		} catch (error) {
			var msg = "some tests scoring were not run because govariants-transformer is not present"
			it(msg, () => { })
			console.log(msg)
			return
		}
				it("handles marks that aren't dead stones", () => {
					let sgf = `(;GM[1]FF[4]CA[UTF-8]AP[go-variants-transformer]ST[0]SZ[4]KM[0]HA[0]PB[Black]PW[White]C[Here is a small sample game of Toroidal Go. It ends in a seki.];B[ad];W[bd];B[bc];W[ac];B[bb];W[aa];B[ab];W[dd];B[ca];W[cd];B[db];W[dc];B[cc];MA[ba][cb]C[It’s a seki; neither player should play at X now - if they do, they put their own stones in atari. This is shown in the next two variations.]W[da])`
					let
						parsed = smartGame.parse(sgf)
						, engine = goEngine({ boardMode: 't', boardDimensions: [4, 4], rules: { komi: 6.5} })
					for (let index = 1 /*omit first node*/; index < parsed.gameTrees[0].nodes.length; index++) {
						const node = parsed.gameTrees[0].nodes[index],
							colour = node.B ? 'b' : 'w',
							coords1 = node[colour.toUpperCase()],
							coords2 = transformer.translateCoordinates(coords1)
						try {
							engine.play(colour, coords2)
						} catch (error) {
							console.log(error)
						}
		
					}
					const lastNode = parsed.gameTrees[0].nodes[parsed.gameTrees[0].nodes.length - 1]
						, marked = lastNode.MA.map(transformer.translateCoordinates)
						, score = engine.board.score(marked)
					expect(score.error.message).toEqual('invalid marked dead stone(s)')
				})

			})

		});
	})

	describe("scoring", () => {
		var smartGame, transformer;
		try {
			smartGame = require('../../transformer/node_modules/smartgame')
			transformer = require('../../transformer/src/transformer')()
		} catch (error) {
			var msg = "some tests scoring were not run because govariants-transformer is not present"
			it(msg, () => { })
			console.log(msg)
			return
		}
		it("scores a game when dead stones are marked - test with a real game", () => {
			let sgf = `(;GM[1]FF[4]CA[UTF-8]AP[WebGoBoard:0.10.8]ST[0]SZ[19]KM[6.5]HA[0]TM[40]DT[2018-01-13]PB[Lee Sedol]BR[9p]PW[Ke Jie]WR[9p]SO[gokifu.com];B[pd];W[dp];B[pq];W[dd];B[ql];W[nc];B[pf];W[qc];B[pc];W[pb];B[cc];W[cd];B[dc];W[fc];B[ec];W[ed];B[fb];W[rb];B[di];W[ck];B[fd];W[gc];B[gb];W[hc];B[fe];W[bc];B[bb];W[dg];B[id];W[ic];B[jd];W[jc];B[kd];W[ge];B[ff];W[be];B[ac];W[ci];B[df];W[cg];B[ob];W[oc];B[pa];W[qb];B[mc];W[nb];B[gd];W[pp];B[oq];W[pl];B[qm];W[hd];B[he];W[kc];B[lc];W[ie];B[hf];W[ld];B[md];W[gg];B[gf];W[le];B[je];W[lb];B[mb];W[ma];B[kb];W[la];B[me];W[jf];B[if];W[ke];B[ie];W[mf];B[od];W[ja];B[jg];W[pj];B[ol];W[lf];B[nf];W[mh];B[pk];W[ph];B[hb];W[ib];B[oh];W[oi];B[nh];W[ni];B[pg];W[li];B[mj];W[mk];B[ha];W[ia];B[lj];W[mi];B[qh];W[ih];B[eg];W[dj];B[fi];W[gj];B[fj];W[fk];B[gi];W[kj];B[dh];W[ch];B[ek];W[gk];B[ej];W[lk];B[dk];W[cj];B[qj];W[eh];B[ii];W[qq];B[qr];W[rr];B[rq];W[qp];B[rs];W[sr];B[sq];W[pr];B[ss];W[or];B[nq];W[nr];B[mq];W[mr];B[rp];W[lq];B[mo];W[ro];B[qo];W[oo];B[lp];W[qn];B[lr];W[kq];B[kr];W[kp];B[jr];W[ps];B[rn];W[po];B[so];W[hh];B[hi];W[iq];B[qo];W[jh];B[ei];W[ro];B[ko];W[jo];B[kn];W[jn];B[km];W[jm];B[kl];W[jl];B[dm];W[mn];B[mp];W[ir];B[qs];W[rm];B[qo];W[sr];B[rr];W[ro];B[oa];W[qa];B[qo];W[fg];B[fh];W[ro];B[nd];W[na];B[qo];W[eb];B[bd];W[ro];B[ka];W[sn];B[jb];W[sp];B[bl];W[sr];B[bk];W[pi];B[ml];W[bj];B[bf];W[cf];B[ae];W[de];B[ef];W[em];B[en];W[dn];B[cm];W[bg];B[af];W[ll];B[kk];W[mm];B[jj];W[ki];B[jk];W[qi];B[fn];W[fp];B[ho];W[gn];B[do];W[cp];B[go];W[ip];B[il];W[rh];B[im];W[bn];B[cn];W[bo];B[hq];W[gq];B[gp];W[gr];B[rg];W[qg];B[qf];W[bm];B[cl];W[re];B[qh];W[si];B[rd];W[qd];B[qe];W[se];B[rf];W[sd];B[ep];W[eq];B[fo];W[fq];B[hp];W[hr];B[no];W[nn];B[kf];W[in];B[hn];W[al];B[ak];W[am];B[lm];W[nl];B[io];W[jp];B[ng];W[lg];B[kg];W[ig];B[mg];W[lh];B[op];W[ln];B[lo];W[qg];B[sc];W[rc];B[qh];W[eo];B[qg];W[ep];B[sh];W[ri];B[co];W[kh];B[jf];W[sf];B[sg];W[sb];B[ji];MA[lj][gk][be][eb][jr]W[gh]SC[6])`
			let
				parsed = smartGame.parse(sgf)
				, engine = goEngine({ boardMode: 'c', boardDimensions: [19, 19], rules: { komi: 6.5} })
			for (let index = 1 /*omit first node*/; index < parsed.gameTrees[0].nodes.length; index++) {
				const node = parsed.gameTrees[0].nodes[index],
					colour = node.B ? 'b' : 'w',
					coords1 = node[colour.toUpperCase()],
					coords2 = transformer.translateCoordinates(coords1)
				try {
					engine.play(colour, coords2)
				} catch (error) {
					console.log(error)
				}

			}
			const lastNode = parsed.gameTrees[0].nodes[parsed.gameTrees[0].nodes.length - 1]
				, marked = lastNode.MA.map(transformer.translateCoordinates)
				, score = engine.board.score(marked)
			// , blackEmpty = score.blackEmpty.map(coord=>`[${transformer.coordinateLabels(coord[0])}${transformer.coordinateLabels(coord[1])}]`).join('')
			// , whiteEmpty = score.whiteEmpty.map(coord=>`[${transformer.coordinateLabels(coord[0])}${transformer.coordinateLabels(coord[1])}]`).join('')
			//  console.log(score)
			//  console.log(blackEmpty)
			expect(score.RE).toEqual('B+1.5')
			expect(score.totalBlackCaptured).toEqual(24)
			expect(score.totalBlackDead).toEqual(10)
			expect(score.totalBlackTerritory).toEqual(72)
			expect(score.totalWhiteCaptured).toEqual(25)
			expect(score.totalWhiteDead).toEqual(21)
			expect(score.totalWhiteTerritory).toEqual(76)
		})

	})
});
