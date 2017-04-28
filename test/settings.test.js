/**
 * Created by qeesung on 2017/4/26.
 */
const RocketChatClient = require("../lib/rocketChat").RocketChatClient;
const co = require("co");

const config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("setttings", () => {
    let rocketChatClient = null;
    const id = "Livechat_enabled";
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done);
    });

    it(`get ${id} configurations values should be false or true`, () => {
        return co(function *() {
            let livechatEnabledValue = yield rocketChatClient.settings.get(id);
            livechatEnabledValue.value.should.be.oneOf([true, false]);
        });
    });

    it(`update ${id} the configurations to be true`, () => {
        return co(function *() {
            let updatedResult = yield rocketChatClient.settings.update(id, true);
            updatedResult.success.should.equal(true);
        });
    });
});