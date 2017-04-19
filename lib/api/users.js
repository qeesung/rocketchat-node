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
    // rocket.chat docker container 0.55.0 does not callback. as a workaround, callback manually with the user
    var self = this;
    setTimeout(function () {
        self.list(0, 0, function (err, data) {
            if (err) { return callback(err, null); }

            callback(null, {
                success: true,
                user: data.users.find(function (value) {
                    return value.username === user.username;
                })
            });
        })
    }, 500);
}

Users.prototype.info = function (userId, callback) {
    this.client.request("GET", "users.info", { userId: userId }, callback);
}

Users.prototype.delete = function (userId, callback) {
    this.client.request("POST", "users.delete", { userId: userId }, callback);
}
