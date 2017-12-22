
let path = require('path');
let fs = require('fs');
let appDir = path.dirname(require.main.filename);
let transform = require('../src/transform')
let removeFiles = true

for (let i = 1; i < 6; i++) {
    
    let filePath = path.join(appDir, `sample-${i}.sgf`)
    let transformedFile = path.join(appDir, `.sample-${i}_transformed.sgf`)
    
    if (removeFiles)
        fs.unlink(transformedFile)
    else
        fs.readFile(filePath, 'utf-8', function (err, sgfData) {

            fs.writeFile(transformedFile, transform(sgfData), (err) => {
                console.log(err)

            })
        });

}