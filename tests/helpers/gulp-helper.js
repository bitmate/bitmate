'use strict';

const exec = require('../../scripts/exec');
const spy = require('through2-spy');
const regex = /\[BS\] Access URLs:\n -*\n.*\n *External: ([^\s]*)/;
const serverRegex = /\[BS\] Proxying: ([^\s]*)/;
const testRegex = /Finished 'test'/;

let serveProcess = null;

function execServe(task, options) {
    return new Promise(resolve => {
        try {
            let logs = '';
            if (serveProcess !== null) {
                console.warn('Server process still running !!!!');
            }
            serveProcess = exec('./node_modules/.bin/gulp', [task], {stdio: 'pipe'}).process;
            serveProcess.stderr.pipe(process.stderr);
            serveProcess.stdout.pipe(spy(chunk => {
                logs += chunk.toString();
                const result = options.server === 'none' ? regex.exec(logs) : serverRegex.exec(logs);
                if (result !== null) {
                    resolve(result[1]);
                }
            })).pipe(process.stdout);
        } catch (error) {
            console.error('Server error', error);
        }
    });
}

exports.serve = function serve(options) {
    return execServe(['serve'], options);
};

exports.serveDist = function serveDist(options) {
    return execServe(['serve:dist'], options);
};

exports.killServe = function killServe() {
    try {
        serveProcess.kill('SIGTERM');
        serveProcess = null;
        console.log('Gulp serve killed!');
    } catch (error) {
        console.error('Server kill error', error);
    }
};

exports.test = function () {
    return new Promise(resolve => {
        let logs = '';
        const testProcess = exec('./node_modules/.bin/gulp', ['test'], {stdio: 'pipe'}).process;
        testProcess.stderr.pipe(process.stderr);
        testProcess.stdout.pipe(spy(chunk => {
            logs += chunk.toString();
            const result = testRegex.exec(logs);
            if (result !== null) {
                testProcess.kill('SIGTERM');
                resolve(logs);
            }
        })).pipe(process.stdout);
    });
};