module.exports = Channels;

function Channels(client) {
    this.client = client;
}

Channels.prototype.create = function (name, callback) {
    this.client.request("POST", "channels.create", { name: name }, callback);
}

Channels.prototype.list = function ({ offset = 0, count = 0 }, callback) {
    this.client.request("GET", "channels.list", { offset : offset, count : count }, callback);
}

Channels.prototype.setTopic = function (roomId, topic, callback) {
    this.client.request("POST", "channels.setTopic", { "roomId": roomId, "topic": topic }, callback)
}