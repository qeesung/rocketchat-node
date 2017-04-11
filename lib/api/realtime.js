module.exports = function(client) {
    this.joinChannel = function(roomId, callback) {
        client.request("method", "joinRoom", [roomId], callback);
    }

    this.leaveChannel = function(roomId, callback) {
        client.request("method", "leaveRoom", [roomId], callback);
    }
    
    return this;
}