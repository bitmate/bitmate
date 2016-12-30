'use strict';

const _ = require('lodash');
const toposort = require('toposort');

const entryPoint = 'generator-bitmate-web';

function bitmateDeps(dep) {
    const pkg = require(`../${dep}/package.json`);
    return _.keys(pkg.dependencies)
        .filter(dep => dep.includes('bitmate'));
}

function computeDeps(folder) {
    const deps = bitmateDeps(folder);
    const result = deps.map(dep => [folder, dep]);
    deps.forEach(dep => {
        Array.prototype.push.apply(result, computeDeps(dep));
    });
    return result;
}

module.exports = function deps() {
    const deps = toposort(computeDeps(entryPoint)).reverse();
    return deps.map(dep => ({
        name: dep,
        deps: bitmateDeps(dep)
    }));
};