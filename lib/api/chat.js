class Chat {
    constructor(client) {
        this.client = client;
    }

    postMessage(data, callback) {
        return this.client.request("POST", "chat.postMessage", data, callback);
    }
    
    delete({ roomId, msgId, asUser = false }, callback) {
        return this.client.request("POST", "chat.delete", data, callback);
    }

    update({ roomId, msgId, text }, callback) {
        return this.client.request("POST", "chat.update", data, callback);
    }
}

module.exports = Chat;