var RocketChatClient = require('../lib/rocketChat').RocketChatClient
var should = require("should");
var async = require("async");
const co = require("co");

var config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("channels", function () {

    var rocketChatClient = null;
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done)
    });

    var userToAdd = {
        "name": "test-channel-user",
        "email": "email@example.com",
        "password": "anypassyouwant",
        "username": "uniqueusername",
        "sendWelcomeEmail": false,
        "joinDefaultChannels": false,
        "verified":false,
        "requirePasswordChange":false,
        "roles":["user"]
    };

    describe("creating channels", function () {
        var creationResult = null;

        it("should be successful", function (done) {
            this.timeout(10000);
            var creates = [];
            for(var i=0;i<10;i++) {
                creates.push(function (callback) {
                    rocketChatClient.channels.create("channel-name-" + Date.now(), function (err, body) {
                        should(err).be.null();
                        should(body.success).be.true();
                        callback();
                    })
                });
            }
            async.series(creates, function() {
                done();
            });
        });

        describe("querying channels", function () {
            it("should be listable", function (done) {
                rocketChatClient.channels.list({}, function (err, result) {
                    should(err).be.null();
                    should(result.success).be.true();
                    should(result.channels.length).be.greaterThan(5);
                    done();
                })
            })
            it("should be pageable", function (done) {
                rocketChatClient.channels.list({ offset : 1, count : 5 }, function (err, result) {
                    should(err).be.null();
                    should(result.success).be.true();
                    should(result.channels.length).be.equal(5);
                    done();
                })
            })
            it("should be queryable", function (done) {
                rocketChatClient.channels.list({ query : { "name": { "$regex": "thisreallydoesnotexist" } } }, function (err, result) {
                    should(err).be.null();
                    should(result.success).be.true();
                    should(result.channels.length).be.equal(0);
                    done();
                })
            })
            it("should be fieldable", function (done) {
                rocketChatClient.channels.list({ fields : { "name": 1 } }, function (err, result) {
                    should(err).be.null();
                    should(result.success).be.true();
                    should(result.channels.length).be.greaterThan(0);
                    should(result.channels[0].name).be.ok();
                    should(result.channels[0].msgs === undefined).be.true();
                    done();
                })
            })
            it("should be sortable", function (done) {
                rocketChatClient.channels.list({ sort : { "_updatedAt": 1 } }, function (err, result) {
                    should(err).be.null();
                    should(result.success).be.true();
                    should(result.channels.length).be.greaterThan(0);
                    let firstResult = result.channels[0];
                    rocketChatClient.channels.list({ sort : { "_updatedAt": -1 } }, function (err, result) {
                        should(err).be.null();
                        should(result.success).be.true();
                        should(result.channels.length).be.greaterThan(0);
                        should(result.channels[0]).be.not.equal(firstResult);
                        done();
                    });
                })
            })
        })
    });

    describe("Adds all of the users of the Rocket.Chat server to the channel.",  () => {

        let addedUserId = null;
        let addedRoomId = null;

        beforeEach(function () {
            userToAdd.name = userToAdd.name + Date.now();
            userToAdd.username = userToAdd.username + Date.now();
            userToAdd.email = "email" + Date.now() + "@example.com";
        });

        it(`${userToAdd.username} should in the channel`, ()=>{
            return co(function *() {
                // create temp user
                let addedUser = yield rocketChatClient.users.create(userToAdd);
                addedUserId = addedUser.user._id;
                should(addedUserId).not.be.null();

                // create test channel
                let addedChannel = yield rocketChatClient.channels.create("channel-name-"+Date.now());
                addedRoomId = addedChannel.channel._id;
                should(addedRoomId).be.ok();

                // add all user into the added channel
                let addedResult = yield rocketChatClient.channels.addAll(addedRoomId);
                addedResult.channel.usernames.should.containEql(userToAdd.username);

                // remove added user
                let removeUserResult = yield rocketChatClient.users.delete(addedUserId);
                removeUserResult.success.should.be.ok();

                // remove added channel
                let removeChannelResult = yield rocketChatClient.channels.close(addedRoomId);
                removeChannelResult.success.should.be.ok();

            }).catch((err) => {
                should(err).be.null();
            })
        })
    });
})