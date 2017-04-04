'use strict';

const path = require('path');
const co = require('co');
const bitmateDeps = require('./deps');
const fs = require('mz/fs');
const _ = require('lodash');

const deps = bitmateDeps();

co(function *() {
    try {
        for (const dep of deps) {
            const name = _.replace(dep.name, '@oligibson/', '');
            const folder = path.join(__dirname, '..', name);
            for (const sub of dep.deps) {
                console.log(folder, '➜', `unlink ${sub}`);
                yield fs.unlink(`./${name}/node_modules/@oligibson/${sub}`);
            }
        }
    } catch (e) {
        console.error('arg', e.stack);
    }
});