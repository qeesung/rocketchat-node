module.exports = function(client) {
    this.create = function(name, callback) {
        client.request("POST", "channels.create", { name : name }, callback);
    }

    this.list = function(callback) {
        client.request("GET", "channels.list", null, callback);
    }

    return this;
}