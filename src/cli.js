var nopt = require('nopt');

var shell = require('./shell.js');

var slurp = require('./slurp.js').slurp;

function parse(argv) {

    var knownOpts = {
        dryrun: Boolean,
        localonly: Boolean,
        upto: String,
        excludetag: Array,
        excluderemote: Array
    };

    var shortHands = {
        t: ['--excludetag'],
        r: ['--excluderemote']
    };

    return nopt(knownOpts, shortHands, argv, 2);
}

function run(argv, filter) {

    var options = Array.isArray(argv) ? parse(argv) : argv;

    slurp(options, filter).then(function () {

        shell.success('# All done');

        process.exit(0);
    }, function (reason) {

        shell.error('#' + reason);

        process.exit(1);
    });
}

module.exports = {
    run: run,
    parse: parse
};

