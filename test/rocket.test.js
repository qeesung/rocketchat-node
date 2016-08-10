/**
 * author      : qeesung
 * email       : 1245712564@qq.com
 * filename    : rocket.test.js
 * create time : Wed Aug 10 23:35:56 2016
 * description : test the rocketchat api base on mocha and shouldjs
 */

var RocketChatApi = require('../lib/rocket-chat').RocketChatApi;
var should = require("should");

describe("Test the rest api and rocketchat version version",function () {
    it("rest api version should greater than 0.1 and rocketchat should greater than 0.5", function (done) {
        var config = {
            host:"192.168.1.102", // this is my personal rocketchat server hosted in my laptop
            port:"3000",
            user:"qeesung",
            password:"123456"
        };
        var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
        rocketChatApi.version(function (err, body) {
            (!err).should.be.ok();
            body.status.should.equal("success");
            body.versions.api.should.not.be.below(0.1);
            body.versions.rocketchat.should.not.be.below(0.5);
            done();
        });
    });
});


describe("test login the logout",function () {
    var rocketChatApi ;
    beforeEach(function () {
        var config = {
            host:"192.168.1.102",
            port:"3000",
            user:"qeesung",
            password:"123456"
        };
        rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
    });
    it("login status should be success", function (done) {
        rocketChatApi.login(function (err, body) {
            (!err).should.be.ok();
            body.status.should.equal("success");
            done();
        });
    });
});
