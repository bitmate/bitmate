const product = require('cartesian-product');

const server = ['none'];
const client = ['react', 'angular1'];
const modules = ['webpack', 'bower'];
const js = ['babel', 'js'];
const css = ['css', 'scss', 'less'];
const styling = ['bootstrap', 'none'];

exports.full = function full() {
  return product([server, client, modules, js, css, styling])
    .map(combination => ({
      server: combination[0],
      client: combination[1],
      modules: combination[2],
      runner: 'gulp',
      html: 'html',
      js: combination[3],
      css: combination[4],
      router: combination[0] === 'angular1' ? 'uirouter' : 'router',
      styling: combination[5]
    }));
};
