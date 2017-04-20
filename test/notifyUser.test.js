var RocketChatClient = require("../lib/rocketChat").RocketChatClient;
var should = require("should");
var async = require("async");

var config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("notifyUser", function () {
    let userToAdd = {
        "name": "sender" + Date.now(),
        "email": `email${Date.now()}@example.com`,
        "password": "anypassyouwant",
        "username": "uniqueusername" + Date.now()
    };
    let userId;
    let client, secondClient;

    before(function (done) {
        this.timeout(5000);
        client = new RocketChatClient("http", config.host, config.port, config.user, config.password, (err, body) => {
            should(err).be.null();
            should(body).not.be.null();
            userId = body.userId;
            client.users.create(userToAdd, function() {});
            setTimeout(() => {
                secondClient = new RocketChatClient("http", config.host, config.port, userToAdd.username, userToAdd.password, (err, body) => {
                    done();
                });
            }, 500);
        });
    });

    describe("of a new message", function () {
        let roomId;

        before(function (done) {
            client.channels.create("notify-user-" + Date.now(), function (err, body) {
                should(err).be.null();
                should(body.success).be.true();
                roomId = body.channel._id;
                done();
            });
        });

        it("should notify the user when a message for him was sent", function (done) {
            let message = `@${config.user} hello world!`;
            this.timeout(5000);
            client.notify.user.onNotification(userId, function (err, body) {
                should(err).be.null();
                should(body).not.be.null();
                should(body.fields.args[0].text).be.equal(message);
                done();
            });

            secondClient.chat.postMessage({ roomId, text: message }, function (err, body) {

                console.log(`message sent`);
                should(err).be.null();
                should(body).not.be.null();
            });
        });
    });
});