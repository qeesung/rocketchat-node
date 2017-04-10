"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var url = require("url");
var DDP = require("ddp.js").default;
var WebSocket = require("ws");
var HttpsProxyAgent = require('https-proxy-agent');
var RequestError = (function (_super) {
    __extends(RequestError, _super);
    function RequestError(message, statusCode) {
        var _this = _super.call(this, message) || this;
        _this.name = "RequestError";
        _this.statusCode = statusCode;
        Error.captureStackTrace(_this, RequestError);
        return _this;
    }
    return RequestError;
}(Error));
var Client = (function () {
    function Client(protocol, host, port, basePath) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.basePath = basePath;
    }
    Client.prototype.makeUri = function (pathname) {
        if (pathname === void 0) { pathname = ""; }
        var uri = url.format({
            protocol: this.protocol,
            hostname: this.host,
            port: this.port.toString(),
            pathname: this.basePath + pathname
        });
        return decodeURIComponent(uri);
    };
    ;
    return Client;
}());
var WsClient = (function (_super) {
    __extends(WsClient, _super);
    function WsClient(protocol, host, port, basePath) {
        if (protocol === void 0) { protocol = "ws"; }
        var _this = _super.call(this, protocol, host, port, basePath) || this;
        var proxyURL = process.env.https_proxy;
        var wsOpts = proxyURL ? { agent: new HttpsProxyAgent(proxyURL) } : null;
        var ddpOptions = {
            endpoint: _this.makeUri(),
            SocketConstructor: function (endpoint) { return new WebSocket(endpoint, wsOpts); }
        };
        _this.ddp = new DDP(ddpOptions);
        return _this;
    }
    WsClient.prototype.request = function (method, path, params, callback) {
        if (method === "method") {
            var methodId_1 = this.ddp.method(path, params || []);
            this.ddp.on("result", function (message) {
                if (message.id === methodId_1) {
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
    };
    return WsClient;
}(Client));
exports.WsClient = WsClient;
var RestClient = (function (_super) {
    __extends(RestClient, _super);
    function RestClient(protocol, host, port, basePath) {
        var _this = _super.call(this, protocol, host, port, basePath) || this;
        _this.clientRequest = require('request');
        _this.headers = {};
        return _this;
    }
    RestClient.prototype.tryParseJson = function (body) {
        try {
            return JSON.parse(body);
        }
        catch (err) {
            return false;
        }
    };
    RestClient.prototype.setHeader = function (key, value) {
        this.headers[key] = value;
    };
    RestClient.prototype.getHeader = function (key) {
        return this.headers[key];
    };
    RestClient.prototype.removeHeader = function (key) {
        delete this.headers[key];
    };
    RestClient.prototype.request = function (method, path, params, callback) {
        var _this = this;
        var options = {
            uri: this.makeUri(path),
            method: method,
            form: params,
            headers: this.headers
        };
        this.clientRequest(options, function (error, response, body) {
            if (error) {
                callback(error, null);
                return;
            }
            if (response.statusCode === 404) {
                return callback(new RequestError("Requested resource was not found", 404));
            }
            if (response.statusCode !== 200) {
                return callback(new RequestError("An unknown error has occured", response.statusCode));
            }
            if (body === undefined) {
                return callback(null, null);
            }
            callback(null, _this.tryParseJson(body));
        });
    };
    return RestClient;
}(Client));
exports.RestClient = RestClient;
