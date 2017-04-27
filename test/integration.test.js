const RocketChatClient = require("../lib/rocketChat").RocketChatClient;
const should = require("should");
const co = require("co");

const config = {
    host: "127.0.0.1",
    port: "3000",
    user: "qeesung",
    password: "123456"
};

describe("integration", function () {
    let rocketChatClient = null;
    let roomId = null;
    before(function (done) {
        rocketChatClient = new RocketChatClient("http",
            config.host,
            config.port,
            config.user,
            config.password,
            done);
    });

    describe("create - list - remove", function () {
        it("should be able to create a new integration")

        it("should be able list the integration, finding the one we created");

        it("should be able to delete our integration");
    });
});