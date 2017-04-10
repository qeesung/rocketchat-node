var net = require('./net');

function RocketChatClient(protocol, host, port, username, password) {
    var restClient = new net.RestClient(protocol, host, port, "/api/v1/");
    var wsClient = new net.WsClient("ws", host, port, "/websocket");

    this.authentication = require('./api/authentication')(restClient);
    if (username && password) {
        this.authentication.login(username, password, function(err, body) {
            if (err) {
                console.log(err);
                throw new Error("Could not login. Check username and password");
            }

            restClient.setHeader("X-Auth-Token", body.data.authToken);
            restClient.setHeader("X-User-Id", body.data.userId);
        });
    }
    
    this.miscellaneous = require('./api/miscellaneous')(restClient);
    this.chat = require('./api/chat')(restClient);
}

exports.RocketChatClient = RocketChatClient;