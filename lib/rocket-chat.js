/**
 * Created by qeesung on 2016/4/29.
 * the rocket.chat(https://rocket.chat/) node api, provide the features:
 * - login
 * - logout
 * - join a room
 * - leave a room
 * - sending a message
 * - get list of public rooms
 * - get all unread messages in a room
 * - create a room
 */


var url = require('url'),
    logger = console,
    RocketChatClient = require('./rocketChat').RocketChatClient;

/**
 * Rocket Chat Api constructor
 * @param protocol rocket chat protocol
 * @param host rocket chat host , default is https://demo.rocket.chat
 * @param port rocket chat port , default is 80
 * @param username rocket chat username
 * @param password rocket chat password
 * @param onConnected callback that is invoked when connection is open
 * @constructor
 */
var RocketChatApi = function (protocol, host, port, username, password, onConnected) {
    this.rocketChatClient = new RocketChatClient(protocol, host, port, username, password, onConnected);
    this.token = null;

    /**
     * login the rocket chat
     * @param callback after login the rocket chat , will invoke the callback function
     */
    this.login = function (username, password, callback) {
        var self = this;
        this.rocketChatClient.authentication.login(username, password, function (err, body) {
            
            self.token = body.data;
            callback(null, body);
        });
    };
};

(function () {

    /**
     * get the rocket chat rest api version
     * @param callback invoke after get rest api version
     */
    this.version = function (callback) {
        this.rocketChatClient.miscellaneous.info(function (err, body) {
            if (err) return callback(err, null);
            callback(null, {
                status: body.success ? "success" : "error",
                versions: {
                    api: body.info.version,
                    rocketchat: body.info.version
                }
            })
        });
    };

    /**
     * logout rocket chat
     * @param callback invoke the function after logged out
     */
    this.logout = function (callback) {
        var self = this;

        this.rocketChatClient.authentication.logout(function (err, body) {
            if (err) {
                return callback(err, null);
            }
            self.token = null;
            callback(null, body);
        });
    };

    /**
     * send msg to a room
     * @param roomId target room ID
     * @param message message to be sent
     * @param callback invoke after sent msg successfully
     */
    this.sendMsg = function (roomId, message, callback) {
        this.rocketChatClient.chat.postMessage({ roomId : roomId, text : message }, callback);
    };


    /**
    * create a channel
    * @param roomName name for the channel
    * @param callback invoke after room created successfully
    */
    this.createRoom = function (roomName, callback) {
        this.rocketChatClient.channels.create(roomName, callback);
    };

    /**
     * get all public rooms from rocket chat
     * @param callback invoke after get all the public rooms data
     */
    this.getPublicRooms = function (callback) {
        this.rocketChatClient.channels.list({}, callback);
    };

    /**
     * join in a room with roomID
     * @param roomId target room ID
     * @param callback invoke the function after join the room
     */
    this.joinRoom = function (roomId, callback) {
        this.rocketChatClient.realtime.joinChannel(roomId, callback);
    };

    /**
     * join in a room with roomID
     * @param roomId target room ID
     * @param topic the topic to set
     * @param callback invoke the function after setting the topic
     */
    this.setTopic = function(roomId, topic, callback) {
        this.rocketChatClient.channels.setTopic(roomId, topic, callback);
    }

    /**
     * leave a room with roomID
     * @param roomId target roomID
     * @param callback invoke after left the room
     */
    this.leaveRoom = function (roomId, callback) {
        this.rocketChatClient.realtime.leaveChannel(roomId, callback);
    };

    /**
     * get all unread messages from a room that with roomId
     * @param roomId target room id
     * @param callback will invoke after get the all unread messages
     */
    this.getUnreadMsg = function (roomId, callback) {
        var self = this;
        var options = {
            uri: self.makeUri('rooms/' + roomId + "/messages"),
            method: 'GET'
        };

        this.doRequest(options, function (error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('get unread messages failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during getting unread messages.');
                return;
            }

            if (body === undefined) {
                callback('Response body was undefined.');
                return;
            }

            callback(null, JSON.parse(body));
        });

    };
}).call(RocketChatApi.prototype);

exports.RocketChatApi = RocketChatApi;