class Notify {
    constructor(client) {
        this.client = client;
        this.user = new (require("./subscription/user"))(client);
    }
}
module.exports = Notify;