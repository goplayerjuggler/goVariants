/* globals module: false, require: false */

var goEngine = require('../src/engine')
describe("engine", function () {
	'use strict';
    var go;


    describe("board", function () {
		describe("setup (boardMode:c; boardDimensions:19x19)", function () {
		
			beforeEach(function () {
				go = goEngine({boardMode:'c', boardDimensions:[19,19]})
			});
			describe("getNeighbours(0,0)", function () {
                var neighboursResult;

                beforeEach(function () {
                    neighboursResult = go.board.getNeighbours([0, 0])
                });
                it("should be equal to [[1,0],[0,1]]", function () {
                    expect(neighboursResult).toEqual([[1,0],[0,1]])
                })
				
            });
			describe("getNeighbours(2,2)", function () {
                var neighboursResult;

                beforeEach(function () {
                    neighboursResult = go.board.getNeighbours([2, 2])
                });
                it("is an array of length 4 containing points 2-3, 2-1, 1-2 and 3-2", function () {
				expect(Object.prototype.toString.call(neighboursResult)).toBe("[object Array]")
                    expect(neighboursResult).toContain([2,3])
                    expect(neighboursResult).toContain([2,1])
                    expect(neighboursResult).toContain([1,2])
                    expect(neighboursResult).toContain([3,2])
                    expect(neighboursResult.length).toEqual(4)
                })
            });
		
			describe("getColour", function() {
				
				it("returns the colour of a point", function() {
					go.board.blackStones = [[0,0]]
					expect(go.board.getColour([0,0])).toEqual('b')
					go.board.blackStones = []
					go.board.whiteStones = [[0,0]]
					expect(go.board.getColour([0,0])).toEqual('w')
					expect(go.board.getColour([0,1])).toEqual('e')
				});
			});
			describe("chainHasLiberty", function() {
				
				it("says one stone has a liberty", function() {
					// go.board.blackStones = [[2,2]]
					expect(go.board.chainHasLiberty([2,2], 'b')).toBe(true)
					expect(go.board.chainHasLiberty([2,2], 'w')).toBe(true)
				});
				it("says a11 has no liberties when a12 a21 are of the opposite colour; it has a liberty when it's part of a chain a11 a12 a21", function() {
					go.board.blackStones = [[0,1],[1,0]]
					expect(go.board.chainHasLiberty([0,0], 'w')).toEqual([[0,0]])
					expect(go.board.chainHasLiberty([0,0], 'b')).toBe(true)
					go.board.whiteStones = [[0,1],[1,0]]
					go.board.blackStones = []
					expect(go.board.chainHasLiberty([0,0], 'b')).toEqual([[0,0]])
					expect(go.board.chainHasLiberty([0,0], 'w')).toBe(true)
				});
			});
			
			
			describe("play", function() {
			
				beforeEach(function () {					
					go.board.empty()
				});
				it("places stones", function() {
					go.play('b',[0,0])
					expect(go.board.blackStones).toEqual([[0,0]])
					go.play('w',[0,1])
					expect(go.board.whiteStones).toEqual([[0,1]])
				});
				it("may remove stones; when it does it \n"+ 
				" -updates the tally of captured stones \n"+ 
				// " -records the move in the internal list of moves\n"+ 
				" -returns all chains removed due to the move", function() {
					expect(go.board.captured[1]).toEqual(0)
					// expect(go.moves.length).toEqual(0)
					var r = go.play('b',[0,0])
					// expect(go.moves.length).toEqual(1)
					expect(r.removed.length).toEqual(0)
					go.play('w',[0,1])
					// expect(go.moves.length).toEqual(2)
					r=go.play('w',[1,0])
					// expect(go.moves.length).toEqual(3)
					expect(go.board.whiteStones).toEqual([[0,1],[1,0]])
					expect(go.board.blackStones).toEqual([])
					expect(go.board.captured[0]).toEqual(1)
					expect(r.removed).toEqual([[[0,0]]])
					
					go.board.whiteStones = [[1,0],[1,1],[0,1]]
					go.board.blackStones = [[2,0],[2,1],[2,2],[1,2],[0,2]]
					expect(go.board.captured[1]).toEqual(0)
					r=go.play('b',[0,0])					
					expect(go.board.whiteStones).toEqual([])
					expect(go.board.captured[1]).toEqual(3)
					
					expect(r.removed).toEqual([[[1,0],[1,1],[0,1]]])
				});
				
				it("may be “suicide”", function() {
					go.board.whiteStones = [[0,1],[1,0]]
					go.play('b',[0,0])
					
					expect(go.board.whiteStones).toEqual([[0,1],[1,0]])
					expect(go.board.blackStones).toEqual([])
					expect(go.board.captured[0]).toEqual(1)
					//throw
					go = goEngine({boardMode:'c', rules:{suicide:false}})
					
					go.board.whiteStones = [[0,1],[1,0]]
					expect(function() {go.play('b',[0,0])}).toThrowError('suicide')
				});
			});
			
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
                    expect(neighboursResult).toContain([2,3])
                    expect(neighboursResult).toContain([2,1])
                    expect(neighboursResult).toContain([1,2])
                    expect(neighboursResult).toContain([3,2])
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
                    expect(neighboursResult).toContain([0,1])
                    expect(neighboursResult).toContain([1,0])
                    expect(neighboursResult).toContain([10,0])
                    expect(neighboursResult).toContain([0,10])
                    expect(neighboursResult.length).toEqual(4)
                })
            });
        
			});
			
			describe("chainHasLiberty", function() {
				
				beforeEach(function () {
					go.board.blackStones = []
					go.board.whiteStones = []
				});
				it("says one stone has a liberty", function() {
					// go.board.blackStones = [[2,2]]
					expect(go.board.chainHasLiberty([2,2], 'b')).toBe(true)
					expect(go.board.chainHasLiberty([2,2], 'w')).toBe(true)
				});
				it("says a11 has a liberty when a12 a21 are of the opposite colour; it has a liberty when it's part of a chain a11 a12 a21", function() {
					go.board.blackStones = [[0,1],[1,0]]
					expect(go.board.chainHasLiberty([0,0], 'w')).toBe(true)
					expect(go.board.chainHasLiberty([0,0], 'b')).toBe(true)
				});
				it("(as previous with swapped colours)", function() {
					go.board.whiteStones = [[0,1],[1,0]]
					expect(go.board.chainHasLiberty([0,0], 'b')).toBe(true)
					expect(go.board.chainHasLiberty([0,0], 'w')).toBe(true)
				});
				it("says a11 has no liberty when surrounded by stones of oppposite colour but has liberties when surrounded by stones of same colour ", function() {
					go.board.whiteStones = [[0,1],[1,0],[10,0],[0,10]]
					expect(go.board.chainHasLiberty([0,0], 'b')).toEqual([[0,0]])
					expect(go.board.chainHasLiberty([0,0], 'w')).toBe(true)
				});
			});
			
			describe("play", function() {
			
				beforeEach(function () {					
					go.board.empty()
				});
				it("places stones", function() {
					go.play('b',[0,0])
					expect(go.board.blackStones).toEqual([[0,0]])
					go.play('w',[0,1])
					expect(go.board.whiteStones).toEqual([[0,1]])
				});
				it("may remove stones; when it does it \n"+ 
				" -updates the tally of captured stones \n"+ 
				// " -records the move in the internal list of moves\n"+ 
				" -returns all chains removed due to the move", function() {
					expect(go.board.captured[1]).toEqual(0)
					// expect(go.moves.length).toEqual(0)
					var r = go.play('b',[0,0])
					// expect(go.moves.length).toEqual(1)
					expect(r.removed.length).toEqual(0)
					go.play('w',[0,1])
					// expect(go.moves.length).toEqual(2)
					r=go.play('w',[1,0])
					// expect(go.moves.length).toEqual(3)
					expect(r.removed.length).toEqual(0)
					r=go.play('w',[10,0])
					expect(r.removed.length).toEqual(0)
					r=go.play('w',[0,10])
					expect(r.removed.length).toEqual(1)
					expect(r.removed).toEqual([[[0,0]]])
					
					r=go.play('w',[0,0])
					expect(r.removed.length).toEqual(0)
					
				});
				
				it("may be “suicide”", function() {
					go.board.whiteStones = [[0,1],[1,0],[10,0],[0,10]]
					var r = go.play('b',[0,0])
					
					expect(go.board.whiteStones).toEqual([[0,1],[1,0],[10,0],[0,10]])
					expect(go.board.blackStones).toEqual([])
					expect(go.board.captured[0]).toEqual(1)
					
					expect(r.removed).toEqual([])
					expect(r.suicide).toEqual([[0,0]])
					// //throw
					// go = goEngine({boardMode:'t', rules:{suicide:false}})
					
					// expect(function() {go.play('b',[0,0])}).toThrowError('suicide')
				});
			});
			
		});
    });
});
