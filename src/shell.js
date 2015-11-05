var chalk = require('chalk');

var pexec = require('child_process').exec;

function debugging() {
    var debug = process.env.NODE_DEBUG || '';

    return debug == 'true' || debug == 'y' || debug == '1' || debug.indexOf('slurp') > -1;
}

function success(text) {
    return out(chalk.green, text);
}

function notify(text) {
    return out(chalk.blue, text);
}

function info(text) {
    return out(chalk.grey, text);
}

function error(text) {
    return out(chalk.red, true, text);
}

function out(color, error, text) {
    if (typeof error == 'string') {
        text = error;
        error = false;
    }

    var print = error ? function (line) {
        console.error(color(line));
    } : function (line) {
        console.log(color(line));
    };

    text.split(/\r?\n/).forEach(print);

    return text;
}

function truthy(value) {
    return !!value;
}

function exec(ignoreerrors, command) {
    if (typeof ignoreerrors != 'boolean') {
        command = ignoreerrors;
        ignoreerrors = false;
    }

    var debug = debugging();

    return new Promise(function (resolve, reject) {

        if (debug) {
            console.log('Running', command);
        }

        pexec(command, function (err, stdout, stderr) {
            if (err) {
                error(stderr);
                if (!ignoreerrors) {
                    reject(err);
                }
            }

            var lines = (stdout || '').split(/\r?\n/).filter(truthy);

            if (debug) {
                console.log('Finished', command);
            }

            resolve(lines);
        });
    });
}

module.exports = {
    out: out,

    error: error,
    info: info,
    notify: notify,
    success: success,

    exec: exec
};
