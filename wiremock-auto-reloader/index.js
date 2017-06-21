'use strict';

const Request = require('request-promise');
const Chokidar = require('chokidar');

const WIREMOCK_DATA = process.env.WIREMOCK_DATA || './data';
const WIREMOCK_HOST = process.env.WIREMOCK_HOST || 'wiremock';
const WIREMOCK_PORT = process.env.WIREMOCK_PORT || 3001;

const watcher = Chokidar.watch(WIREMOCK_DATA, { ignored: /[/\\]\./, persistent: true, ignoreInitial: true });

const onFileChange = (event, path) => {

    const valid = path && path.length > 5 && path.substr(path.length - 5) === '.json';

    if (!valid) {
        return;
    }

    console.log('File change detected. Reseting Wiremock mappings ...');

    const options = {
        url: `http://${WIREMOCK_HOST}:${WIREMOCK_PORT}/__admin/mappings/reset`,
        method: 'POST',
        json: true
    };

    Request(options)
        .then(() => console.log('Wiremock mappings reseted!'))
        .catch(() => console.log('Wiremock is unavailable now!'));
};

watcher
    .on('add', (path) => onFileChange('add', path))
    .on('change', (path) => onFileChange('change', path))
    .on('unlink', (path) => onFileChange('unlink', path));

console.log('Wiremock Auto Reloader ready');
