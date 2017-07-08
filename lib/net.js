"use strict";

const url = require("url");
const DDP = require("ddp.js").default;
const WebSocket = require("ws");
const Promise = require("bluebird");
const HttpsProxyAgent = require("https-proxy-agent");

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
        let wsOpts = proxyURL ? {agent: new HttpsProxyAgent(proxyURL)} : null;
        const ddpOptions = {
            endpoint: this.makeUri(),
            SocketConstructor: function (endpoint) {
                return new WebSocket(endpoint, wsOpts);
            }
        };
        this.ddp = new DDP(ddpOptions);
    }

    request(method, path, params, callback) {
        if (method === "method") {
            const methodId = this.ddp.method(path, params || []);
            this.ddp.on("result", (message) => {
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

    subscribe({ userId = false, stream, event, secondparam = false }, onEventPublished) {
        if (userId) {
            this.ddp.sub(stream, [`${userId}/${event}`, secondparam]);
        }
        else {
            this.ddp.sub(stream, [`${event}`, secondparam]);
        }

        // publish stream on change event I guess
        this.ddp.on("changed", (message) => {
            if (message.collection === stream) {
                // how will I get an error? Will I ever get an error?
                onEventPublished(null, message);
            }
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
        this.clientRequest = require("request");
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

    request(method, path, params, callback = null) {
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

        return new Promise((resolve, reject) => {
            this.clientRequest(options, (error, response, body) => {
                if (error) {
                    return callback ? callback(error, null) : reject(error);
                }

                body = this.tryParseJson(body);
                let errorMessage = {
                    401: "Requested method requires an authentication",
                    404: "Requested resource was not found",
                    405: "Requested method is not allowed",
                    else: body.error || "An unknown error has occured"
                };

                if (response.statusCode !== 200 || body === undefined) {
                    let errContent = new RequestError(errorMessage[response.statusCode] || errorMessage["else"], response.statusCode);
                    return callback ? callback(errContent, null) : reject(errContent);
                }

                return callback ? callback(null, body) : resolve(body);
            });
        });
    }
}
exports.RestClient = RestClient;
