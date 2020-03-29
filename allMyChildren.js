//recursively iterate through all nodes within a java object and run a fuction against it
const _ = require('lodash');

function allMyChildren(node, setLeafFromResult, runFunction, key, parent) {
    if(Array.isArray(node)) {
        runFunction(node, key, parent);
        node.forEach(function(childNode, childIndex) {
            var result = allMyChildren(childNode, setLeafFromResult, runFunction, childIndex, node);
            if(setLeafFromResult) {
                node[childIndex] = result;
            }
        });
    } else if(typeof node == 'object') {
        runFunction(node, key, parent);
        _.forOwn(node, function(childNode, childKey) {
            var result = allMyChildren(childNode, setLeafFromResult, runFunction, childKey, node);
            if(setLeafFromResult) {
                node[childKey] = result;
            }
        });
    } else {
        return runFunction(node, key, parent);
    }
}

module.exports = allMyChildren;