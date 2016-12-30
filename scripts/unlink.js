'use strict';

const path = require('path');
const co = require('co');
const bitmateDeps = require('./deps');
const fs = require('mz/fs');

const deps = bitmateDeps();

co(function *() {
    try {
        for (const dep of deps) {
            const folder = path.join(__dirname, '..', dep.name);
            for (const sub of dep.deps) {
                console.log(folder, '➜', `unlink ${sub}`);
                yield fs.unlink(`./${dep.name}/node_modules/${sub}`);
            }
        }
    } catch (e) {
        console.error('arg', e.stack);
    }
});