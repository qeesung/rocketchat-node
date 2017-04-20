"use strict";
const url = require("url");
const DDP = require("ddp.js").default;
const WebSocket = require("ws");
const HttpsProxyAgent = require('https-proxy-agent');

class RequestError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "RequestError";
        this.statusCode = statusCode;
        Error.captureStackTrace(this, RequestError);
    }
}

class Client {
    constructor(protocol, host, port, basePath) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.basePath = basePath;
    }
    makeUri(pathname = "") {
        var uri = url.format({
            protocol: this.protocol,
            hostname: this.host,
            port: this.port.toString(),
            pathname: this.basePath + pathname
        });
        return decodeURIComponent(uri);
    }
}

class WsClient extends Client {
    constructor(protocol = "ws", host, port, basePath) {
        super(protocol, host, port, basePath);
        const proxyURL = process.env.https_proxy;
        let wsOpts = proxyURL ? { agent: new HttpsProxyAgent(proxyURL) } : null;
        const ddpOptions = {
            endpoint: this.makeUri(),
            SocketConstructor: function (endpoint) { return new WebSocket(endpoint, wsOpts); }
        };
        this.ddp = new DDP(ddpOptions);
    }

    request(method, path, params, callback) {
        if (method === "method") {
            const methodId = this.ddp.method(path, params || []);
            this.ddp.on("result", message => {
                if (message.id === methodId) {
                    if (message.error)
                        callback(message.error, null);
                    else
                        callback(null, message.result);
                }
            });
        }
        else {
            throw new Error("Reqested method for WebSocket not implemented");
        }
    }
    
    subscribe(userId, notificationStream, event, callback) {
        this.ddp.sub(notificationStream, [`${userId}/${event}`, false]);
        // publish stream on change event
        this.ddp.on("changed", (message) => {
            if (message.collection === notificationStream)
                callback(message.fields.args[0], callback);
        });
    }
}
exports.WsClient = WsClient;

class RestClient extends Client {

    tryParseJson(body) {
        try {
            return JSON.parse(body);
        }
        catch (err) {
            return false;
        }
    }

    constructor(protocol, host, port, basePath) {
        super(protocol, host, port, basePath);
        this.clientRequest = require('request');
        this.headers = {};
        this.headers["content-type"] = "application/json";
    }

    setHeader(key, value) {
        this.headers[key] = value;
    }
    getHeader(key) {
        return this.headers[key];
    }
    removeHeader(key) {
        delete this.headers[key];
    }

    request(method, path, params, callback) {
        let options = {
            uri: this.makeUri(path),
            method: method,
            body: JSON.stringify(params),
            qs: undefined,
            headers: this.headers
        };

        if (method === "GET") {
            options.qs = params;
            options.body = null;
        }

        this.clientRequest(options, (error, response, body) => {
            if (error) {
                callback(error, null);
                return;
            }
            if (response.statusCode === 401) {
                return callback(new RequestError("Requested method requires an authentication", 401), null);
            }
            if (response.statusCode === 404) {
                return callback(new RequestError("Requested resource was not found", 404), null);
            }
            if (response.statusCode === 405) {
                return callback(new RequestError("Requested method is not allowed", 405), null);
            }
            if (response.statusCode !== 200) {
                body = this.tryParseJson(body);
                return callback(new RequestError(body.error || "An unknown error has occured", response.statusCode), null);
            }
            if (body === undefined) {
                return callback(null, null);
            }
            callback(null, this.tryParseJson(body));
        });
    }
}
exports.RestClient = RestClient;
