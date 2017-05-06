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

describe("im private message", () => {
    let rocketChatClient = null;
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done);
    });

    let imTestUser = {
        "name": "name",
        "email": "email@example.com",
        "password": "anypassyouwant",
        "username": "uniqueusername",
        "sendWelcomeEmail": false,
        "joinDefaultChannels": false,
        "verified": false,
        "requirePasswordChange": false,
        "roles": ["user"]
    };
    imTestUser.name = imTestUser.name + Date.now();
    imTestUser.username = imTestUser.username + Date.now();
    imTestUser.email = "email" + Date.now() + "@example.com";
    let roomId = null;
    before(function (done) {
        this.timeout(50000);
        rocketChatClient.users.create(imTestUser);
        setTimeout(() => {
            rocketChatClient.chat.postMessage({ channel: `@${imTestUser.username}`, text: "start im chat" }, (err, msg) => {
                should(msg.success).be.true();
                roomId = msg.message.rid;
                done();
            });
        }, 1000);
    });

    it("Adds the direct message back to the user’s list of direct messages.", () => {
        return co(function* () {
            let openResult = yield rocketChatClient.im.open(roomId);
            should(openResult.success).be.ok();
        });
    });

    it("Sets the topic for the direct message.", () => {
        let topic = "Hello world";
        return co(function* () {
            let setTopicResult = yield rocketChatClient.im.setTopic(roomId, topic);
            setTopicResult.success.should.equal(true);
            setTopicResult.topic.should.equal(topic);
        });
    });
});
