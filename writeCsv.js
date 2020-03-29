const csvWriter = require('csv-writer');
const _ = require('lodash');

function subObjects(obj) {
    _.forOwn(obj, function(vv, vk) {
        if(typeof vv == 'object') {
            obj[vk] = '[object]';
        } else {
            obj[vk] = vv;
        }
    });
}

function stringifyMaxDepth(obj) {
    var newObj = (Array.isArray(obj) ? [] : {});
    _.forOwn(obj, function(vv, vk) {
        if(typeof vv == 'object') {
            subObjects(vv);
        }
        newObj[vk] = vv;
    });
    return JSON.stringify(newObj);
}

function writeCsv(path, data) {
    var header = [];
    var keys = { };
    data.forEach(function(data) {
        _.forOwn(data, function(v, k) {
            keys[k] = true;
        });
    });
    _.forOwn(keys, function(v, k) {
        header.push({ id: k, title: k });
    });

    const writer = csvWriter.createObjectCsvWriter({
        path: path,
        header: header
    });

    data = _.cloneDeep(data);
    data = data.map(function(row) { 
        _.forOwn(row, function(v, k) {
            if(typeof v == 'object') {
                row[k] = stringifyMaxDepth(v);
            }
        });
        return row;
    });

    writer.writeRecords(data).then(() => {
        console.log('Wrote ' + path + ', ' + data.length + ' lines');
    });
}

module.exports = writeCsv;

