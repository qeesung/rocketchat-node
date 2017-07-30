/**
 * Created by qeesung on 2017/4/16.
 */

const RocketChatClient = require("../lib/rocketChat").RocketChatClient;
const should = require("should");

const config = {
    protocol: "http",
    host: "127.0.0.1",
    port: "3000",
    username: "qeesung",
    password: "123456"
};

describe("test login and the logout", function () {
    let rocketChatClient = null;
    beforeEach(function (done) {
        config.onConnected = done;
        rocketChatClient = new RocketChatClient(config);
    });
    it("logout status should be success and the token should be null", function (done) {
        should(rocketChatClient.restClient.getHeader("X-Auth-Token")).not.be.null();
        should(rocketChatClient.restClient.getHeader("X-User-Id")).not.be.null();
        rocketChatClient.authentication.logout(function (err) {
            should(err).be.null();
            should(rocketChatClient.restClient.getHeader("X-Auth-Token")).not.be.ok();
            should(rocketChatClient.restClient.getHeader("X-User-Id")).not.be.ok();
            done();
        });
    });
});

describe("test 'me' interface to get user detail information", function () {
    let rocketChatClient = null;
    beforeEach(function (done) {
        config.onConnected = done;
        rocketChatClient = new RocketChatClient(config);
    });
    it("user name should equal to " + config.user, function (done) {
        rocketChatClient.authentication.me(function (err, body) {
            should(err).be.null();
            should.equal(body.username, config.username);
            done();
        });
    });
});
