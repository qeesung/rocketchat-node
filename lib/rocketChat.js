var net = require('./net');

function RocketChatClient(protocol, host, port, username, password, onConnected) {
    var restClient = new net.RestClient(protocol, host, port, "/api/v1/");
    var wsClient = new net.WsClient("ws", host, port, "/websocket");

    this.authentication = require('./api/authentication')(restClient);
    
    this.miscellaneous = require('./api/miscellaneous')(restClient);
    this.chat = require('./api/chat')(restClient);
    this.channels = require('./api/channels')(restClient);
    this.realtime = require('./api/realtime')(wsClient);
    
    if (username && password) {
        this.authentication.login(username, password, function(err, body) {
            if (err) {
                throw err;
            }
            
            restClient.setHeader("X-Auth-Token", body.data.authToken);
            restClient.setHeader("X-User-Id", body.data.userId);
            onConnected();
        });
    } else {
        onConnected();
    }
}

exports.RocketChatClient = RocketChatClient;