
// let path = require('path');
let fs = require('fs');
// let appDir = path.dirname(require.main.filename);
let transform = require('../src/transform')

let filePath = ``//enter path to an SGF (t-Go) file
let transformedFile = ``//enter path for the output to be written to

//alternatively, leave the lines above as is, and call via node, with 2 arguments - see the readme.md
if (filePath === '')
    filePath = process.argv[2]
if (transformedFile === '')
    transformedFile = process.argv[3]

console.log(filePath)
console.log(transformedFile)

fs.readFile(filePath, 'utf-8', function (err, sgfData) {

    fs.writeFile(transformedFile, transform(sgfData), (err) => {
        console.log(err)

    })
});

