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

// global.Promise = require('bluebird');

const static = require('../index.js'),
    stubServer = require('iopa-test').stubServer,
    Pipeline = require('../index.js').Pipeline,
    Cache = require('../index.js').Cache,
    ClientSend = require('../index.js').ClientSend


var should = require('should');
const iopa = require('iopa');

describe('#Static()', function () {

    var seq = 0;

    it('should serve Static', function (done) {

        var app = new iopa.App();
        app.use(stubServer);
        app.use(stubServer.continue);
        app.use(static(app, './test/public', { 'sync': true }));

        var server = app.createServer("stub:")

        server.connect("urn://localhost").then(function (client) {
            var context = client.create("/projector", "GET");
            client["iopa.Events"].on("response", function (response) {
                var responseBody = response["iopa.Body"].toString();
                responseBody.should.equal('Hello World');
                done();
            })

            context["iopa.Body"].end("HELLO WORLD " + seq++);
        });
    });
});
