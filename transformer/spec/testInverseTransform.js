let transformedSgf = `(;GM[1]FF[4]CA[UTF-8]AP[WebGoBoard:0.10.8]ST[0]SZ[12]KM[0]HA[0]PB[Black]PW[White](;AB[aa][ae][ai][ea][ee][ei][ia][ie][ii]CR[aa][ae][ai][ea][ee][ei][ia][ie][ii]B[]C[move 1
White stones captured by Black: 0
Black stones captured by White: 0
--(the content above was generated automatically by GoVariantsTransformer)--
Sample with 3 variations at beginning])(;AB[ab][af][aj][eb][ef][ej][ib][if][ij]CR[ab][af][aj][eb][ef][ej][ib][if][ij]B[]C[move 1
White stones captured by Black: 0
Black stones captured by White: 0
--(the content above was generated automatically by GoVariantsTransformer)--])(;AB[ac][ag][ak][ec][eg][ek][ic][ig][ik]CR[ac][ag][ak][ec][eg][ek][ic][ig][ik]B[]C[move 1
White stones captured by Black: 0
Black stones captured by White: 0
--(the content above was generated automatically by GoVariantsTransformer)--])(;B[ee]C[Added after a click on a1; but this needs to be removed by inverse transform as it is already in the game tree as variation #1]))`
    , options = {
        boardDimensions: [4, 4],
        projectionSettings: { wraparound: 4, offset: [0, 0] }

    }
const transformer = require('../src/transformer')(options)
    , inverseTransform = transformer.inverseTransform
    , transform = transformer.transform
let tSgf = inverseTransform(transformedSgf)
// console.log(tSgf)
if (module) {
    transformer.options.transformToString = false
    module.exports = transformer.transform(tSgf)
}
//used in transformerSpec
