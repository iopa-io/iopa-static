/*
 * Copyright (c) 2016 Internet of Protocols Alliance (IOPA)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * DEPENDENCIES
 *     note: npm include 'bluebird' if no Promise object exists
 */

const static = require('./index.js'),
    iopa = require('iopa'),
    http = require('http'),
    iopaConnect = require('iopa-connect')

var app = new iopa.App();

app.use(static(app, './test/public'));

app.use(function(next) {
    this.log.info("HELLO WORLD");
    return Promise.resolve("DONE"); // stop processing in chain
});

http.createServer(app.buildHttp()).listen(8000);
