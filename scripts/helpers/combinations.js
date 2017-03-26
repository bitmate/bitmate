const product = require('cartesian-product');

const server = ['none'];
const client = ['react', 'angular1'];
const modules = ['webpack', 'bower'];
const js = ['babel', 'js'];
const css = ['css', 'scss', 'less'];
const styling = ['bootstrap', 'none'];
const router = {
    angular1: ['uirouter', 'ngroute'],
    react: ['router', 'none']
};

exports.full = function full() {
    const combinations =  product([server, client, modules, js, css, styling])
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
