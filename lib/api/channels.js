module.exports = Channels;

function Channels(client) {
    this.client = client;
}

Channels.prototype.create = function (name, callback) {
    this.client.request("POST", "channels.create", { name: name }, callback);
}

Channels.prototype.list = function (callback) {
    this.client.request("GET", "channels.list", null, callback);
}
