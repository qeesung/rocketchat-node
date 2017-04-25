module.exports = Chat;

function Chat(client) {
    this.client = client;
}

Chat.prototype.postMessage = function (data, callback) {
    return this.client.request("POST", "chat.postMessage", data, callback);
};

Chat.prototype.delete = function ({ roomId, msgId, asUser = false }, callback) {
    return this.client.request("POST", "chat.delete", data, callback);
};

Chat.prototype.update = function ({ roomId, msgId, text }, callback) {
    return this.client.request("POST", "chat.update", data, callback);
};