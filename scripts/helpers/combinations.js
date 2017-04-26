const product = require('cartesian-product');

const server = ['none', 'express'];
const client = ['react', 'angular1', 'angular2'];
const modules = ['webpack', 'bower'];
const js = ['babel', 'js'];
const css = ['css', 'scss', 'less'];
const styling = ['bootstrap', 'none'];
const router = {
    angular1: ['uirouter', 'ngroute'],
    angular2: ['uirouter', 'ngroute'],
    react: ['router', 'none']
};

const ng2bowerFilter = combination => combination[1] !== 'angular2' || combination[2] !== 'bower';

exports.full = function full() {
    const combinations =  product([server, client, modules, js, css, styling])
        .filter(ng2bowerFilter)
        .map(combination => {
            return router[combination[1]].map(router => ({
                server: combination[0],
                client: combination[1],
                modules: combination[2],
                runner: 'gulp',
                html: 'html',
                js: combination[3],
                css: combination[4],
                router: router,
                styling: combination[5]
            }))
        });

    return [].concat.apply([], combinations);
};
