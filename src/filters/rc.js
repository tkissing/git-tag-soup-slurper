var semver = require('semver');

function findprereleases(options, tags) {

    var loose = !options.strict;

    var upto = options.upto ? semver.clean(options.upto, loose) : null;

    var after = options.after ? semver.clean(options.after, loose) : null;

    return tags.filter(function (tag) {

        var semtag = semver.parse(tag, loose);

        if (semtag) {

            if (upto && semver.gt(semtag, upto, loose)) {
                return false;
            }

            if (after && semver.lte(semtag, after, loose)) {
                return false;
            }

            return semtag.prerelease.length > 0;
        }

        return false;
    });
}

module.exports = findprereleases;
