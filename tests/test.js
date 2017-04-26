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
        ['none', 'express'],
        ['react', 'angular1', 'angular2'],
        ['bower', 'webpack'],
        ['babel', 'js']
    ])
    // Angular 2 and Bower are not supported right now
    .filter(combination => combination[1] !== 'angular2' || combination[2] !== 'bower');

    combinations.forEach(combination => {
        const options = {
            server: combination[0],
            client: combination[1],
            runner: 'gulp',
            modules: combination[2],
            css: 'scss',
            js: combination[3],
            router: combination[1] === 'angular1' ||  combination[1] === 'angular2' ? 'uirouter' : 'router',
            html: 'html',
            styling: 'bootstrap'
        };

        describe(`tests with ${options.server}, ${options.client}, ${options.modules}, ${options.js}`, function () {
            before(function * () {
                yield yeoman.prepare();
                yield yeoman.run(options);
            });

            it('test linter', function * () {
                yield linter.linterTest(options);
            });

            it('run "gulp test"', function * () {
                const result = yield gulp.test();
                unit.unitTests(result, options);
            });

            it('run "gulp serve" and e2e on Header', function * () {
                const url = yield gulp.serve(options);
                yield jsdom.run(url);
                gulp.killServe();
            });

            it('run "gulp serve:dist" and e2e on Header', function * () {
                const url = yield gulp.serveDist(options);
                yield jsdom.run(url);
                gulp.killServe();
            });

            after(() => {
                console.log(`tests with ${options.server}, ${options.client}, ${options.modules}, ${options.js} completed`);
            });
        });
    });
});