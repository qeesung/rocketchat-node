class Notify {
    constructor(client) {
        this.client = client;
        this.user = new (require("./subscription/user"))(client);
        this.room = new (require("./subscription/room"))(client);
    }
}
module.exports = Notify;