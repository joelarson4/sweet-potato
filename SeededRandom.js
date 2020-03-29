var crc32 = require('crc-32');

var SALT = Math.E + 5;

module.exports = function(inputSeed) {
    var seed = inputSeed;
    if(typeof seed == 'string') {
        seed = crc32.str(seed);
    }
    var s = seed + SALT;
    return {
        next: function() {
            s += 7;
            return Math.abs((Math.sin(s) * 100) % 1);
        },
        get: function(a) {
            if(typeof a === 'number') {
                return Math.floor(a * this.next());
            } else {
                return a[this.get(a.length)];
            }
        },
        shuffle: function(array) {
            var that = this;
            for(var i = 0; i < Math.sqrt(array.length) + 1; i++) {
                array.sort(function() { return that.get(3) - 1; });
            }
            return array;
        },        
        seed: seed,
        inputSeed: inputSeed
    }
}