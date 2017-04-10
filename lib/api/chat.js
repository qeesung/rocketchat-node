module.exports = function(client) {
    this.postMessage = function(data, callback) {
        client.request("POST", "chat.postMessage", data, callback);
    }

    return this;
}