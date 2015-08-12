var assert = require('chai').assert;

var testee = require('../../src/sequence.js');

function assertThenable(value) {

    // assert.isObject does not recognize native Promises in all environments as objects, so just doing the catch clause is not sufficient

    try {
        assert.instanceOf(value, Promise);
    } catch (e) {
        assert.isObject(value);
        assert.isFunction(value.then);
    }
}

describe('The sequence module', function () {
    it('should be a function accepting one argument', function () {
        assert.isFunction(testee);
        assert.equal(testee.length, 1);
    });

    var invalids = [
        {arg: undefined, desc: 'undefined'},
        {arg: 5, desc: 'a number'},
        {arg: 'foo', desc: 'a string'},
        {arg: {length: 3}, desc: 'an object with a length property'},
        {arg: [5], desc: 'an array containing a non-function', msg: 'number is not a function'}
    ];

    invalids.forEach(function (invalid) {
        it('should return a rejected promise if called with ' + invalid.desc, function (done) {

            var ret = testee(invalid.arg);

            assertThenable(ret);

            ret.then(function () {
                throw Error('Promise was resolved unexpectedly');
            }, function (reason) {
                assert.instanceOf(reason, Error);

                assert.equal(reason.message, invalid.msg || 'Invalid argument');
            }).then(done, done);

        })
    });

    it('should return a resolved promise if called with an empty array', function (done) {
        var ret = testee([]);

        assertThenable(ret);

        ret.then(function (result) {
            assert.isArray(result);
            assert.equal(result.length, 0);
        }).then(done, done);
    });

    it('should execute the steps one after the other', function (done) {

        var timeline = [];

        var steps = [1, 2, 3].map(function (i) {

            return function () {
                timeline.push(i);

                return new Promise(function (resolve) {
                    assert.equal(timeline.length, i, 'Some promises seem to have executed in parallel');

                    setTimeout(resolve.bind(null, i), 10);
                });
            };

        });

        var ret = testee(steps);

        assertThenable(ret);

        ret.then(function (result) {
            assert.isArray(result);
            assert.equal(JSON.stringify(result), JSON.stringify([1, 2, 3]));
        }).then(done, done);
    });

});
