let transformedSgf = //`(;GM[1]FF[4]CA[UTF-8]AP[WebGoBoard:0.10.8]ST[2]SZ[12]KM[0]HA[0]PB[Black]PW[White](;AB[aa][ae][ai][ea][ee][ei][ia][ie][ii]CR[aa][ae][ai][ea][ee][ei][ia][ie][ii]B[])(;AB[ab][af][aj][eb][ef][ej][ib][if][ij]CR[ab][af][aj][eb][ef][ej][ib][if][ij]B[](;AW[bb][bf][bj][fb][ff][fj][jb][jf][jj]CR[bb][bf][bj][fb][ff][fj][jb][jf][jj]W[])(;AW[bc][bg][bk][fc][fg][fk][jc][jg][jk]CR[bc][bg][bk][fc][fg][fk][jc][jg][jk]W[])(;AW[bd][bh][bl][fd][fh][fl][jd][jh][jl]CR[bd][bh][bl][fd][fh][fl][jd][jh][jl]W[])(;W[ff])))`
`(;GM[1]FF[4]CA[UTF-8]AP[WebGoBoard:0.10.8]ST[0]SZ[12]KM[0]HA[0]PB[Black]PW[White](;AB[aa][ae][ai][ea][ee][ei][ia][ie][ii]CR[aa][ae][ai][ea][ee][ei][ia][ie][ii]B[];AW[ba][be][bi][fa][fe][fi][ja][je][ji]CR[ba][be][bi][fa][fe][fi][ja][je][ji]W[];AB[ab][af][aj][eb][ef][ej][ib][if][ij]CR[ab][af][aj][eb][ef][ej][ib][if][ij]B[];AW[bb][bf][bj][fb][ff][fj][jb][jf][jj]CR[bb][bf][bj][fb][ff][fj][jb][jf][jj]W[];AB[ac][ag][ak][ec][eg][ek][ic][ig][ik]CR[ac][ag][ak][ec][eg][ek][ic][ig][ik]B[])(;AB[ab][af][aj][eb][ef][ej][ib][if][ij]CR[ab][af][aj][eb][ef][ej][ib][if][ij]B[](;AW[bb][bf][bj][fb][ff][fj][jb][jf][jj]CR[bb][bf][bj][fb][ff][fj][jb][jf][jj]W[])(;AW[bc][bg][bk][fc][fg][fk][jc][jg][jk]CR[bc][bg][bk][fc][fg][fk][jc][jg][jk]W[])(;AW[bd][bh][bl][fd][fh][fl][jd][jh][jl]CR[bd][bh][bl][fd][fh][fl][jd][jh][jl]W[])(;W[ff])))`
    , options = {
        boardDimensions: [4, 4],
        projectionSettings: { wraparound: 4, offset: [0, 0] }

    }
const transformer = require('../src/transformer')(options)
    , inverseTransform = transformer.inverseTransform
    , transform = transformer.transform
let tSgf = inverseTransform(transformedSgf)
transformer.options.transformToString = false
let wrappedGame= transformer.transform(tSgf)
// wrappedGame.goTo({m:1, 0:1})
// console.log(wrappedGame.variations().length)
// console.log(tSgf)
if (module) {
    
    module.exports = wrappedGame//expect length 3
}
//used in transformerSpec
