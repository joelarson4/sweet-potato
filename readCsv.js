var fs = require('fs');
var _ = require('lodash'); 
var csv = require('fast-csv');
var csvsync = require('csvsync');

function readCsv(csvFile, options, callback) {
    options = options || { };

    if(!callback) {
        //treat as synchronous

        var csopts = null;

        if(options) {
            if(Object.keys(options).join() == 'leaveCaseAlone') {
                //ignore, this is already the case
            } else {
                throw new Error('Only leaveCaseAlone is available for synchronous csv read');
            }
        }

        var returnRows = csvsync.parse(fs.readFileSync(csvFile).toString(), csopts);

        return returnRows;
    } else {
        var csvTable = [];
        var columns = null;
        
        var fileStream = fs.createReadStream(csvFile);
        var csvStream = csv(options.csvOptions)
            .on("data", function(data){
                csvTable.push(data);
            })
            .on("end", function(){
                processCsv();
                csvTable = [];
            });
        fileStream.pipe(csvStream);

        var returnRows = [];
        function processCsv() {
            csvTable.forEach(function(row, index) {
                if(index == 0) {
                    columns = row;
                } else {
                    var r = { };
                    columns.forEach(function(col, ci) {
                        if(options.renameColumns) {
                            if(options.renameColumns[col]) {
                                col = options.renameColumns[col];
                                r[col] = row[ci];
                            } else {
                                return; //omit
                            }
                        } else {
                            if(options.simplifyNames) {
                                col = col.charAt(0).toLowerCase() + col.substring(1).split(' ').join('').split('-').join('');
                            } else if(!options.leaveCaseAlone) {
                                col = col.charAt(0).toLowerCase() + col.substring(1);
                            }
                            r[col] = row[ci];
                        }
                        if(options.columnsToArray && _.includes(options.columnsToArray, col)) {
                            r[col] = (r[col].trim().length == 0 ? null : r[col].split(',').map(function(v) { return v.trim(); }));
                        }
                    });
                    returnRows.push(r);
                }
            });

            callback(returnRows);
        }
    }
}


module.exports = readCsv;