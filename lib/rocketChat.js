var net = require("./net");

function RocketChatClient(protocol, host, port, username, password, onConnected) {
    onConnected = onConnected || function() {};
    var restClient = new net.RestClient(protocol, host, port, "/api/v1/");
    var wsClient = new net.WsClient("ws", host, port, "/websocket");

    this.authentication = new (require("./api/authentication"))(restClient);

    this.miscellaneous = new (require("./api/miscellaneous"))(restClient);
    this.chat = new (require("./api/chat"))(restClient);
    this.channels = new (require("./api/channels"))(restClient);
    this.settings = new (require("./api/setting"))(restClient);
    this.users = new (require("./api/users"))(restClient);
    this.realtime = new (require("./api/realtime"))(wsClient);
    this.notify = new (require("./api/notify"))(wsClient);

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

            self.realtime.login(username, password, function (err, body) {
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