'use strict';

require('co-mocha');
const product = require('cartesian-product');

const gulp = require('./helpers/gulp-helper');
const yeoman = require('./helpers/yeoman-helper');
const unit = require('./helpers/unit-helper');
const linter = require('./helpers/linter-helper');
const jsdom = require('./helpers/jsdom-helper');
const combinations = require('../scripts/helpers/combinations');

describe('BitMate integration tests with jsdom', function () {
    this.timeout(0);

    combinations.full().forEach(options => {

        describe(`tests with ${options.server}-${options.client}-${options.modules}-${options.js}-${options.css}-${options.html}-${options.router}-${options.styling}`, function () {
            before(function * () {
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

            it('run "gulp serve" and e2e on Header', function * () {
                const url = yield gulp.serve();
                yield jsdom.run(url);
                gulp.killServe();
            });

            it('run "gulp serve:dist" and e2e on Header', function * () {
                const url = yield gulp.serveDist();
                yield jsdom.run(url);
                gulp.killServe();
            });

            after(() => {
                console.log(`tests with ${options.server}-${options.client}-${options.modules}-${options.js}-${options.css}-${options.html}-${options.router}-${options.styling} completed`);
            });
        });
    });
});