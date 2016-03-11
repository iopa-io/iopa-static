/*
 * Copyright (c) 2015 Internet of Protocols Alliance (IOPA)
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

// DEPENDENCIES
const constants = require('iopa').constants,
    IOPA = constants.IOPA,
    SERVER = constants.SERVER
    
const send = require('./staticsend.js');
        
const STATIC = {CAPABILITY: "urn:io.iopa:static"  }
const packageVersion = require('../../package.json').version;
  
/**
 * IOPA Middleware 
 *
 * @class Static
 * @this app.properties  the IOPA AppBuilder Properties Dictionary, used to add server.capabilities
 * @constructor
 * @public
 */
function Static(app, root, opts) {
     app.properties[SERVER.Capabilities][STATIC.CAPABILITY] = {};
     app.properties[SERVER.Capabilities][STATIC.CAPABILITY][SERVER.Version] = packageVersion;
     
      opts = opts || {};

     // options
     opts.root = root;
     opts.index = opts.index || 'index.html';
     
     return function Static_invoke(context, next) {
    
      return send(context, context[IOPA.Path], opts).then(function filesendContinuation(){
                                                      if (context.response[IOPA.StatusCode] == null)
                                                      {
                                                      context = null;
                                                      return next()
                                                      }
                                                      context = null;
                                                      });
        };
}

module.exports = Static;