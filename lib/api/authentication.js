module.exports = function(client) {
    this.login = function(user, password, callback) {
        client.request("POST", "login", { "user": user, "password": password }, callback);
    }

    this.logout = function(callback) {
        client.request("GET", "logout", null, callback);
    }

    return this;
}