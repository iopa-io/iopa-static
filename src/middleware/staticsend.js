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

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var normalize = path.normalize;
var basename = path.basename;
var extname = path.extname;
var pathResolve = path.resolve;
var join = path.join;
var mime = require('mime');
var util = require('util');

const constants = require('iopa').constants,
    IOPA = constants.IOPA,
    SERVER = constants.SERVER

/**
 * Expose `send()`.
 */

module.exports = iopaStaticSend;

/**
 * Send file at `path` with the
 * given `options` to the iopa context.
 *
 * @param {Context} iopa context
 * @param {String} path
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

function iopaStaticSend(context, path, opts) {
    opts = opts || {};
    
    return new Promise(function iopaStaticLoad(resolve, reject){
                       var root = opts.root ? normalize(pathResolve(opts.root)) : '';
                       var index = opts.index;
                       var maxage = opts.maxage || 0;
                       var hidden = opts.hidden || false;
                       var sync = opts.sync || false;
                       opts = null;
                       
                       
                       // normalize path
                       path = decode(path);
                       if (path =="")
                         path = "/";
                         
                          var trailingSlash = '/' == path[path.length - 1];
                    
                       if (-1 == path) return reject('failed to decode');
                       
                       // null byte(s)
                       if (~path.indexOf('\0')) return reject('null bytes');
                       
                       // index file support
                       if (index && trailingSlash) path += index;
                       
                       // malicious path
                       if (!root && !isAbsolute(path)) return reject('relative paths require the .root option');
                       if (!root && ~path.indexOf('..')) return reject('malicious path');
                       
                       // relative to root
                       path = normalize(join(root, path));
                       
                       // out of bounds
                       if (root && 0 != path.indexOf(root)) return reject('malicious path');
                       
                       // hidden file support, ignore
                       if (!hidden && leadingDot(path)) return resolve();
                       var stats;
                       try
                       {
                       stats = fs.statSync(path);
                       }
                       catch (err) {
                       return resolve(null);
                       }
                       
                       if (stats.isDirectory())
                       {
                       return resolve(null);
                       }
                       var contentType =  mime.lookup(path) || 'application/octet-stream';
                       
                       context.response.writeHead(200, {
                                               'Content-Type' : contentType,
                                               'Last-Modified' : stats.mtime.toUTCString(),
                                               'Content-Length': stats.size + '',
                                               'Cache-Control': 'max-age=' + (maxage / 1000 | 0)});
                       
                       if (sync)
                       {
                       var bodyBuffer = fs.readFileSync(path);
                       context.response.end(bodyBuffer);
                       bodyBuffer = null;
                       context = null;
                       return resolve();
                       }
                       else
                       {
                       
                       var stream = fs.createReadStream(path, { flags: 'r',
                                                        encoding: null,
                                                        autoClose: true
                                                        });
                       
                       stream.on('error', function(err){
                                 console.log(err);
                                 stream = null;
                                 context = null;
                                 
                                 reject(err);
                                 
                                 });
                       
                       stream.on('end', function(){
                                 context.response.end();
                                 stream = null;
                                 context = null;
                                 resolve();
                            
                                 });
                       
                       stream.pipe(context.response[IOPA.Body]);
                       
                       return;
                       }
                       });
}
/**
 * Check if it's hidden.
 */

function leadingDot(path) {
    return '.' == basename(path)[0];
}

/**
 * Decode `path`.
 */

function decode(path) {
    try {
        return decodeURIComponent(path);
    } catch (err) {
        return -1;
    }
}

/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

function isAbsolute(path){
    if ('/' == path[0]) return true;
    if (':' == path[1] && '\\' == path[2]) return true;
    if ('\\\\' == path.substring(0, 2)) return true; 
}