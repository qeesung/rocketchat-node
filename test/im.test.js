/**
 * Created by qeesung on 2017/4/29.
 */

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

describe("im", () => {
    let rocketChatClient = null;
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done);
    });

    let roomId = null;
    beforeEach(() => {
        return co(function *() {
           let createResult = yield rocketChatClient.groups.create("im-test-group-"+Date.now(), ["rocket.cat"]);
           roomId = createResult.group._id;
        });
    });

    xit("Adds the direct message back to the user’s list of direct messages.", () => {
        return co(function *(){
            let openResult = yield rocketChatClient.im.open(roomId);
            openResult.success.should.be.ok();
        });
    });

    xit("Sets the topic for the direct message.", () => {
        let topic = "Hello world";
        return co(function *() {
            let setTopicResult = yield rocketChatClient.im.setTopic(roomId, topic);
            setTopicResult.success.should.equal(true);
            setTopicResult.topic.should.equal(topic);
        });
    });
})
