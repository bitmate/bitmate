'use strict';

const _ = require('lodash');
const toposort = require('toposort');

const entryPoint = 'generator-bitmate-web';

function bitmateDeps(dep) {
    const name = _.replace(dep, '@oligibson/', '');
    const pkg = require(`../${name}/package.json`);
    return _.keys(pkg.dependencies)
        .filter(name => name.includes('bitmate'))
        .map(name => _.replace(name, '@oligibson/', ''));
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