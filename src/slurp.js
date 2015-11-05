require('es5-shim/es5-shim.js');

var git = require('./git.js');

var sequence = require('./sequence.js');

var shell = require('./shell.js');

function exclude(excluded, haystack) {

    return (haystack || []).filter(function (val) {

        return (excluded || []).indexOf(val) < 0;

    });
}

function createCommands(args) {
    var tags = args[0];

    var remotes = args[1];

    var local = tags.map(git.deleteTagCmd.bind(git, null));

    return remotes.reduce(function (result, remote) {

        return result.concat(tags.map(git.deleteTagCmd.bind(git, remote)));

    }, local);
}

function slurp(options, filter) {

    function run(commands) {
        if (options.dryrun) {
            return Promise.all(commands.map(shell.notify));
        }

        // run git commands sequentially to avoid lockfile errors
        return sequence(commands.map(function (command) {
            return function () {
                return shell.exec(true, command);
            };
        }));
    }

    function getRemotes() {
        if (options.localonly) {
            return Promise.resolve([]);
        }
        return git.remotes().then(exclude.bind(null, options.excluderemote));
    }

    return git.validate().then(function () {
        var tags = git.tags().then(filter.bind(null, options));

        var remotes = getRemotes();

        return Promise.all([tags, remotes]);

    }).then(createCommands).then(run);

}

module.exports = {
    slurp: slurp
};
