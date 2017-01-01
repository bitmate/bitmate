'use strict';

require('co-mocha');
const product = require('cartesian-product');

const gulp = require('./helpers/gulp-helper');
const yeoman = require('./helpers/yeoman-helper');
const unit = require('./helpers/unit-helper');
const linter = require('./helpers/linter-helper');
const jsdom = require('./helpers/jsdom-helper');

describe('BitMate integration tests with jsdom', function () {
    this.timeout(0);

    const combinations = product([
        ['angular1'],
        ['bower'],
        ['babel']
    ]);

    combinations.forEach(combination => {
        const options = {
            server: 'express',
            client: combination[0],
            runner: 'gulp',
            modules: combination[1],
            css: 'less',
            js: combination[2],
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

            it('run "gulp serve" and e2e on number of Techs listed', function * () {
                const url = yield gulp.serve();
                yield jsdom.run(url);
                gulp.killServe();
            });

            after(() => {
                // console.log(`travis_fold:end:${options.framework}-${options.modules}-${options.js}`);
            });
        });
    });
});