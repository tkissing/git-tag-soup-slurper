var assert = require('chai').assert;

var sinon = require('sinon');

var shell = require('../../src/shell.js');

var testee = require('../../src/git.js');

describe('The git module', function () {

    var sandbox = sinon.sandbox.create();

    afterEach(function () {
        sandbox.restore();
    });

    it('should be an object', function () {
        assert.isObject(testee);
    });

    var wrappers = [
        {method: 'remotes', executable: 'git remote', returnvalue: ['origin', 'github']},
        {method: 'tags', executable: 'git tag', returnvalue: ['1.0.0', '2.0.0']},
        {method: 'validate', executable: 'which git', returnvalue: '/usr/local/bin/git'}
    ];

    wrappers.forEach(function (wrapper) {
        describe('.' + wrapper.method + '()', function () {

            var shellexec;

            beforeEach(function () {
                shellexec = sandbox.stub(shell, 'exec');
                shellexec.returns(wrapper.returnvalue)
            });

            it('should be a function', function () {
                assert.isFunction(testee[wrapper.method]);
            });

            it('should delegate to shell.exec("' + wrapper.executable + '")', function () {
                var ret = testee[wrapper.method]();

                sinon.assert.calledOnce(shellexec);
                sinon.assert.calledWith(shellexec, wrapper.executable);

                assert.equal(ret, wrapper.returnvalue);
            });
        });
    });

    describe('.deleteTagCmd()', function () {
        it('should be a function', function () {
            assert.isFunction(testee.deleteTagCmd);
        });

        it('should return the right command when called with a tag-name only', function () {
            assert.equal('git tag --delete foo', testee.deleteTagCmd(null, 'foo'));
        });

        it('should return the right command when called with a remote-name and a tag-name', function () {
            assert.equal('git push stash :refs/tags/foo', testee.deleteTagCmd('stash', 'foo'));
        });
    })

});
