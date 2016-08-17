'use strict';

var Inert = require('inert');
var Config = require('dotenv').config();
var LEX = require('letsencrypt-express');


var lex = LEX.create({
    configDir: Config.LETSENCRYPT_CONFIG_DIR,
    approveRegistration: function (hostname, cb) {
        cb(null, {
            domains: [Config.LETSENCRYPT_DOMAIN],
            email: Config.LETSENCRYPT_EMAIL,
            agreeTos: true
        });
    }
});

var hapi = require('hapi');
var https = require('spdy');
var server = new hapi.Server();
var acmeResponder = LEX.createAcmeResponder(lex);
var httpsServer = https.createServer(lex.httpsOptions).listen(Config.PORT || 8443);

server.connection({ listener: httpsServer, autoListen: false, tls: true });
server.register(Inert, function () {});

server.route([{
    method: 'GET',
    path: '/.well-known/acme-challenge',
    handler: function (request, reply) {
        var req = request.raw.req;
        var res = request.raw.res;

        reply.close(false);
        acmeResponder(req, res);
    }
}, {
    method: 'GET',
    path: '/{path*}',
    config: {
        handler: {
            directory: {
                path: './dist',
                listing: false,
                index: true
            }
        }
    }
}]);
