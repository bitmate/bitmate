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
        ['react', 'angular1', 'angular2'],
        ['bower', 'webpack'],
        ['babel', 'js']
    ])
    // Angular 2 and Bower are not supported right now
    .filter(combination => combination[0] !== 'angular2' || combination[1] !== 'bower');

    combinations.forEach(combination => {
        const options = {
            server: 'none',
            client: combination[0],
            runner: 'gulp',
            modules: combination[1],
            css: 'scss',
            js: combination[2],
            router: combination[0] === 'angular1' ||  combination[0] === 'angular2' ? 'uirouter' : 'router',
            html: 'html',
            styling: 'none'
        };

        describe(`tests with ${options.client}, ${options.modules}, ${options.js}`, function () {
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
                console.log(`tests with ${options.client}, ${options.modules}, ${options.js} completed`);
            });
        });
    });
});