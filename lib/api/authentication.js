module.exports = Authentication;

function Authentication(client) {
    this.client = client;
}

Authentication.prototype.login = function (user, password, callback) {
    var restClient = this.client;
    this.client.request("POST", "login", { "user": user, "password": password }, function (err, body) {
        if (err) {
            callback(new Error("Could not login. Check username and password"), null);
        }

        restClient.setHeader("X-Auth-Token", body.data.authToken);
        restClient.setHeader("X-User-Id", body.data.userId);
        callback(null, body);
    });
}

Authentication.prototype.logout = function (callback) {
    this.client.request("GET", "logout", null, callback);
}