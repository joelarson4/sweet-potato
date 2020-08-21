var _ = require('lodash');

function truncateToDepth(object, depth, maxDepth) {
    if(typeof object == 'object') {
        if(depth >= maxDepth) {
            return '~truncated~' + typeof object + '~';
        }        
        if(Array.isArray(object)) {
            object.forEach(function(v, i) {
                object[i] = truncateToDepth(v, depth + 1, maxDepth);
            });
        } else {
            _.forOwn(object, function(v, k) {
                object[k] = truncateToDepth(v, depth + 1, maxDepth);
            });
        }
    }
    return object;
}

module.exports = function(object, ignore, indent) {
    var maxDepth = 1;
    var string = null;
    while(true) {
        try {
            var newObject = _.cloneDeep(object);
            newObject = truncateToDepth(newObject, 0, maxDepth);
            var newString = JSON.stringify(newObject, ignore, indent);
            if(newString == string) {
                break;
            } else {
                string = newString;
            }
            maxDepth++;
        } catch(e) {
            //catch circular structure
            break;
        }
    }
    return string;
}