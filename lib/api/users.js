module.exports = Users;

function Users(webClient) {
    this.client = webClient;
}

Users.prototype.list = function (offset, count, callback) {
    if (arguments.length === 1)
        return this.client.request("GET", "users.list", null, offset);
    else if (arguments.length === 3)
        return this.client.request("GET", "users.list", { offset : offset, count : count }, callback);
}

Users.prototype.create = function (user, callback) {
    return this.client.request("POST", "users.create", user, callback);
}

Users.prototype.info = function (userId, callback) {
    return this.client.request("GET", "users.info", { userId: userId }, callback);
}

Users.prototype.delete = function (userId, callback) {
    return this.client.request("POST", "users.delete", {userId}, callback);
}

Users.prototype.update = function (userId, updateData, callback) {
    return this.client.request("POST", "users.update", {
        userId,
        data: updateData
    }, callback);
}

Users.prototype.getPresence = function (userId, callback) {
    return this.client.request("GET", "users.getPresence", {
        userId
    }, callback);
}

Users.prototype.setAvatar = function (userId, avatarUrl, callback) {
    return this.client.request("POST", "users.setAvatar", {
        avatarUrl
    }, callback);
}
