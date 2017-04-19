module.exports = Users;

function Users(client) {
    this.client = client;
}

Users.prototype.create = function (user, callback) {
    this.client.request("POST", "users.create", user, callback);
}

Users.prototype.info = function (userId, callback) {
    this.client.request("GET", "users.info", { userId : userId }, callback);
}

Users.prototype.delete = function (userId, callback) {
    this.client.request("POST", "users.delete", { userId : userId }, callback);
}
