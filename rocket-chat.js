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
var RocketChatApi = function(protocol , host , port , username , password){
    this.protocol = protocol || "http";
    this.host = host || "demo.rocket.chat";
    this.port =  port || 80;
    this.username = username;
    this.password = password;
    this.token = null;


    /**
     * make a rest api uri
     * @param pathname api path
     * @returns {string} rest api full path , example https://demo.rocket.chat/api/login
     */
    this.makeUri = function(pathname){
        var basePath = '/api/';

        var uri = url.format({
            protocol: this.protocol,
            hostname: this.host,
            port: this.port,
            pathname: basePath + pathname
        });
        return decodeURIComponent(uri); 
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
                if(error)
                {
                    console.log(error);
                    return;
                }    
                self.token = data.data;
                var token = data.data;  // get the response token
                options.headers = options.headers || {};
                options.headers['X-Auth-Token']=token.authToken;
                options.headers['X-User-Id']=token.userId;
                self.request(options , callback) ;
            }) 
        }
        else
        {
            var token = self.token;
            options.headers = options.headers || {};
            options.headers['X-Auth-Token']=token.authToken;
            options.headers['X-User-Id']=token.userId;
            self.request(options , callback);
        }
    };

    /**
     * login the rocket chat
     * @param callback after login the rocket chat , will invoke the callback funciton
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

                callback(null, JSON.parse(body));
            })

        }
    };
};

(function(){
    this.logout = function(callback) {

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

            callback(null, JSON.parse(body));
        });
    };

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
        
    }
}).call(RocketChatApi.prototype);

exports.RocketChatApi = RocketChatApi;