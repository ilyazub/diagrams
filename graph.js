const Viz = require('viz.js')

function prepareDependency(dependency) {
    const type = Object.keys(dependency)[0]
    const parents = dependency[type]

    return parents.map(parent => `${cleanChars(parent)} -> ${cleanChars(type)};`).join('\n')
}

function cleanChars(string) {
    return string.replace(/[\$\.]/, '_')
}

function prepareDependencies(dependencies) {
    return dependencies.map(prepareDependency).join('\n')
}

function prepareDirgraph(dependencies) {
    const edges = prepareDependencies(dependencies)

    return `
digraph G {
    ${edges}
}
`
}

module.exports = function graph(dependencies) {
    try {
        return Viz(prepareDirgraph(dependencies))
    } catch (e) {
        console.error(e)
    }
}
