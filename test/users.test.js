var RocketChatClient = require('../lib/rocketChat').RocketChatClient
var should = require("should");
var async = require("async");

var config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("users", function () {

    var rocketChatClient = null;
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done)
    });

    describe("adding user", function () {
        var userToAdd = {
            "name": "name", "email": "email@user.tld", "password": "anypassyouwant", "username": "uniqueusername", "customFields": { "twitter": "@userstwitter" }
        };

        var userId;

        it("should add the new user successfully", function (done) {
            rocketChatClient.users.create(userToAdd, function (err, result) {
                should(err).be.null();
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.user._id).not.be.null();
                userId = result._id;
                done();
            });
        });

        describe("get user information", function () {
            it("should retrieve user information for a userId", function (done) {
                rocketChatClient.users.info(userId, function (err, result) {
                    should(err).be.null();
                    should(result).not.be.null();
                    should(result.success).be.true();
                    should(result.user.username).be.equal(userToAdd.username);
                    should(result.user.name).be.equal(userToAdd.name);
                    should(result.user.active).be.true();
                    done();
                });
            });

            describe("deleting user", function () {
                it("should delete the user successfully", function (done) {
                    rocketChatClient.users.delete(userId, function (err, result) {
                        should(err).be.null();
                        should(result).not.be.null();
                        should(result.success).be.true();
                        done();
                    });
                });
            });
        });
    });
});