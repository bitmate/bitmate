'use strict';

const expect = require('chai').expect;

exports.unitTests = function (result, options) {
    if (options.client !== 'none'){
        expect(result).to.contain('SUCCESS');
    }
    if (options.server !== 'none'){
        console.log('Checking Server');
        expect(result).not.to.contain('failing');
    }
};