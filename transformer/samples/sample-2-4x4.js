
let sampleSgf = `(;
    FF[4]
    CA[UTF-8]
    GM[1]
    SZ[4]
    AP[maxiGos:6.45 (daoqi Ed)]
    ;B[ad];W[bd];B[ab];W[ac];B[ba]
    ;W[dc];B[da];W[cc];B[db];W[bb]
    ;B[ca];W[cb];B[dd])
    `


let transform = require('../src/transform')
let sgf = transform(sampleSgf)
console.log(sgf)