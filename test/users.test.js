var RocketChatClient = require('../lib/rocketChat').RocketChatClient
var should = require("should");
var async = require("async");

var config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("user", function () {

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

        it("should add the new user successfully");

        describe("get user information", function () {
            it("should retrieve user information for a userId");

            describe("deleting user", function () {
                it("should delete the user successfully");
            });
        });
    });
});