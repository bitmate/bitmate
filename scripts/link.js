'use strict';

const path = require('path');
const co = require('co');
const bitmateDeps = require('./deps');
const exec = require('./exec');

const deps = bitmateDeps();

const stdio = 'inherit';

co(function *() {
    try {
        for (const dep of deps) {
            const folder = path.join(__dirname, '..', dep.name);
            console.log(folder, '➜', 'npm link');
            yield exec('npm', ['link'], {cwd: folder, stdio}).promise;
            for (const sub of dep.deps) {
                console.log(folder, '➜', `npm link ${sub}`);
                yield exec('npm', ['link', sub], {cwd: folder, stdio}).promise;
            }
        }
    } catch (e) {
        console.error('arg', e.stack);
    }
});