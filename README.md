# [![IOPA](http://iopa.io/iopa.png)](http://iopa.io)<br> iopa-static 

[![Build Status](https://api.shippable.com/projects/56e211399d043da07bb527cb/badge?branchName=master)](https://app.shippable.com/projects/56e211399d043da07bb527cb) 
[![IOPA](https://img.shields.io/badge/iopa-middleware-99cc33.svg?style=flat-square)](http://iopa.io)
[![limerun](https://img.shields.io/badge/limerun-certified-3399cc.svg?style=flat-square)](https://nodei.co/npm/limerun/)

[![NPM](https://nodei.co/npm/iopa-static.png?downloads=true)](https://nodei.co/npm/iopa-static/)

## About
`iopa-static` is IOPA middleware for serving static files

Written in plain javascript for maximum portability to constrained devices

## Status

Working prototype


## Installation

    npm install iopa-static

## Usage
``` js
const iopa = require('iopa'),
    iopaConnect = require('iopa-connect')
    static = require('iopa-static'),
    http = require('http')

var app = new iopa.App();

app.use(static(app, './public'));

http.createServer(app.buildHttp()).listen(8000);
``` 
