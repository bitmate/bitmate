'use strict';

const path = require('path');
const _ = require('lodash');
const co = require('co');
const helpers = require('yeoman-test');
const Promise = require('bluebird');
const mkdirp = require('mkdirp-promise');
const fs = require('mz/fs');

const generatorPath = path.join(__dirname, '../../generator-bitmate-web/generators/app');
const workPath = path.join(__dirname, '../../tests/work');
const depsPath = path.join(__dirname, '../../tests/deps');
const packageFolders = ['node_modules'];

const testDirectory = Promise.promisify(helpers.testDirectory);

let bitmate;

exports.prepare = function prepare() {
    bitmate = helpers.createGenerator('bitmate-web:app', [generatorPath], null);
    bitmate.env.cwd = workPath;

    return co(function *() {
        yield testDirectory(workPath);
        bitmate.fs.delete(`${workPath}/package.json`);
        yield mkdirp(depsPath);
        yield packageFolders.map(folder => mkdirp(path.join(depsPath, folder)));
        yield packageFolders.map(folder => fs.symlink(`../deps/${folder}`, folder));
        return bitmate;
    });
};

exports.run = function run(prompts) {
    if (_.isObject(prompts)) {
        helpers.mockPrompt(bitmate, prompts);
    }

    const run = Promise.promisify(bitmate.run.bind(bitmate));
    return co(function *() {
        yield run();
        return bitmate;
    });
};