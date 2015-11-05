/**
 *
 * @param {Array.<Function|Promise>} steps
 * @returns {Promise}
 */
function sequence(steps) {

    var results = [];

    var push = results.push.bind(results);

    if (!Array.isArray(steps)) {
        return Promise.reject(Error('Invalid argument'));
    }

    return steps.reduce(function (prev, step) {
        return prev.then(function () {
            var promise = typeof step == 'function' ? step() : step;

            return promise.then(push);
        });

    }, Promise.resolve()).then(function () {
        return results;
    });

}

module.exports = sequence;
