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
        integrationId = null;
        testIntegration = { 
            "type": "webhook-outgoing", 
            "name": "Testing via REST API", 
            "enabled": false, 
            "username": "integration-test", 
            "urls": [], 
            "scriptEnabled": false 
        };

        it("should be able to create a new integration", () => {
            return co(function* () {
                let result = yield rocketChatClient.integration.create(testIntegration);
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.integration).not.be.null();
                should(result.integration._id).not.be.null();
                integrationId = result.integration._id;
            }).catch((err) => {
                should(err).be.null();
            });
        });

        it("should be able list the integration, finding the one we created", () => {
            return co(function* () {
                let result = yield rocketChatClient.integration.list({ 
                    offset : 0, 
                    count : 5, 
                    sort : { "_createdAt" : -1 }, 
                    fields : { "_id" : 1 }
                });
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.integrations).not.be.null();
                should(result.integrations).not.be.empty();
                should(result.integrations.some(_ => _._id === integrationId)).to.be.true();
            }).catch((err) => {
                should(err).be.null();
            });
        });

        it("should be able to remove our integration", () => {
            return co(function* () {
                let result = yield rocketChatClient.integration.remove({ 
                    type : testIntegration.type, 
                    integrationId : integrationId 
                });
                should(result).not.be.null();
                should(result.success).be.true();
                should(result.integration).not.be.null();
                should(result.integration._id).not.be.null();
                should(result.integration._id).not.be.equal(integrationId);
            }).catch((err) => {
                should(err).be.null();
            });
        });
    });
});