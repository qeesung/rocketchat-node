module.exports = Authentication;

function Authentication(client) {
    this.client = client;
}

Authentication.prototype.login = function (user, password, callback) {
    var restClient = this.client;
    this.client.request("POST", "login", { "user": user, "password": password }, function (err, body) {
        if (err) {
            return callback(new Error("Could not login. Check username and password"), null);
        }

        restClient.setHeader("X-Auth-Token", body.data.authToken);
        restClient.setHeader("X-User-Id", body.data.userId);
        callback(null, body);
    });
};

Authentication.prototype.logout = function (callback) {
    var restClient = this.client;
    restClient.request("GET", "logout", null, function(err, body){
        if(err == null){
            restClient.removeHeader("X-Auth-Token");
            restClient.removeHeader("X-User-Id");
        }
        return callback(err, body);
    });
};

Authentication.prototype.me = function (callback) {
    this.client.request("GET", "me", null, callback);
};