/**
 * Created by qeesung on 2017/4/16.
 */

var RocketChatClient = require('../lib/rocketChat').RocketChatClient
var should = require("should");

var config = {
    host: "127.0.0.1", // this is my personal rocketchat server hosted in my laptop
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("test login and the logout", function () {
    var rocketChatClient = null;
    beforeEach(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done)
    })
    it("logout status should be success and the token should be null", function (done) {
        should(rocketChatClient.restClient.getHeader("X-Auth-Token")).not.be.null()
        should(rocketChatClient.restClient.getHeader("X-User-Id")).not.be.null()
        rocketChatClient.authentication.logout(function (err, result) {
            should(err).be.null()
            should(rocketChatClient.restClient.getHeader("X-Auth-Token")).not.be.ok()
            should(rocketChatClient.restClient.getHeader("X-User-Id")).not.be.ok()
            done()
        })
    })
})

describe("test 'me' interface to get user detail information", function () {
    var rocketChatClient = null;
    beforeEach(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done)
    })
    it("user name should equal to "+config.user, function (done) {
        rocketChatClient.authentication.me(function (err, body) {
            should(err).be.null();
            should.equal(body.username, config.user)
            done()
        })
    })
})
