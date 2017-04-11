module.exports = function(client) {
    this.login = function(user, password, callback) {
        client.request("POST", "login", { "user": user, "password": password }, function(err, body) {
            if (err) {
                callback(new Error("Could not login. Check username and password"), null);
            }

            client.setHeader("X-Auth-Token", body.data.authToken);
            client.setHeader("X-User-Id", body.data.userId);
            callback(null, body);
        });
    }

    this.logout = function(callback) {
        client.request("GET", "logout", null, callback);
    }

    return this;
}