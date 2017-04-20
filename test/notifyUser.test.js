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
    let userId;
    let client;

    before(function (done) {
        client = new RocketChatClient("http", config.host, config.port, config.user, config.password, function(err, body) {
            should(err).be.null();
            userId = body.userId;
        });
    });

    describe("of a new message", function () {
        let roomId;

        before(function (done) {
            client.channel.create("notify-user-" + Date.now(), function (err, body) {
                should(err).be.null();
                should(body.success).be.true();
                done();
            });
        });

        it("should notify the user when a message for him was sent", function (done) {
            let message = `@${config.user} hello world!`;
            client.notify.user.onMessage(userId, function(err, body) {
                should(err).be.null();
                should(body).not.be.null();
                should(body.fields.args[0].text).be.equal(message);
                done();
            }); 

            client.chat.postMessage({ roomId, text: message });
        });
    });
});