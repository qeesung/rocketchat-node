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
    host: "192.168.1.102", // this is my personal rocketchat server hosted in my laptop
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("Test the rest api and rocketchat version version", function () {
    it("rest api version should not be below 0.1 and rocketchat should not be beblow 0.5", function (done) {
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

describe("[multiple-api-versions] test multiple api versions", function () {
    it("should not add a version for alpha versions of gitlab", function (done) {
        var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
        rocketChatApi.makeUri("url").should.be.equal("http://192.168.1.102:3000/api/url");
        done();
    });

    it("should add a version to the base uri for alpha versions of gitlab", function (done) {
        var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "v1");
        rocketChatApi.makeUri("url").should.be.equal("http://192.168.1.102:3000/api/v1/url");
        done();
    });
});

describe("[versionRequestData] test single versions", function () {
    describe("nonexisting version", function () {
        var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "please-never-exist-as-version");

        it("should fail", function (done) {
            var fail;
            try {
                rocketChatApi.getRequestData("sendMsg");
            } catch (err) {
                err = fail;
            }

            should(fail).not.be.null;
            done();
        });
    })

    describe("nonexisting function", function () {
        var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);

        it("should fail", function (done) {
            var fail;
            try {
                rocketChatApi.getRequestData("please-never-exist-as-function");
            } catch (err) {
                err = fail;
            }

            should(fail).not.be.null;
            done();
        });
    })

    describe("sendMsg", function () {
        describe("alpha version", function () {
            var requestData;

            before(function () {
                var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
                requestData = rocketChatApi.getRequestData("sendMsg");
            });

            it("should return the correct path for this version ", function (done) {
                var roomId = "roomId";
                should(requestData).not.be.null;
                requestData.path({ roomId: roomId }).should.be.equal('rooms/' + roomId + "/send");
                done();
            });
        });

        describe("version1", function () {
            var requestData;

            before(function () {
                var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "v1");
                requestData = rocketChatApi.getRequestData("sendMsg");
            });

            it("should return the correct path for this version ", function (done) {
                var roomId = "roomId";
                var message = "string";
                var data = { roomId: roomId, message: message };
                should(requestData).not.be.null;
                requestData.path(data).should.be.equal('chat.postMessage');
                requestData.body(data).should.be.eql({
                    "roomId": roomId,
                    "text": message
                });
                done();
            });
        })
    });

    describe("setTopic", function () {
        var requestData, rocketChatApi;

        describe("alpha version", function () {

            before(function () {
                rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
            });

            it("should throw an exception", function (done) {
                var error = null;
                try {
                    requestData = rocketChatApi.getRequestData("setTopic");
                } catch (err) {
                    error = err;
                }

                should(error).not.be.null;
                error.message.should.be.equal("Method not supported in this version");
                done();
            });
        });

        describe("version1", function () {
            var requestData;

            before(function () {
                var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "v1");
                requestData = rocketChatApi.getRequestData("setTopic");
            });

            it("should fail on missing data ", function (done) {
                var error = null;
                try {
                    requestData.body(null);
                } catch (err) {
                    error = err;
                }
                should(error).not.null;
                error.message.should.be.equal("data cannot be missing");
                done();
            });

            it("should fail on missing roomId ", function (done) {
                var data = { roomId: "roomId" };
                var error = null;
                try {
                    requestData.body(data);
                } catch (err) {
                    error = err;
                }
                should(error).not.null;
                error.message.should.be.equal("topic cannot be missing");
                done();
            });

            it("should fail on missing topic ", function (done) {
                var data = { topic: "topic" };
                var error = null;
                try {
                    requestData.body(data);
                } catch (err) {
                    error = err;
                }

                should(error).not.be.null;
                error.message.should.be.equal("roomId cannot be missing");
                done();
            });

            it("should return the correct path for this version ", function (done) {
                var roomId = "roomId";
                var topic = "topic";
                var data = { roomId: roomId, topic: topic };
                should(requestData).not.be.null;
                requestData.path(data).should.be.equal('channels.setTopic');
                requestData.body(data).should.be.eql({
                    "roomId": roomId,
                    "topic": topic
                });
                done();
            });
        })
    })
})

describe("test login the logout", function () {
    var rocketChatApi = null;
    beforeEach(function () {
        rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
    });

    it("login status should be success", function (done) {
        rocketChatApi.login(function (err, body) {
            (!err).should.be.ok();
            body.status.should.equal("success");
            done();
        });
    });

    it("after login,the token should not be null", function (done) {
        rocketChatApi.login(function (err, body) {
            (!err).should.be.ok();
            (!!rocketChatApi.token).should.be.ok();
            done();
        });
    });

    it("logout status should be sucess", function (done) {
        rocketChatApi.login(function (err, body) {
            rocketChatApi.logout(function (err, body) {
                (!err).should.be.ok();
                body.status.should.equal("success");
                done();
            });
        });
    });

    it("after logout, the token should be null", function (done) {
        rocketChatApi.login(function (err, body) {
            rocketChatApi.logout(function (err, body) {
                (!err).should.be.ok();
                (!rocketChatApi.token).should.be.ok();
                done();
            });
        });
    });

    afterEach(function () {
        rocketChatApi = null;
    });
});


describe("test create, join, leave rooms, and get list of public rooms", function () {
    var rocketChatApi = null;
    var testConfig = {
        host: "192.168.1.102", // this is my personal rocketchat server hosted in my laptop
        port: "3000",
        user: "testuser",
        password: "123456"
    };
    beforeEach(function () {
        rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
    });

    it("create room status should be success", function (done) {
        var roomName = "testRoom_" + Date.now();// create a room has unique name
        rocketChatApi.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            body.success.should.be.ok();
            body.channel.name.should.equal(roomName);
            done();
        });
    });

    it("create a new room with a test user, and join it", function (done) {
        var testUserClient = new RocketChatApi('http', testConfig.host, testConfig.port, testConfig.user, testConfig.password);
        var roomName = "testuser_testRoom_" + Date.now();// create a room has unique name
        testUserClient.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            var roomId = body.channel._id;
            // join the room
            rocketChatApi.joinRoom(roomId, function (err, body) {
                (!err).should.be.ok();
                body.status.should.equal("success");
                done();
            });
        });
    });

    it("create a new room with a test user, and join it, then leave it", function (done) {


        var testUserClient = new RocketChatApi('http', testConfig.host, testConfig.port, testConfig.user, testConfig.password);
        var roomName = "testuser_testRoom_" + Date.now();// create a room has unique name
        testUserClient.createRoom(roomName, function (err, body) {
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

    it("create a new room with a uniqe name, then get the all public rooms to check", function (done) {

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
        rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
    });

    it("sending a meesage", function (done) {
        var roomName = "createdRoom_" + Date.now();// create a room has unique name
        var message = "Hello World";
        rocketChatApi.createRoom(roomName, function (err, body) {
            (!err).should.be.ok();
            var roomId = body.channel._id;
            rocketChatApi.joinRoom(roomId, function (err, body) {
                (!err).should.be.ok();
                rocketChatApi.sendMsg(roomId, message, function (err, body) {
                    (!err).should.be.ok();
                    body.status.should.equal("success");
                    done();
                });
            });
        });
    });

    it("sending a meesage, and get lastest messages", function (done) {
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
