class Users {
    constructor(client){
        this.client = client;
    }

    list (offset, count, callback) {
        if (arguments.length === 1)
            return this.client.request("GET", "users.list", null, offset);
        else if (arguments.length === 3)
            return this.client.request("GET", "users.list", { offset : offset, count : count }, callback);
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