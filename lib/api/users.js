const pageQueryMapping = require("./lists/pageQueryMapper");

class Users {
    constructor(client){
        this.client = client;
    }

    list ({ offset = 0, count = 0, sort = undefined, fields = undefined, query = undefined}, callback) {
        return this.client.request("GET", "users.list", pageQueryMapping(arguments[0]), callback);
    }

    create (user, callback) {
        return this.client.request("POST", "users.create", user, callback);
    }

    info ({userId, username} = {}, callback) {
        if(userId)
            return this.client.request("GET", "users.info", {userId}, callback);
        else if(username)
            return this.client.request("GET", "users.info", {username}, callback);
        else {
            let errMsg = "userId or username is required";
            callback(errMsg);
            return Promise.reject(errMsg);
        }
    }

    delete (userId, callback) {
        return this.client.request("POST", "users.delete", {userId}, callback);
    }

    update (userId, updateData, callback) {
        return this.client.request("POST", "users.update", {
            userId,
            data: updateData
        }, callback);
    }

    getPresence (userId, callback) {
        return this.client.request("GET", "users.getPresence", {
            userId
        }, callback);
    }

    setAvatar (avatarUrl, callback) {
        return this.client.request("POST", "users.setAvatar", {
            avatarUrl
        }, callback);
    }
}

module.exports = Users;