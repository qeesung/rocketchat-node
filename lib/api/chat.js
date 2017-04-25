class Chat {
    constructor(client) {
        this.client = client;
    }

    postMessage(data, callback) {
        return this.client.request("POST", "chat.postMessage", data, callback);
    }
    
    delete({ roomId, msgId, asUser = false }, callback) {
        return this.client.request("POST", "chat.delete", { roomId, msgId, asUser }, callback);
    }

    update({ roomId, msgId, text }, callback) {
        return this.client.request("POST", "chat.update", { roomId, msgId, text }, callback);
    }
}

module.exports = Chat;