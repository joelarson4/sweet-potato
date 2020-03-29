Welcome to your very own Sweet Potato 🍠
========================================

This is a little collection of node-js libs that are useful for command line tools. I plan to clean these up, add some
tests and spin these off into their own little repos.

The libraries
-------------

**allMyChildren**

Iterates over all objects within a JavaScript object tree.

```
const allMyChildren = require('sweet-potato').allMyChildren;

allMyChildren(node, setLeafFromResult, runFunction, key, parent);
```

**args**

Pulls out arguments sent into a script on the command line and makes them available in an easier way than using
`process.args`.

```
> node somescript.js fruit=apple v=carrot count=3

...now, in somescript.js:

const args = require('sweet-potato').args;
args.declare(['fruit', 'f'], 'string');
args.declare(['veggie', 'v'], 'string');
args.declare(['count', 'c'], 'number');

console.log(args.fruit); //'apple'
console.log(args.veggie); //'carrot'
console.log(args.count); //'3'
````

**awaitNewFiles**

Watch a particular directory until a new file arrives. Useful for watching for downloads.

```
const awaitNewFiles = require('sweet-potato').awaitNewFiles;

awaitNewFiles('/Users/mrpotato/Downloads', function(newFilesArray) {
    ...
});
```

**customStringify**

Alternative to `JSON.stringify()` when you have an object with circular structures.

`const customStringify = require('sweet-potato').customStringify;`

**dateStuff**

Some useful date functions lazily gathered into one library.

`const dateStuff = require('sweet-potato').dateStuff;`

**log**

Alternative to `console.log` that is both shorter to type, and provides more useful output for objects, arrays, etc.

```
const log = require('sweet-potato').log;

log(1); //prints 1
log(someObject); //prints JSON pretty printed
log(someArrayOfArrays); //prints using console.table.

**permutator**

Provides all permutations of an array.

```
const permutator = require('sweet-potato').permutator;

var arr = [1,2,3];
var p = permutator(arr);

//p should equal [ [ 1, 2, 3 ], [ 1, 3, 2 ], [ 2, 1, 3 ], [ 2, 3, 1 ], [ 3, 1, 2 ], [ 3, 2, 1 ] ]
```

**readCsv**

A simple wrapper around `fast-csv`;

```
const readCsv = require('sweet-potato').readCsv;

readCsv('/Users/mrpotato/Documents/harvest.csv', { leaveCaseAlone: true }, function(rows) {
    //rows is an array of JavaScript objects, one for each row of CSV
});
```

**runCommand**

A simple wrapper around `child_process` to run commands. This needs some rethinking to be generally usable.

```
const runCommand = require('sweet-potato').runCommand;

runCommand('open /Users/mrpotato/Documents/harvest.csv');
```

**SeededRandom**

A way to get pseudo-random numbers that are repeatable. At least on the same machine.

```
const SeededRandom = require('sweet-potato').SeededRandom;

var rand = new SeededRandom(5);
rand.next(); // returns 0.35067478337943214
rand.next(); // returns 0.9891305176801097
rand.get([1,2,3,4,5]); //returns 3 -- selects a random item from array
rand.get(10); //returns 2 -- selects a random number from 0 to 9 (less than 10)
rand.shuffle([1,2,3,4,5,6]); //returns [ 1, 4, 3, 5, 2, 6 ]

//rerunning this code should produce the same results.
```

**writeCsv**

Simple wrapper around `csv-writer`.

```
const writeCsv = require('sweet-potato').writeCsv;

writeCsv('/Users/mrpotato/Documents/gardenPlan.csv', arrayOfObjectsSameKeys);
```

FAQs
----

**Why is it called Sweet Potato?**
I really like sweet potatoes, and literally all the other names are taken.

**There's already a better library for function X**
Cool, sometimes these things are hard to find!

**Some of this code is not good, so like, why?**
Been busy.
