/**
 * Created by qeesung on 2017/4/29.
 */

const RocketChatClient = require("../lib/rocketChat").RocketChatClient;
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
    "username": "uniqueusername-group",
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
                let createdUser = yield rocketChatClient.users.create(userToAdd);
                createdUserId = createdUser.user._id;

                let createdGroup = yield rocketChatClient.groups.create("test-group-"+Date.now());
                createGroupId = createdGroup.group._id;
            });
        });

        afterEach(() => {
            return co(function *() {
                if(createdUserId != null)
                    yield rocketChatClient.users.delete(createdUserId);
                if(createGroupId != null)
                    yield rocketChatClient.groups.close(createGroupId);
                createGroupId = null;
                createdUserId = null;
            });
        });

        // addAll only provide in 0.55 version
        // but now rocket chat docker image version is 0.54
        xit("Adds all of the users of the Rocket.Chat server to the group. " +
            "result should be success, and username list should contain the created user", () => {
            return co(function *() {
                let addAllResult = yield rocketChatClient.groups.addAll(createGroupId);
                addAllResult.success.should.equal(true);
                addAllResult.group.usernames.should.matchAny(new RegExp(`^${userToAdd.username}.*`));
            });
        });

        it("Gives the role of owner for a user in the current group. result should be success", () => {
            return co(function *() {
                // invite user
                let inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
                inviteResult.success.should.equal(true);

                // add the user as owner
                let addOwnerResult = yield rocketChatClient.groups.addOwner(createGroupId, createdUserId);
                addOwnerResult.success.should.equal(true);
            });
        });

        it("Gives the role of moderator for a user in the currrent group. result should be success", () => {
            return co(function *() {
                // invite user
                let inviteResult = yield rocketChatClient.groups.invite(createGroupId, createdUserId);
                inviteResult.success.should.equal(true);

                // add the user as owner
                let addModeratorResult = yield rocketChatClient.groups.addModerator(createGroupId, createdUserId);
                should(addModeratorResult.success).be.ok();
            });
        });

        it("Archives a private group, only if you’re part of the group. result should be success", () => {
            return co(function *() {
                let archiveResult = yield rocketChatClient.groups.archive(createGroupId);
                archiveResult.success.should.equal(true);

                createGroupId = null;
            });
        });
    });
});
