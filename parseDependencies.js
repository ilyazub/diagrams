'use strict';

const espree = require('espree');
const walk = require("acorn/dist/walk");

const stringifyObj = obj => JSON.stringify(obj, null, 2)
const logObj = obj => console.log(stringifyObj(obj))

function parseDependencies(code) {
    let result = {};

    try {
        const ast = espree.parse(code, {
            ecmaVersion: 8,
            sourceType: 'module'
        });

        walk.simple(ast, {
            VariableDeclarator(node) {
                if (isBackboneLikeExtend(node)) {
                    result[node.id.name] = getParents(node)
                }
            }
        })
    } catch (e) {
        console.error(code)
        console.error(e)
        process.exit(-1)
    }

    return result;
};

function isBackboneLikeExtend(node) {
    return node.init
        && node.init.type === "CallExpression"
        && node.init.callee.type === "MemberExpression"
        && node.init.callee.property
        && node.init.callee.property.type === "Identifier"
        && node.init.callee.property.name === "extend";
}

function isNestedExtendCall(node) {
    return node.init.arguments
        && node.init.arguments.length > 0
        && node.init.arguments[0].type === "CallExpression"
        && node.init.arguments[0].callee
        && node.init.arguments[0].callee.type === "MemberExpression"
        && node.init.arguments[0].callee.property
        && node.init.arguments[0].callee.property.type === "Identifier"
        && node.init.arguments[0].callee.property.name === "extend"
        && node.init.arguments[0].arguments
        && node.init.arguments[0].arguments.length > 0;
}

function getParents(node) {
    return [
        getDirectParent(node)
    ].concat(getNestedExtendParents(node)).filter(n => n)
}

function getNestedExtendParents(node) {
    if (isNestedExtendCall(node)) {
        return node.init.arguments[0].arguments
            .filter(node => node.type === "Identifier")
            .map(node => node.name);
    }
}

function getDirectParent(node) {
    if (node.init.callee.object
        && node.init.callee.object.type === "MemberExpression"
    ) { // Nested object like Backbone.Model
        return `${node.init.callee.object.object.name}.${node.init.callee.object.property.name}`
    } else {
        return node.init.callee.object.name
    }
}

module.exports = {
    parseDependencies,
    stringifyObj,
    logObj
};
