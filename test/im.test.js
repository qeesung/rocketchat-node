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

    it("Closes an im and adds the direct message back to the user’s list of direct messages.", () => {
        return co(function* () {
            let closeResult = yield rocketChatClient.im.close(roomId);
            should(closeResult.success).be.ok();
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

    it("Retrieves the messages from a direct message. the message should contain the 'start im chat'", () =>{
        let message = "start im chat";
        return co(function *() {
            let historyResult = yield rocketChatClient.im.history({roomId});
            historyResult.success.should.equal(true);
            historyResult.messages.length.should.be.aboveOrEqual(1);
            historyResult.messages.should.matchAny(msgItem => {
                msgItem.msg.should.equal(message);
            });
        });
    });

    it("Lists all of the direct messages in the server, created im room should in the list", () => {
        return co(function *() {
            let listEveryoneResult = yield rocketChatClient.im.listEveryone();
            listEveryoneResult.success.should.equal(true);
            listEveryoneResult.ims.should.matchAny(im => {
                im._id.should.equal(roomId);
            });
        });
    });

    it("Lists all of the direct messages the calling user has joined, created im room should in the list", () => {
        return co(function *() {
            let listResult = yield rocketChatClient.im.list();
            listResult.success.should.equal(true);
            listResult.ims.should.matchAny(im => {
                im._id.should.equal(roomId);
            });
        });
    });

    xit("Retrieves the messages from any direct message in the server," +
      " the 'start im chat' should in the message list", () => {
        return co(function *() {
            let messagesResult = yield rocketChatClient.im.messagesOthers(roomId);
            messagesResult.success.should.equal(true);
            messagesResult.messages.should.matchAny(message => {
                message.msg.should.equal("start im chat");
            });
        });
    });
});
