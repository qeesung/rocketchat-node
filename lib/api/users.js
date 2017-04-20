module.exports = Users;

function Users(webClient) {
    this.client = webClient;
}

Users.prototype.list = function (offset, count, callback) {
    if (arguments.length === 1)
        this.client.request("GET", "users.list", null, offset);
    else if (arguments.length === 3)
        this.client.request("GET", "users.list", { offset : offset, count : count }, callback);
}

Users.prototype.create = function (user, callback) {
    this.client.request("POST", "users.create", user, callback);
}

Users.prototype.info = function (userId, callback) {
    this.client.request("GET", "users.info", { userId: userId }, callback);
}

Users.prototype.delete = function (userId, callback) {
    this.client.request("POST", "users.delete", { userId: userId }, callback);
}
