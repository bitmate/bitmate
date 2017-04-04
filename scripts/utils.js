'use strict';

const _ = require('lodash');
const exec = require('mz/child_process').exec;
const fs = require('mz/fs');
const path = require('path');
const deps = require('./deps');

const versionRegex = /("version" *: *")(\d+\.\d+\.\d+)(")/;

exports.folders = function *() {
  const folders = deps()
    .map(folder => folder.name);
  return folders;
};

exports.each = function *(callback) {
  const folders = yield exports.folders();
  let results = folders.map(folder => ({
    folder,
    result: callback(folder)
  }));
  if (results.length > 0 &&
      _.isObject(results[0].result) &&
      _.isFunction(results[0].result.then)) {
    results = results.map(result => {
      return {
        folder: result.folder,
        promise: result.result
      };
    });
    const promises = results.map(result => result.promise);
    const promiseResults = yield Promise.all(promises);
    promiseResults.forEach((result, i) => {
      results[i].result = result;
    });
  }
  return results;
};

exports.execOnEach = function *(command) {
  const results = yield exports.each(folder => {
    return exec(command, {cwd: folder});
  });
  return results;
};
exports.exec = function *(command) {
  return yield exec(command);
};

exports.readVersion = function *(folder) {
  const file = yield fs.readFile(path.join(folder, 'package.json'));
  const version = versionRegex.exec(file)[2];
  return version;
};

exports.updateSubmoduleVersion = function *(folder, submodule, version) {
  console.log('version', version);
  const regex = new RegExp(`("@oligibson\\/${submodule}" *: *")((\\^)?\\d+\\.\\d+\\.\\d+)(")`);
  const filePath = path.join(folder, 'package.json');
  const file = yield fs.readFile(filePath);
  const newFile = file.toString().replace(regex, `$1$3${version}$4`);
  // const newFile = file.toString().match(regex);
  console.log(newFile);
  yield fs.writeFile(filePath, newFile);
};

exports.updateVersion = function *(folder, version) {
  const folders = yield exports.folders();
  for (const submodule of folders) {
    yield exports.updateSubmoduleVersion(folder, submodule, version);
  }
  const filePath = path.join(folder, 'package.json');
  const file = yield fs.readFile(filePath);
  const newFile = file.toString().replace(versionRegex, `$1${version}$3`);
  yield fs.writeFile(filePath, newFile);
};
