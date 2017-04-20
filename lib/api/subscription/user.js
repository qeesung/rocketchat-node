class User {
    constructor(client) {
        this.client = client;
    }

    onNotification(userId, onEventPublished) {
        this.client.subscribe(userId, "stream-notify-user", "notification", onEventPublished);
    }
}
module.exports = User;