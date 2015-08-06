var semver = require('semver');

function findprereleases(options, tags) {

    var loose = !options.strict;

    var upto = options.upto ? semver.clean(options.upto, loose) : null;

    return tags.filter(function(tag) {

        var semtag = semver.parse(tag, loose);

        if (semtag) {
            if (!upto || semver.lte(semtag, upto, loose)) {
                return semtag.prerelease.length > 0;
            }
        }

        return false;
    });
}

module.exports = findprereleases;
