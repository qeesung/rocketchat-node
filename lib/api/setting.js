/**
 * Created by qeesung on 2017/4/26.
 */

class Settings {
    constructor(client) {
        this.client = client;
    }

    get(_id, callback) {
        return this.client.request("GET", `settings/${_id}`, null, callback);
    }

    update(_id, value, callback) {
        return this.client.request("GET", `settings/${_id}`, {value}, callback);
    }
}

module.exports = Settings;
