require('console.table');
var _ = require('lodash');

function useTable(obj) {
    if(!Array.isArray(obj) || obj.length == 1) {
        return false;
    }
    var k0 = _.keys(obj[0]);
    if(k0.length > 15) {
        return false;
    }
    if(k0.join() != _.keys(obj[1]).join()) {
        return false;
    }

    return true;
}

module.exports = function(obj, obj2) {
    if(obj2) {
        console.log('\n===' + obj2 + '===');
    }
    try {
        if(typeof obj == 'object') {
            if(useTable(obj)) {
                console.table(obj);
            } else {
                var jso = JSON.stringify(obj);
                if(jso.length > 100) {
                    console.log(JSON.stringify(obj, 0, '  '));
                } else {
                    console.log(jso);
                }
            }
        } else {
            console.log(obj);
        }
    } catch(e) {
        console.log(obj);
    }
}