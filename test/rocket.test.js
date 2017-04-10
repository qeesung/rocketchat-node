/**
 * author      : qeesung
 * email       : 1245712564@qq.com
 * filename    : rocket.test.js
 * create time : Wed Aug 10 23:35:56 2016
 * description : test the rocketchat api base on mocha and shouldjs
 */

var RocketChatApi = require('../lib/rocket-chat').RocketChatApi;
var should = require("should");

var config = {
    host: "127.0.0.1", // this is my personal rocketchat server hosted in my laptop
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("Test the rest api and rocketchat version version", function () {
    it("rest api version should not be below 0.1 and rocketchat should not be beblow 0.5", function (done) {
        var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
        rocketChatApi.version(function (err, body) {
            should(err).be.null();
            should(body).not.be.undefined;
            should(body).not.be.null;
            body.status.should.equal("success");
            body.versions.api.should.not.be.below(0.1);
            body.versions.rocketchat.should.not.be.below(0.5);
            done();
        });
    });
});

describe("test login and logout", function () {
    var rocketChatApi = null;
    var login;
    before(function (done) {
        rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
        rocketChatApi.login(function (err, body) {
            login = {
                err: err,
                body: body
            };

            done();
        });
    });

    it("login status should be success and the token should not be null", function (done) {
        should(login.err).be.null;
        should(login.body).not.be.null;
        should(rocketChatApi.token).not.be.null();
        login.body.status.should.equal("success");
        done();
    });

    it("logout status should be success and the token should be null", function (done) {
        rocketChatApi.logout(function (err, body) {
            should(err).be.null;
            should(body).not.be.null;
            should(rocketChatApi.token).be.null;
            body.status.should.equal("success");
            done();
        });
    });
});


describe("test create, join, leave rooms, and get list of public rooms", function () {
    var rocketChatApi = null;
    var testConfig = {
        host: config.host, // this is my personal rocketchat server hosted in my laptop
        port: config.port,
        user: config.user,
        password: config.password
    };
    beforeEach(function () {
        rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "v1");
    });

    xit("create room status should be success", function (done) {
        var roomName = "testRoom_" + Date.now();// create a room has unique name
        rocketChatApi.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            body.success.should.be.ok();
            body.channel.name.should.equal(roomName);
            done();
        });
    });

    xit("create a new room with a test user, and join it, then leave it", function (done) {
        var roomName = "testuser_testRoom_" + Date.now();// create a room has unique name
        rocketChatApi.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            var roomId = body.channel._id;
            // join the room
            rocketChatApi.joinRoom(roomId, function (err, body) {
                (!err).should.be.ok();
                rocketChatApi.leaveRoom(roomId, function (err, body) {
                    (!err).should.be.ok();
                    body.status.should.equal("success");
                    done();
                });

            });
        });
    });

    xit("create a new room with a uniqe name, then get the all public rooms to check", function (done) {

        var createdRoomId = 0;
        var roomName = "createdRoom_" + Date.now();// create a room has unique name
        rocketChatApi.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            var roomId = body.channel._id;
            rocketChatApi.getPublicRooms(function (err, body) {
                (!err).should.be.ok();
                body.status.should.equal("success");
                body.rooms.should.matchAny(function (room) {
                    room._id.should.equal(roomId);
                });
                done();
            });
        });
    });
    afterEach(function () {
        rocketChatApi = null;
    });
});


describe("test sending a message and get all messages in a room", function () {
    var rocketChatApi = null;
    beforeEach(function () {
        rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "v1");
    });

    it("sending a message", function (done) {
        var roomName = "createdRoom_" + Date.now();// create a room has unique name
        var message = "Hello World";
        rocketChatApi.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            var roomId = body.channel._id;
            rocketChatApi.sendMsg(roomId, message, function (err, body) {
                (!err).should.be.ok();
                body.success.should.be.true;
                done();
            });
        });
    });

    // get latest message not supported in newer api versions (yet)
    xit("sending a meesage, and get lastest messages", function (done) {
        var roomName = "createdRoom_" + Date.now();// create a room has unique name
        var message = "Hello World";
        rocketChatApi.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            var roomId = body.channel._id;
            rocketChatApi.joinRoom(roomId, function (err, body) {
                (!err).should.be.ok();
                rocketChatApi.sendMsg(roomId, message, function (err, body) {
                    (!err).should.be.ok();
                    rocketChatApi.getUnreadMsg(roomId, function (err, body) {
                        (!err).should.be.ok();
                        body.status.should.equal("success");
                        body.messages[0].msg.should.equal(message);
                        done();
                    });
                });
            });

        });
    });

    afterEach(function () {
        rocketChatApi = null;
    });
});
