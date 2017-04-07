# JavaScript RocketChat API for node.js

[![Join the chat at https://gitter.im/rocketchat-node/Lobby](https://badges.gitter.im/rocketchat-node/Lobby.svg)](https://gitter.im/rocketchat-node/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A node.js module, which provides an object oriented wrapper for the RocketChat REST API.

RocketChat official website address can be found [here](https://rocket.chat/)  .
RocketChat REST API document can be found [here](https://rocket.chat/docs/developer-guides/rest-api/).

This Lib library package the following functions:
 - [create client](#create-client)
 -  [login](#login)
 - [logout](#logout)
 - [get list of public rooms](#public-rooms)
 - [join a room](#join)
 - [leave a room](#leave)
 - [creating a room](#createRoom)
 - [get all unread messages in a room](#unread-messages)
 - [sending a message](#send-messages)

## Installation

Install with the node package manager [npm](http://npmjs.org/):

```
$ npm install rocketchat
```

or

Install via git clone:
```
$ git clone https://github.com/qeesung/rocketchat-node.git
$ cd rocketchat-node
$ npm install
```

## Examples

### <a id="create-client"></a>Create the rocket-chat client

```
var RocketChatApi = require('rocketchat').RocketChatApi;
// alpha-api versions
var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
// v1-api versions
var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "v1");
```

### Obtaining the running rocket-chat version

```
rocketChatApi.version(function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```

### <a id="login"></a>Login rocket-chat

```
rocketChatApi.login(function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```

You don't have to log in every time, and automatically log on when you call the other interface.

### <a id="logout"></a>Logoff rocket-chat

```
rocketChatApi.logout(function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```

### <a id="public-rooms"></a>Get list of public rooms

```
rocketChatApi.getPublicRooms(function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```

### <a id="join"></a>Join a room

```
rocketChatApi.joinRoom(roomID ,function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```

### <a id="leave"></a>Leave a room

```
rocketChatApi.leaveRoom(roomID ,function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```


### <a id="createRoom"></a>Create a room

```
rocketChatApi.createRoom(roomName ,function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```

### <a id="setTopic"></a>Set a rooms topic

```js
rocketChatApi.setTopic(roomID, topicName, function(err, body){
    if(err)
         console.log(err);
    else
        console.log(body);
})
```

### <a id="unread-messages"></a>Get all unread messages in a room

```
rocketChatApi.getUnreadMsg(roomID ,function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```


### <a id="send-messages"></a>Sending a message

```
rocketChatApi.sendMsg(roomID, message, function(err,body){
	if(err)
		console.log(err);
	else
		console.log(body);
})
```

More information can be found by checking [RocektChat REST API](https://rocket.chat/docs/master/developer-guides/rest-api/)


## Options

RocketChatApi Options:

- protocol`<string>`: Typically 'http:' or 'https:'
- host`<string>`: The hostname for your jira server
- port`<int>`: The port your jira server is listening on (probably 80 or 443)
- username`<string>`: The username to log in with
- password`<string>`: Keep it secret, keep it safe

## Implemented APIs

- Authentication
- HTTP
- OAuth(comming soon)
- Room
- get public rooms
- join a room
- leave a room
- Messages
- get unread messages from a room
- send messages to a room
- Set Topic for Room


## TODO

-  achieved  OAuth authentication mode
-  Add SSL security mode

