module.exports = function(client) {
    this.info = function(callback) {
        client.request("GET", "info", null, callback);
    }

    return this;
}