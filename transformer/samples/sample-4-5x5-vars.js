
let sampleSgf = `(;
    FF[4]
    CA[UTF-8]
    GM[1]
    SZ[5]
    AP[maxiGos:6.45 (daoqi Ed)]
    ;B[cc]
    (;W[cb];B[bc])
    (;W[db];B[bd])
    (;W[ca];B[ce];W[be];B[bd];W[de]
    ;B[cd];W[bb];B[ae];W[ba];B[da]))`

var transform = require('../src/transform')
let sgf = transform(sampleSgf)
console.log(sgf)