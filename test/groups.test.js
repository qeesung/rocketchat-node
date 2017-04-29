/**
 * Created by qeesung on 2017/4/29.
 */

const RocketChatClient = require("../lib/rocketchat").RocketChatClient;
const should = require("should");
const co = require("co");

const config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

let userToAdd = {
    "name": "test-group-user",
    "email": "email@example.com",
    "password": "anypassyouwant",
    "username": "uniqueusername",
    "sendWelcomeEmail": false,
    "joinDefaultChannels": false,
    "verified": false,
    "requirePasswordChange": false,
    "roles": ["user"]
};

describe("groups", () => {
    let rocketChatClient = null;
    before( (done) => {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done);
    });

    describe("create group and remove group", () => {
        it("create result should be success and should have group id property", () => {
            return co(function *() {
                let createdGroup = yield rocketChatClient.groups.create("test-group-"+Date.now());
                createdGroup.success.should.equal(true);
                createdGroup.group._id.should.be.ok();
            });
        });

        it("close result success result should be success", () => {
            return co(function *() {
                let createdGroup = yield rocketChatClient.groups.create("test-group-"+Date.now());
                createdGroup.success.should.equal(true);
                createdGroup.group._id.should.be.ok();

                let createdGroupId = createdGroup.group._id;

                let closeResult = yield rocketChatClient.groups.close(createdGroupId);
                closeResult.success.should.equal(true);
            });
        });
    });

    describe("add user to the group", () => {
        let createdUserId = null;
        let createGroupId = null;

        beforeEach(() => {
            userToAdd.name = userToAdd.name + Date.now();
            userToAdd.username = userToAdd.username + Date.now();
            userToAdd.email = "email" + Date.now() + "@example.com";

            return co(function *() {
                let createdUser = yield rocketChatClient.user.create(userToAdd);
                createdUserId = createdUser.user._id;
            });
        });
    });
});
