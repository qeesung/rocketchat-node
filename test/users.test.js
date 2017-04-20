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
    var userToAdd = {
        "name": "name", 
        "email": "email@example.com", 
        "password": "anypassyouwant", 
        "username": "uniqueusername", 
        "sendWelcomeEmail": false, 
        "joinDefaultChannels": false,
        "verified":false,
        "requirePasswordChange":false,
        "roles":["user"]
    };

    var userId;
    before(function () {
        userToAdd.name = userToAdd.name + Date.now();
        userToAdd.username = userToAdd.username + Date.now();
        userToAdd.email = "email" + Date.now() + "@example.com";
    });

    describe("adding user", function () {

        it("should add the new user successfully", function (done) {
            this.timeout(5000);
            rocketChatClient.users.create(userToAdd, function (err, result) {
                should(err).be.null();
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.user._id).not.be.null();
                userId = result.user._id;
                done();
            });
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