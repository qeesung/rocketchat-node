class User {
    constructor(client) {
        this.client = client;
    }

    onNotification(userId, onEventPublished) {
        this.client.subscribe({ userId, stream : "stream-notify-user", event : "notification" }, onEventPublished);
    }

    onRoomChanged(roomId, onEventPublished) {
        this.client.subscribe({ stream : "stream-room-messages", event : roomId }, onEventPublished);
    }
}
module.exports = User;