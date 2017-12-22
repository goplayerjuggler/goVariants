
let sampleSgf = `(;
    FF[4]
    CA[UTF-8]
    GM[1]
    SZ[4]
    AP[maxiGos:6.45 (daoqi Ed)]
    ;B[ad];W[bd];B[bc];W[ac];B[bb]
    ;W[aa];B[ab];W[dd])`

let transform = require('../src/transform')
let sgf = transform(sampleSgf,{ addComments: false, projectionSettings: { offset: [0,0] } }) //sgf = transform(sampleSgf,{addMarkersForWraparound:false, addComments:false, transformToString:false})

console.log(sgf)
// sgf = transform(sampleSgf,{ addComments: false, projectionSettings: { offset: viewer.offset } }) 

// console.log(sgf)