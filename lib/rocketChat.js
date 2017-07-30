var net = require("./net");

function RocketChatClient(protocol, host, port, username, password, onConnected) {
    let basepath = "";
        
    if (arguments.length === 1) {
        host = arguments[0].host || "localhost";
        port = arguments[0].port || 3000;
        username = arguments[0].username || "";
        password = arguments[0].password || "";
        onConnected = arguments[0].onConnected;
        basepath = arguments[0].basepath || "";
        protocol = arguments[0].protocol || "http";
    }
    
    onConnected = onConnected || function() {};
    var restClient = new net.RestClient(protocol, host, port, basepath + "/api/v1/");
    var wsClient = new net.WsClient("ws", host, port, basepath + "/websocket");

    this.authentication = new (require("./api/authentication"))(restClient);

    this.miscellaneous = new (require("./api/miscellaneous"))(restClient);
    this.chat = new (require("./api/chat"))(restClient);
    this.channels = new (require("./api/channels"))(restClient);
    this.groups = new (require("./api/groups"))(restClient);
    this.settings = new (require("./api/setting"))(restClient);
    this.users = new (require("./api/users"))(restClient);
    this.integration = new (require("./api/integration"))(restClient);
    this.realtime = new (require("./api/realtime"))(wsClient);
    this.notify = new (require("./api/notify"))(wsClient);
    this.im = new (require("./api/im"))(restClient);

    this.restClient = restClient;
    this.wsClient = wsClient;

    var self = this;

    if (username && password) {
        this.authentication.login(username, password, function (err, body) {
            if (err) {
                return onConnected(err, null);
            }

            let userId = body.data.userId;

            restClient.setHeader("X-Auth-Token", body.data.authToken);
            restClient.setHeader("X-User-Id", userId);

            self.realtime.login(username, password, function (err) {
                if (err) {
                    return onConnected(err, null);
                }

                onConnected(null, { userId });
            });
        });
    } else {
        onConnected(null, null);
    }
}

exports.RocketChatClient = RocketChatClient;