module.exports = Authentication;

function Authentication(client) {
    this.client = client;
}

Authentication.prototype.login = function (user, password, callback) {
    this.client.request("POST", "login", { "user": user, "password": password }, function (err, body) {
        if (err) {
            callback(new Error("Could not login. Check username and password"), null);
        }
        
        callback(null, body);
    });
}

Authentication.prototype.logout = function (callback) {
    this.client.request("GET", "logout", null, callback);
}