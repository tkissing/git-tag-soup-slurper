require('es6-promise').polyfill();

var shell = require('./shell.js');

function validate() {
    return shell.exec('which git');
}

function tags() {
    return shell.exec('git tag');
}

function remotes() {
    return shell.exec('git remote');
}

function deleteTagCmd(remote, tag) {
    if (remote) {
        return 'git push ' + remote + ' :refs/tags/' + tag;
    }

    return 'git tag --delete ' + tag;
}

module.exports = {
    deleteTagCmd: deleteTagCmd,
    remotes: remotes,
    tags: tags,
    validate: validate
};
