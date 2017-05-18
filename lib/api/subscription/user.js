const Room = require("./room");

class User {
    constructor(client) {
        this.client = client;
    }

    onNotification(userId, onEventPublished) {
        this.client.subscribe({ userId, stream : "stream-notify-user", event : "notification" }, onEventPublished);
    }

    /** deprecated in favor if room.onChanged */
    onRoomChanged(roomId, onEventPublished) {
        new Room(this.client).onChanged(roomId, onEventPublished);
    }
}
module.exports = User;