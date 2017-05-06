/**
 * Created by qeesung on 2017/4/28.
 */
const pageQueryMapping = require("./lists/pageQueryMapper");

class IM {
    constructor(client) {
        this.client = client;
    }

    close(roomId, callback) {
        return this.client.request("POST", "im.close", {roomId}, callback);
    }

    history(hisOptions, callback) {
        return this.client.request("GET", "im.history", hisOptions, callback);
    }

    listEveryone({ offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined} ={}, callback) {
        return this.client.request("GET", "im.list.everyone", pageQueryMapping(arguments[0]), callback);
    }

    list({ offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined} ={}, callback) {
        return this.client.request("GET", "im.list", pageQueryMapping(arguments[0]), callback);
    }

    messagesOthers(roomId, callback) {
        return this.client.request("GET", "im.messages.others", {roomId}, callback);
    }

    open(roomId, callback) {
        return this.client.request("POST", "im.open", {roomId}, callback);
    }

    setTopic(roomId, topic, callback) {
        return this.client.request("POST", "im.setTopic", {roomId, topic}, callback);
    }
}

module.exports = IM;
