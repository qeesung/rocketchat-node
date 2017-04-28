module.exports = Miscellaneous;

function Miscellaneous(client) {
    this.client = client;
}

Miscellaneous.prototype.info = function (callback) {
    this.client.request("GET", "info", null, callback);
};