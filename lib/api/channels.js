const pageQueryMapping = require("./lists/pageQueryMapper");

module.exports = Channels;

function Channels(client) {
    this.client = client;
}

Channels.prototype.create = function (name, callback) {
    this.client.request("POST", "channels.create", { name: name }, callback);
}

Channels.prototype.list = function ({ offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined}, callback) {    
    this.client.request("GET", "channels.list", pageQueryMapping(arguments[0]), callback);
}

Channels.prototype.setTopic = function (roomId, topic, callback) {
    this.client.request("POST", "channels.setTopic", { "roomId": roomId, "topic": topic }, callback)
}