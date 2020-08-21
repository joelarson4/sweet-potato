//used to more easily access and document the arguments supported for a node script run from command line
const _ = require('lodash');
const log = require('./log');
const path = require('path');
const currentScript = path.basename(__filename);

var args = { };
var altNames = {};

var waitOnErrors = null;
var hasDefaults = false;
var errors = [];
var exampleCommands = {
    longDashed: ['node ' + process.argv[1].split('/').pop()],
    shortDashed: ['node ' + process.argv[1].split('/').pop()],
    longEquals: ['node ' + process.argv[1].split('/').pop()],
    shortEquals: ['node ' + process.argv[1].split('/').pop()],
    all:  ['node ' + process.argv[1].split('/').pop()],
};

for(var ai = 0; ai < process.argv.length; ai++) {
    var arg = process.argv[ai];
    var key = arg.split('=')[0];
    if(key.charAt(0) == '-') {
        key = key.substring(1);
    }
    if(key.charAt(0) == '-') {
        key = key.substring(1);
    }    
    var val = true;
    if(arg.indexOf('=') > -1) {
        val = arg.split('=').pop();
        if(val.charAt(0) == '"') {
            val = val.split('"').join('');
        }
        if(val.charAt(0) == "'") {
            val = val.split("'").join('');
        }
    } else if(ai < process.argv.length - 1) {
        var nextArg = process.argv[ai + 1];
        if(nextArg.charAt(0) !== '-' && nextArg.indexOf('=') < 0) {
            val = nextArg;
            ai++;
        }
    }
    args[key] = val;
}

args.extend = function(object) {
    _.forOwn(object, function(v, k) {
        args[k] = v;
    });
}

args.waitOnErrors = function() {
    waitOnErrors = true;
}

//argName can be an array, if so the first argument becomes the value, but the others are alternatives.  E.g. ["unit", "u"]
args.declare = function(argName, argType, argDefault, argExplain) {
    var that = this;

    if(Array.isArray(argName)) {
        var useArgName = argName[0];
        argName.forEach(function(a) {
            if(typeof that[a] !== 'undefined') {
                that[useArgName] = that[a];
            }
        });
        altNames[useArgName] = argName;
        argName = useArgName;
    }

    if(typeof this[argName] == 'undefined') {
        if(typeof argDefault == 'undefined' || argDefault === null) {
            var err = 'arg "' + argName + ( altNames[argName] ? '" / "' + altNames[argName].slice(1).join('" / "') : '') + '" is required' + (argExplain ? '. ' + argExplain : '') + (argType ? ', type ' + argType : '');
            if(waitOnErrors) {
                errors.push(err);
                
                exampleCommands.longEquals.push(argName + '=?');
                exampleCommands.shortEquals.push((altNames[argName] ? altNames[argName][1] : argName) + '=?');
                exampleCommands.longDashed.push('--' + argName + ' ?');
                exampleCommands.shortDashed.push('-' + (altNames[argName] ? altNames[argName][1] : argName) + ' ?');
                exampleCommands.all.push('--' + argName + ' ?');
            } else {
                throw new Error(err);
            }
        } else {
            this[argName] = argDefault;
            console.log('defaulting arg "' + argName + '" to ' + argDefault + (argExplain ? '. ' + argExplain : ''));
            exampleCommands.all.push('--' + argName + ' ?');
            hasDefaults = true;
        }
    } else {
        if(typeof argType == 'string') {
            if(argType == 'number') {
                this[argName] = Number(this[argName]);
                if(isNaN(this[argName])) {
                    throw new Error('arg "' + argName + '" must be of type ' + argType); 
                }
            } else if(argType == 'boolean') {
                if(this[argName] !== 'false' && this[argName] !== 'true' && this[argName] !== '0' && this[argName] !== '1') {
                    var err = 'arg "' + argName + '" must be of type ' + argType;
                    if(waitOnErrors) {
                        errors.push(err);
                    } else {
                        throw new Error(err);
                    }
                }
                this[argName] = (this[argName] == '1' || this[argName] == 'true');
            } else if(argType == 'array') {
                this[argName] = this[argName].split(',');
            } else if(argType == 'object') {
                this[argName] = JSON.parse(this[argName]);
            } else if(argType !== 'string') {
                throw new Error('Unknown arg type ' + argType);
            }
        }
    }
}

args.throwIfErrors = function() {
    if(waitOnErrors && errors.length) {
        if(args.help) {
            log('');
            log(exampleCommands.longDashed.join(' '));
            log(exampleCommands.longEquals.join(' '));
            log(exampleCommands.shortDashed.join(' '));
            log(exampleCommands.shortEquals.join(' '));
            if(hasDefaults) { log(exampleCommands.all.join(' ')); }
            log('');
        }

        errors.forEach(function(err) { log(err); });
        
        if(args.help) {
            process.exit(0);
        } else {
            throw new Error('Cannot proceed due to bad/missing args');
        }
    }
}

module.exports = args;
