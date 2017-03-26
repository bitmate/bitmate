'use strict';

const path = require('path');
const spawn = require('cross-spawn');

const combinations = require('./helpers/combinations');
const github = require('./github.creds.json');

const githubApiUrl = 'https://api.github.com/repos/oligibson/bitmate';
const githubUploadUrl = 'https://uploads.github.com/repos/oligibson/bitmate';
const version = process.argv[process.argv.length - 1];


function exec(command, args) {
  const result = spawn.sync(command, args);
  try {
    return JSON.parse(result.stdout.toString());
  } catch (error) {
    return result.stdout.toString();
  }
}

function githubApiRequest(partialUrl, params) {
  console.log(params.method, githubApiUrl + partialUrl, params.body);
  return exec('curl', [
    '-H', `Authorization: token ${github.token}`,
    '-X', params.method,
    '-d', params.body,
    githubApiUrl + partialUrl
  ]);
}

function githubUploadRequest(partialUrl, params) {
  console.log(params.method, githubUploadUrl + partialUrl, params.filePath);
  return exec('curl', [
    '-H', `Authorization: token ${github.token}`,
    '-H', `Content-Type: application/zip`,
    '-X', params.method,
    '--data-binary', `@${params.filePath}`,
    githubUploadUrl + partialUrl
  ]);
}

const createTagResult = githubApiRequest('/releases', {
  method: 'POST',
  body: JSON.stringify({tag_name: version}) // eslint-disable-line camelcase
});

console.log(createTagResult);

const tag = githubApiRequest(`/releases/tags/${version}`, {
  method: 'GET',
  body: ''
});

console.log('Tag ID', tag.id);

combinations.full().forEach(options => {
  const fileName = `${options.server}-${options.client}-${options.modules}-${options.js}-${options.css}-${options.html}-${options.router}-${options.styling}.zip`;
  const combinationPath = path.join(__dirname, `../dist/${fileName}`);

  const uploadResponse = githubUploadRequest(`/releases/${tag.id}/assets?name=${fileName}`, {
    method: 'POST',
    filePath: combinationPath
  });
  if (uploadResponse.message) {
    console.log('Upload response has message', uploadResponse);
  }
});
