# Wiremock Toolkit
[![Build Status](https://travis-ci.org/vitorsalgado/wiremock-toolkit.svg?branch=master)](https://travis-ci.org/vitorsalgado/wiremock-toolkit)  

This repository contains a tool kit to start using [WireMock](http://wiremock.org/) in a development environment.  
It's already "dockerized" and comes with a tool which restarts WireMock every time a mapping or payload file is changed, making development process easier.  

## Requirements
* Docker;  
* Docker Compose.

## How To
The easiest way to bring the mock environment up is using `docker compose`. The are two docker compose files in the root of this repository. 
One is intended to use in a `C.I.` environment **(docker-compose.yml)** and the other, **(docker-compose-local.yml)**, is to use in a local environment during 
development process. The **docker-compose-local.yml** starts WireMock with a volume pointing the data folder to the host folder in `wiremock/data` and starts too 
the reloader tool which resets WireMock on every mapping change.

To start a local development environment, just execute: `docker-compose -f docker-compose-local.yml up --build`.

## Reloader Tool
The reloader tool is built with *Node.js* and is located on folder `wiremock-auto-reloader`. 

## License
This project is available under Apache Public License version 2.0. See [LICENSE](LICENSE).