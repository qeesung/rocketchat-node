const RocketChatClient = require("../lib/rocketChat").RocketChatClient;
const should = require("should");

const config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("users", function () {

    let rocketChatClient = null;
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done);
    });
    let userToAdd = {
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

    let userId = null;
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
            rocketChatClient.users.info({userId}, function (err, result) {
                should(err).be.null();
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.user.username).be.equal(userToAdd.username);
                should(result.user.name).be.equal(userToAdd.name);
                should(result.user.active).be.true();
                done();
            });
        });

        it("should retrieve user information by username", function (done) {
            rocketChatClient.users.info({username: userToAdd.username}, function (err, result) {
                should(err).be.null();
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.user.username).be.equal(userToAdd.username);
                should(result.user.name).be.equal(userToAdd.name);
                should(result.user.active).be.true();
                done();
            });
        });

        it("should return an error when the user does not exist using callback", function (done) {
            rocketChatClient.users.info({username: "this user does not exist"}, function (err) {
                should(err).not.be.null();
                done();
            });
        });

        it("should return an error when the user does not exist using rejection", function (done) {
            rocketChatClient.users.info({username: "this user does not exist"})
                .catch(err => {
                    should(err).not.be.null();
                    done();
                });
        });

    });

    describe("update user", function () {
        let newUsername = "new name";
        it("updated username should equal to "+newUsername, function (done) {
            rocketChatClient.users.update(userId, {
                "name": newUsername
            }, function (err, updatedUser) {
                should(err).be.null();
                should(updatedUser.success).be.true();
                should.equal(updatedUser.user.name, newUsername);
                done();
            });
        });
    });

    describe("get user presence", function () {
        it("should get the user presence successfully", function (done) {
            rocketChatClient.users.getPresence(userId, function (err, result) {
                should(err).be.null();
                should(result.success).be.true();
                done();
            });
        });
    });

    describe("set user avatar", function () {
        let avatarUrl = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y";
        it("should set the user avatar successfully", function (done) {
            rocketChatClient.users.setAvatar(avatarUrl, function (err, result) {
                should(err).be.null();
                should(result.success).be.true();
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