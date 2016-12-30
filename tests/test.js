'use strict';

require('co-mocha');
const product = require('cartesian-product');

const gulp = require('./helpers/gulp-helper');
const yeoman = require('./helpers/yeoman-helper');
const unit = require('./helpers/unit-helper');
const linter = require('./helpers/linter-helper');


describe('BitMate integration tests with jsdom', function () {
    this.timeout(0);

    const combinations = product([
        ['angular1'],
        ['bower'],
        // ['babel', 'js', 'typescript']
    ]);

    combinations.forEach(combination => {
        const options = {
            server: 'express',
            client: combination[0],
            runner: 'gulp',
            modules: combination[1],
            css: 'less',
            js: 'babel',
            html: 'html'
        };
        // need to add filter for client options...
        options.router = 'uirouter';
        options.styling = 'bootstrap';

        describe('Test with....', function () {
            before(function * () {
                // console.log(`travis_fold:start:${options.framework}-${options.modules}-${options.js}`);
                yield yeoman.prepare();
                yield yeoman.run(options);
            });

            it('test linter', function * () {
                yield linter.linterTest(options);
            });

            it('run "gulp test"', function * () {
                const result = yield gulp.test();
                unit.unitTests(result);
            });

            after(() => {
                // console.log(`travis_fold:end:${options.framework}-${options.modules}-${options.js}`);
            });
        });
    });
});