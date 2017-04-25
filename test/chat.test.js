const RocketChatClient = require("../lib/rocketChat").RocketChatClient;
const should = require("should");
const async = require("async");
const co = require("co");

const config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("chat", function () {
    let rocketChatClient = null;
    let roomId = null;
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password, () => {
                let currentRoom = yield rocketChatClient.channels.create("chat-name-" + Date.now());
                roomId = currentRoom.channel._id;
                done();
            });
    });

    describe("remove", function (done) {
        it("should be able to remove a posted message", function () {
            let message = yield this.rocketChatClient.chat.postMessage({ roomId, text: "any message" });
            let msgId = message.message._id;
            let result = yield.rocketChatClient.chat.remove({ roomId, msgId });
            should(result).not.be.null();
            should(result.success).be.true();
            done();
        });

        it("should be able to update a posted message", function (done) {
            const updatedText = "updated";
            let message = yield this.rocketChatClient.chat.postMessage({ roomId, text: "any message" });
            let msgId = message.message._id;
            let result = yield.rocketChatClient.chat.update({ roomId, msgId, text: updatedText });
            should(result).not.be.null();
            should(result.success).be.true();
            should(result.message).not.be.null();
            should(result.message.msg).be.equal(updatedText);
            should(result.message.editedBy).not.be.null();
            should(result.message.editedBy.username).be.equal(config.user);
            done();
        });
    });
});