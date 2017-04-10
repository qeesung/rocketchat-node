var net = require('../lib/net');
var should = require("should");

var config = {
    protocol: {
        rest: "http",
        ws: "ws"
    },
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("WsClient", function () {
    var loginData = {
        user: { "username": config.user },
        password: config.password
    };

    var wsClient = new net.WsClient(config.protocol.ws, config.host, config.port, "websocket");

    describe("Integration", function () {
        it("should be able to connect and call a method", function (done) {
            wsClient.request("method", "login", [loginData], function (err, data) {
                should(err).be.null;
                should(data).not.be.null;
                done();
            });
        });
    });
});

describe("RestClient", function () {

    var restClient = new net.RestClient(config.protocol.rest, config.host, config.port, "/api/v1/");

    describe("Integration", function () {
        it("should be able to connect and call a method", function (done) {
            restClient.request("GET", "info", null, function (err, body) {
                (err === null).should.be.true();
                body.success.should.be.true;
                done();
            });
        });
    });
})