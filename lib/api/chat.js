module.exports = Chat;

function Chat(client) {
    this.client = client;
}

Chat.prototype.postMessage = function (data, callback) {
    this.client.request("POST", "chat.postMessage", data, callback);
}