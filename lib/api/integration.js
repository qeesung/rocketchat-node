const pageQueryMapping = require("./lists/pageQueryMapper");

class Integration {
    constructor(client) {
        this.client = client;
    }

    create({
        type,
        name,
        enabled = true,
        username,
        urls = [],
        scriptEnabled = false,
        channel,
        triggerWords = "",
        alias = "",
        avatar = "",
        emoji = "",
        token = "",
        script = undefined
        }, callback) {
        return this.client.request("POST", "integrations.create", arguments[0], callback);
    }

    list({ offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined } = {}, callback) {
        return this.client.request("GET", "channels.list", pageQueryMapping(arguments[0]), callback);
    }

    remove({ type, integrationId }, callback) {
        return this.client.request("POST", "integrations.remove", arguments[0], callback);
    }
}

module.exports = Integration;