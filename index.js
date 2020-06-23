#!/usr/bin/env node

'use strict'

require('dotenv').config()

const Spawn = require('child_process').spawn
const Program = require('commander')
const Config = require('./config')

const SHELL_OPTIONS = { stdio: 'inherit', shell: true }

const argv = process.argv
if (argv.length <= 2) argv.push('--help')

const initReloader = options =>
  Spawn('node', [`${__dirname}/wiremock-auto-reloader/index.js`, '-p', options.port, '-d', options.dataDir], SHELL_OPTIONS)

Program
  .version(Config.version)
  .description('Mock API Tool-Kit')

Program
  .command('mock')
  .option('-d, --dataDir <dataDir>', 'WireMock data directory. Defaults to wiremock/data')
  .option('-p, --port <port>', 'WireMock server port. Defaults to 3000')
  .description('Start default mock tool kit server')
  .action(({ port, dataDir }) => {
    const wiremockDataDir = dataDir || Config.wiremock.dataDir
    const wiremockPort = port || Config.wiremock.port

    initReloader({ port: wiremockPort, dataDir: wiremockDataDir })
    Spawn('java',
      ['-jar', `${__dirname}/wiremock/wiremock.jar`, `--root-dir=${wiremockDataDir}`, `--port=${wiremockPort}`, '--verbose'],
      SHELL_OPTIONS)
  })

Program
  .command('mock-proxy')
  .option('-d, --dataDir <dataDir>', 'WireMock data directory. Defaults to wiremock/data')
  .option('-p, --port <port>', 'WireMock server port. Defaults to 3000')
  .description('Start mock tool kit with WireMock in proxy-all mode. The proxy-all URL must be set via environment variable or with your local .env file')
  .action(({ port, dataDir }) => {
    const wiremockDataDir = dataDir || Config.wiremock.dataDir
    const wiremockPort = port || Config.wiremock.port

    initReloader({ port: wiremockPort, dataDir: wiremockDataDir })
    Spawn('java',
      ['-jar', `${__dirname}/wiremock/wiremock.jar`, `--root-dir=${wiremockDataDir}`, `--port=${wiremockPort}`, '--verbose', `--proxy-all=${Config.wiremock.proxyTo}`],
      SHELL_OPTIONS)
  })

Program.parse(argv)
