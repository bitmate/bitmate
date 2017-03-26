const co = require('co');
const path = require('path');

const exec = require('../exec');

const cwd = path.join(__dirname, '../..');
const version = process.argv[process.argv.length - 1];

try {
  co(function *() {
    if (!version) {
      console.log('Deploy on GitHub only on tags and first build');
      return;
    }

    console.log('Deploying to GitHub for', version);

    yield exec('node', ['scripts/dist'], {cwd}).promise;
    yield exec('node', ['scripts/upload', version], {cwd}).promise;
  });
} catch (error) {
  console.log('Something went wrong', error);
}
