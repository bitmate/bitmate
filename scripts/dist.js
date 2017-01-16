'use strict';

const path = require('path');
const co = require('co');
const helpers = require('yeoman-test');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-promise');
const Promise = require('bluebird');

const output = require('./helpers/mute');
const combinations = require('./helpers/combinations');
const zip = require('./helpers/zip');

const generatorPath = path.join(__dirname, '../generator-bitmate-web/generators/app');

co(function *() {
  try {
    yield rimraf(path.join(__dirname, `../dist`));

    for (const options of combinations.full()) {
      const combinationPath = path.join(__dirname, `../dist/${options.server}-${options.client}-${options.modules}-${options.js}-${options.css}-${options.html}-${options.router}-${options.styling}`);
      yield mkdirp(combinationPath);
      const fountain = helpers.createGenerator('bitmate-web:app', [generatorPath], null, {
        'skipInstall': true,
        'skip-welcome-message': true
      });
      fountain.env.cwd = combinationPath;
      helpers.mockPrompt(fountain, options);
      const run = Promise.promisify(fountain.run.bind(fountain));
      output.mute();
      yield run();
      output.unmute();
      yield zip.zipFolder(combinationPath, `${combinationPath}.zip`);
      console.log('Generated', combinationPath);
    }
  } catch (error) {
    console.log('Something went wrong', error);
  }
});
