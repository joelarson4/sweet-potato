var fs = require('fs');
var _ = require('lodash');

function awaitNewFiles(checkFolder, callback) {
    var originalFileList = fs.readdirSync(checkFolder);
    originalFileList.sort();

    console.log('Waiting for new files in ' + checkFolder);
    var count = 0;

    function check() {
        count++;
        var newFileList = fs.readdirSync(checkFolder);
        newFileList.sort();
        if(newFileList.join() !== originalFileList.join() && newFileList.join().indexOf('crdownload') < 0) {
            console.log('');
            setTimeout(function () {
                callback(_.difference(newFileList, originalFileList));
            }, 500);
        } else {
            if(count % 2 == 0) { process.stdout.write('.'); }
            setTimeout(function () {
                check();
            }, 3000);
        }
    }

    check();
}

module.exports = awaitNewFiles;