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

    var wsClient = new net.WsClient(config.protocol.ws, config.host, config.port, "/websocket");

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
    describe("Unit", function () {
        describe("Headers", function () {
            var headerKey = "test";
            var headerValue = "header";

            it("should be able to add headers", function (done) {
                restClient.setHeader(headerKey, headerValue);
                restClient.getHeader(headerKey).should.be.equal(headerValue);
                done();
            });

            it("should be able to remove headers", function (done) {
                restClient.setHeader(headerKey, headerValue);
                restClient.removeHeader(headerKey);
                (restClient.getHeader(headerKey) === undefined).should.be.true();
                done();
            });
        })
    });

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