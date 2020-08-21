var fs = require('fs');
var exec = require('child_process').exec;

function runCommand(command, acceptError, callback, errorCallback, dontPrint, captureStdOut, captureStdError) {
    if(!dontPrint) { console.log('# ' + command); }
    var child = exec(command, function (error, stdout, stderr) {
        if(!dontPrint && stdout.toString().length > 0) { console.log('  stdout[' + stdout + ']'); }
        if(!dontPrint && stderr.toString().length > 0) { console.log('  stderr[' + stderr + ']'); }
        if (error !== null) {
            if(!dontPrint) { console.log('  exec error: ' + error); }
            if(acceptError == '*ALL*' || error.toString().indexOf(acceptError) > -1 && callback) {
                callback();
            } else if(errorCallback) {
                errorCallback();
            }
        } else if(callback) {
            callback();
        }
    });
    child.stdout.on('data', function(data) {
        if(data && !dontPrint) { console.log(data.toString()); }
        if(captureStdOut) { captureStdOut(data); }
    });
    child.stderr.on('data', function(data) {
        if(data && !dontPrint) { console.log(data.toString()); }
        if(captureStdError) { captureStdError(data); }
    });
}

module.exports = runCommand;


