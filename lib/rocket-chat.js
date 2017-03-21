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
    logger = console;

/**
 * Rocket Chat Api constructor
 * @param protocol rocket chat protocol
 * @param host rocket chat host , default is https://demo.rocket.chat
 * @param port rocket chat port , default is 80
 * @param username rocket chat username
 * @param password rocket chat password
 * @constructor
 */
var RocketChatApi = function(protocol , host , port , username , password, version){
    this.protocol = protocol || "http";
    this.host = host || "demo.rocket.chat";
    this.port =  port || 80;
    this.username = username;
    this.password = password;
    this.token = null;
    this.version = version || false;

    var versionRequestData = {
        "false" : {
            "sendMsg" : {
                "path" : function(data) {
                    return 'rooms/'+data.roomId+"/send";
                },
                "body" : function(data) {
                    return {
                        msg : data.message
                    }
                }
            }
        },
        "v1" : {
            "sendMsg" : {
                "path" : function(data) {
                    return 'chat.postMessage';
                },
                "body" : function(data) {
                    return{
                        "roomId" : data.roomId,
                        "text" : data.message
                    }
                }
            }
        }
    }

    /**
     * make a rest api uri
     * @param pathname api path
     * @returns {string} rest api full path , example https://demo.rocket.chat/api/login
     */
    this.makeUri = function(pathname){
        var basePath = '/api/' + ((this.version) ? this.version + '/' : '');

        var uri = url.format({
            protocol: this.protocol,
            hostname: this.host,
            port: this.port,
            pathname: basePath + pathname
        });
        return decodeURIComponent(uri);
    };

    this.getRequestData = function(functionName) {
        if (!versionRequestData[this.version.toString()]) 
            throw "Version not supported";
        if (!versionRequestData[this.version.toString()][functionName]) 
            throw "Method not supported in this version";
        return versionRequestData[this.version.toString()][functionName];
    }

    /**
     * set the request token header
     */
    function setRequestToken(token, options) {
        if(token == null || options == null)
            return;
        options.headers = options.headers || {};
        options.headers['X-Auth-Token']=token.authToken;
        options.headers['X-User-Id']=token.userId;
    }

    /** import the request */
    this.request = require('request');

    /**
     * call the rest api through this method with options
     * @param options request options
     * @param callback after request finished , and invoke the callback function
     */
    this.doRequest = function(options , callback){
        var self = this;
        options = options || {};
        if(self.token == null) // need login first
        {
            self.login(function(error, data){
                if(error || self.token === null)
                {
                    console.log(error);
                    return;
                }
                setRequestToken(self.token, options);
                self.request(options , callback) ;
            });
        }
        else
        {
            setRequestToken(self.token, options);
            self.request(options , callback);
        }
    };

    /**
     * login the rocket chat
     * @param callback after login the rocket chat , will invoke the callback function
     */
    this.login = function(callback){
        var self = this;
        if(this.username && this.password)
        {
            var options = {
                uri: self.makeUri('login'),
                method: 'POST',
                form: {user:self.username , password:self.password}
            };

            self.request(options , function (err,response ,body) {
                if (err) {
                    callback(err, null);
                    return;
                }

                if (response.statusCode === 404) {
                    callback('login failed');
                    return;
                }

                if (response.statusCode !== 200) {
                    callback(response.statusCode + ': Unable to connect to rocket chat during login.');
                    return;
                }

                if (body === undefined) {
                    callback('Response body was undefined.');
                    return;
                }
                // inject the token
                var body = JSON.parse(body);
                self.token = body.data;
                callback(null, body);
            });

        }
    };
};

(function(){

    /**
     * get the rocket chat rest api version
     * @param callback invoke after get rest api version
     */
    this.version = function(callback){
        var options = {
            uri: this.makeUri('version'),
            method: 'GET'
        };

        this.doRequest(options, function(error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('get api version failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during get api version.');
                return;
            }

            if (body === undefined) {
                callback('Response body was undefined.');
                return;
            }

            callback(null, JSON.parse(body));
        });
    };

    /**
     * logout rocket chat
     * @param callback invoke the function after logged out
     */
    this.logout = function(callback) {
        var self = this;
        var options = {
            uri: this.makeUri('logout'),
            method: 'GET'
        };

        this.doRequest(options, function(error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('logout failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during logout.');
                return;
            }

            if (body === undefined) {
                callback('Response body was undefined.');
                return;
            }

            self.token = null;
            callback(null, JSON.parse(body));
        });
    };

    /**
     * get all public rooms from rocket chat
     * @param callback invoke after get all the public rooms data
     */
    this.getPublicRooms = function (callback) {
        var self = this;
        var options = {
            uri: self.makeUri('publicRooms'),
            method: 'GET'
        };

        this.doRequest(options, function(error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('get public rooms failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during get public rooms.');
                return;
            }

            if (body === undefined) {
                callback('Response body was undefined.');
                return;
            }

            callback(null, JSON.parse(body));
        });

    };

    /**
     * join in a room with roomID
     * @param roomId target room ID
     * @param callback invoke the function after join the room
     */
    this.joinRoom = function(roomId , callback){
        var self = this;
        var options = {
            uri: self.makeUri('rooms/'+roomId+"/join"),
            method: 'POST',
            qs:{},
            json:true
        };

        this.doRequest(options, function(error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('join room failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during joining the room.');
                return;
            }

            if (body === undefined) {
                callback('Response body was undefined.');
                return;
            }

            callback(null, body);
        });
    };


    /**
     * leave a room with roomID
     * @param roomId target roomID
     * @param callback invoke after left the room
     */
    this.leaveRoom = function(roomId , callback){
        var self = this;
        var options = {
            uri: self.makeUri('rooms/'+roomId+"/leave"),
            method: 'POST',
            qs:{},
            json:true
        };

        this.doRequest(options, function(error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('leave room failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during leaving the room.');
                return;
            }

            if (body === undefined) {
                callback('Response body was undefined.');
                return;
            }

            callback(null, body);
        });
    };

    /**
     * get all unread messages from a room that with roomId
     * @param roomId target room id
     * @param callback will invoke after get the all unread messages
     */
    this.getUnreadMsg = function(roomId , callback){
        var self = this;
        var options = {
            uri: self.makeUri('rooms/'+roomId+"/messages"),
            method: 'GET'
        };

        this.doRequest(options, function(error, response, body) {

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

    /**
     * send msg to a room
     * @param roomId target room ID
     * @param message message to be sent
     * @param callback invoke after sent msg successfully
     */
    this.sendMsg = function(roomId , message , callback){
        var data = { roomId : roomId, message : message };
        var requestData = this.getRequestData("sendMsg");
        var uri = this.makeUri(requestData.path(data));
        var body = requestData.body(data);
        var options = {
            uri: uri,
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            form:body
        };

        this.doRequest(options, function(error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('send message failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during sending message.');
                return;
            }

            if (body === undefined) {
                callback('Response body was undefined.');
                return;
            }

            callback(null, JSON.parse(body));
        });

    };

     /**
     * create a channel
     * @param roomName name for the channel
     * @param callback invoke after room created successfully
     */
    this.createRoom = function(roomName, callback){
        var self = this;
        var options = {
            uri: self.makeUri('v1/channels.create'),
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            form:{name:roomName}
        };

        this.doRequest(options, function(error, response, body) {

            if (error) {
                callback(error, null);
                return;
            }

            if (response.statusCode === 404) {
                callback('create room failed');
                return;
            }

            if (response.statusCode !== 200) {
                callback(response.statusCode + ': Unable to connect to rocket chat during room create. Room may already exist.');
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
