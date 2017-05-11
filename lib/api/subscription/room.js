class Room {
    constructor(client) {
        this.client = client;
    }

    onChanged(roomId, onEventPublished) {
        this.client.subscribe({ stream : "stream-room-messages", event : roomId }, onEventPublished);
    }
}
module.exports = Room;