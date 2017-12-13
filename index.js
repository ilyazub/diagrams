const { parseDependencies, logObj } = require('./parseDependencies')
const fs = require('fs-extra');
const graph = require('./graph'); // Front-end
const filePaths = process.argv.splice(2);

function nonEmptyObject(obj) {
    return Object.keys(obj).length > 0
}

/**
 * Back-end
 */
function engine(filePaths) {
    return Promise.all(
        filePaths.map(filePath => fs.readFile(filePath, 'utf-8'))
    )
    .then(contents => contents.map(content => parseDependencies(content)))
    .then(parsed => parsed.filter(nonEmptyObject))
}

const filePath = `${__dirname}/graph.svg`;

engine(filePaths)
    .then(dependencies => graph(dependencies))
    .then(image => fs.writeFile(filePath, image, 'utf-8'))
