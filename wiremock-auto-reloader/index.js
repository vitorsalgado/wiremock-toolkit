'use strict';

const Request = require('request-promise').defaults({ pool: { maxSockets: process.env.RELOADER_MAX_HTTP_SOCKETS || 1 } });
const Chokidar = require('chokidar');
const IP = require('ip');

const argv = process.argv

const wiremockPort = argv[argv.indexOf('-p') + 1] || (process.env.WIREMOCK_PORT || '3000')
const wiremockDataDir = argv[argv.indexOf('-d') + 1] || (process.env.WIREMOCK_DATA || './wiremock/data')
const wiremockHost = process.env.WIREMOCK_HOST || 'http://localhost';
const wiremockBaseURI = `${wiremockHost}:${wiremockPort}`

const watcher = Chokidar.watch(wiremockDataDir, { ignored: [/(^|[\/\\])\../], persistent: true, ignoreInitial: true });

const onFileChange = (event, path) => {
  const valid = path && path.substr(path.length - 5) === '.json' && path.length > 5;

  if (!valid) {
    return;
  }

  console.log(`\x1b[33mStub change detected [${event}]. Reseting WireMock mappings ...\x1b[0m`);

  Request({ uri: `${wiremockBaseURI}/__admin/mappings/reset`, method: 'POST' })
    .then(() => console.log('\x1b[32mWireMock mappings reseted!', '\x1b[0m'))
    .catch(err => console.error('\x1b[31mWireMock is unavailable now!', err, '\x1b[0m'));
};

watcher
  .on('ready', () => console.log(
    `\x1b[32mWireMock Reloader Tool ready!\nContext: ${process.cwd()}\nWireMock: ${wiremockBaseURI}\nListening for changes on: ${wiremockDataDir}\nChange your API Base URI to: http://${IP.address()}:${wiremockPort}\n\n`, '\x1b[0m'))
  .on('error', error => console.error(error))
  .on('add', path => onFileChange('add', path))
  .on('change', path => onFileChange('change', path))
  .on('unlink', path => onFileChange('unlink', path));
