const pageQueryMapping = require("./lists/pageQueryMapper");

class Channels {
    constructor(client) {
        this.client = client;
    }

    create (name, callback) {
        this.client.request("POST", "channels.create", { name: name }, callback);
    }

    list ({ offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined}, callback) {
        this.client.request("GET", "channels.list", pageQueryMapping(arguments[0]), callback);
    }

    setTopic (roomId, topic, callback) {
        this.client.request("POST", "channels.setTopic", { "roomId": roomId, "topic": topic }, callback)
    }
}

module.exports = Channels;
