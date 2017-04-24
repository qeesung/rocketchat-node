# JavaScript RocketChat API for node.js

[![Join the chat at https://gitter.im/rocketchat-node/Lobby](https://badges.gitter.im/rocketchat-node/Lobby.svg)](https://gitter.im/rocketchat-node/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/qeesung/rocketchat-node.svg?branch=master)](https://travis-ci.org/qeesung/rocketchat-node)

A node.js module, which provides an object oriented wrapper for the RocketChat REST API.

RocketChat official website address can be found [here](https://rocket.chat/)  .
RocketChat REST API document can be found [here](https://rocket.chat/docs/developer-guides/rest-api/).

## getting started

```bash
npm install rocketchat
```

```js
var RocketChatApi = require('rocketchat').RocketChatApi;
// OR
var RocketChatClient = require('rocketchat').RocketChatClient;
```

This Lib library package the following functions:

## old api

- [create client](#create-client)
- [login](#login)
- [logout](#logout)
- [get list of public rooms](#public-rooms)
- [join a room](#join)
- [leave a room](#leave)
- [creating a room](#createRoom)
- [get all unread messages in a room](#unread-messages)
- [sending a message](#send-messages)

## [new api (implemented have links)](#newapi)

**Note:** The new api cannot be used directly yet

- [Miscellaneous](#Miscellaneous)
  - [info](#Miscellaneous.info)
- [Authentication](#Authentication)
  - [login](#Authentication.login)
  - [logout](#Authentication.logout)
  - [me](#Authentication.me)
- [Users](#Users)
  - [create](#Users.create)
  - [delete](#Users.delete)
  - [getPresence](#Users.getPresence)
  - [info](#Users.info)
  - [list](#Users.list)
  - [setAvatar](#Users.setAvatar)
  - [update](#Users.update)
- [Channels](#Channels)
  - addAll
  - addModerator
  - addOwner
  - archive
  - cleanHistory
  - close
  - [create](#Channels.create)
  - getIntegrations
  - history
  - info
  - invite
  - kick
  - [leave](#Channels.leave)
  - list.joined
  - [list](#Channels.list)
  - open
  - removeModerator
  - removeOwner
  - rename
  - setDescription
  - setJoinCode
  - setPurpose
  - setReadOnly
  - [setTopic](#Channels.setTopic)
  - setType
  - unarchive
- Groups
  - addAll
  - addModerator
  - addOwner
  - archive
  - close
  - create
  - getIntegrations
  - history
  - info
  - invite
  - kick
  - leave
  - list
  - open
  - removeModerator
  - removeOwner
  - rename
  - setDescription
  - setPurpose
  - setReadOnly
  - setTopic
  - setType
  - unarchive
- Im
  - close
  - history
  - list.everyone
  - list
  - messages.others
  - open
  - setTopic
- [Chat](#Chat)
  - delete
  - [postMessage](#Chat.postMessage)
  - update
- Settings
  - get
  - update
- Integration
  - create
  - list
  - remove
- Livechat
- [Realtime](#Realtime)
  - [API](#RealtimeAPI)
    - [Login](#Realtime.login)
    - [Logout](#Realtime.logout)
    - Get User Roles
    - List Custom Emoji
    - Load History
    - Get Room Roles
    - Get Subscriptions
    - Get Rooms
    - Get Public Settings
    - Get Permissions
    - User Presence
    - Notify Room Stream
    - Send Message
    - Delete Message
    - Update Message
    - Pin Message
    - Unpin Message
    - Star Message
    - Set Reaction
    - Create Channels
    - Create Private Groups
    - Delete Rooms
    - Archive Rooms
    - Unarchive Rooms
    - Joining Channels
    - [Leaving Rooms](#Realtime.leaveRoom)
    - Hiding Rooms
    - Opening Rooms
    - Favoriting Rooms
    - Save Room Settings
  - [Subscriptions](#Subscriptions)
    - [stream-notify-user](#Subscriptions.stream-notify-user)
      - [notification](#Subscriptions.stream-notify-user.notification)


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
// rocketchat api wrapper
var RocketChatApi = require('rocketchat').RocketChatApi;
// alpha-api versions
var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password);
// v1-api versions
var rocketChatApi = new RocketChatApi('http', config.host, config.port, config.user, config.password, "v1");

// direct access to new api
var RocketChatClient = require('rocketchat').RocketChatClient;
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

## <a id="newapi"></a>new api

### <a id="Miscellaneous"></a>Miscellaneous

#### <a id="Miscellaneous.info"></a>Info

A simple method, requires no authentication, that returns information about the server including version information.

```js
this.rocketChatClient.miscellaneous.info(function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/miscellaneous/info)](https://rocket.chat/docs/developer-guides/rest-api/miscellaneous/info)

```json
{
  "success": true,
  "info": {
    "version": "0.47.0-develop",
    "build": {
      "nodeVersion": "v4.6.2",
      "arch": "x64",
      "platform": "linux",
      "cpus": 4
    },
    "commit": {
      "hash": "5901cc7270e3587101631ee222def950d705c611",
      "date": "Thu Dec 1 19:08:01 2016 -0200",
      "author": "Gabriel Engel",
      "subject": "Merge branch 'develop' into experimental",
      "tag": "0.46.0",
      "branch": "experimental"
    }
  }
}
```

### <a id="Authentication"></a>Authentication

The authentication with the API is a process that is handled for you automatically when you create a new instance of the client.

```js
var rocketChatApi = new RocketChatApi('https', 'my-rocket.chat', 443, 'admin', 'password', function () {
    // both rest api and realtime api are succesfully authenticated, given user and password are correct
});
```

You can, however, use the provided methods to switch user, or - i.e. if you don't have the credentials at startup time - you can choose a late authentication.

Note that the api methods here will only authenticate the Web Api, not the realtime websocket api. For authenticating the realtime api, please [Check here](#Realtime.login).

#### <a id="Authentication.login"></a>login

```js
this.rocketChatClient.authentication.login(username, password, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/authentication/login)](https://rocket.chat/docs/developer-guides/rest-api/authentication/login)

```json
{
  "status": "success",
  "data": {
      "authToken": "9HqLlyZOugoStsXCUfD_0YdwnNnunAJF8V47U3QHXSq",
      "userId": "aobEdbYhXfu5hkeqG"
   }
}
```

#### <a id="Authentication.logout"></a>logout

```js
this.rocketChatClient.authentication.logout(function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/authentication/logout)](https://rocket.chat/docs/developer-guides/rest-api/authentication/logout)

```json
{
  "status": "success",
  "data": {
      "authToken": "9HqLlyZOugoStsXCUfD_0YdwnNnunAJF8V47U3QHXSq",
      "userId": "aobEdbYhXfu5hkeqG"
   }
}
```


#### <a id="Authentication.me"></a>me

Quick information about the authenticated user.

```js
this.rocketChatClient.authentication.me(function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/authentication/me)](https://rocket.chat/docs/developer-guides/rest-api/authentication/me)

```json
{
  "_id": "aobEdbYhXfu5hkeqG",
  "name": "Example User",
  "emails": [
    {
      "address": "example@example.com",
      "verified": true
    }
  ],
  "status": "offline",
  "statusConnection": "offline",
  "username": "example",
  "utcOffset": 0,
  "active": true,
  "success": true
}
```

### <a id="Users"></a>Users

#### <a id="Users.create"></a>create

**NOTE** Due to a funny behavior of rocket.chat not responding to this call, the result is evaluated with a workaround and will always take minimum 500ms!

```js
var userToAdd = {
    "name": "name",
    "email": "email@example.com",
    "password": "anypassyouwant",
    "username": "uniqueusername",
    "sendWelcomeEmail": false,
    "joinDefaultChannels": false,
    "verified":false,
    "requirePasswordChange":false,
    "roles":["user"]
};
this.rocketChatClient.users.create(userToAdd, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/users/create)](https://rocket.chat/docs/developer-guides/rest-api/users/create)

```json
{
   "user": {
      "_id": "BsNr28znDkG8aeo7W",
      "createdAt": "2016-09-13T14:57:56.037Z",
      "services": {
         "password": {
            "bcrypt": "$2a$10$5I5nUzqNEs8jKhi7BFS55uFYRf5TE4ErSUH8HymMNAbpMAvsOcl2C"
         }
      },
      "username": "uniqueusername",
      "emails": [
         {
            "address": "email@user.tld",
            "verified": false
         }
      ],
      "type": "user",
      "status": "offline",
      "active": true,
      "roles": [
         "user"
      ],
      "_updatedAt": "2016-09-13T14:57:56.175Z",
      "name": "name",
      "customFields": {
         "twitter": "@userstwitter"
      }
   },
   "success": true
}
```

#### <a id="Users.delete"></a>delete

```js
this.rocketChatClient.users.delete(userId, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/users/delete)](https://rocket.chat/docs/developer-guides/rest-api/users/delete)

```json
{
  "success": true
}
```

#### <a id="Users.getPresence"></a>getPresence

```js
this.rocketChatClient.users.getPresence(userId, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/users/getpresence)](https://rocket.chat/docs/developer-guides/rest-api/users/getpresence)

```json
{
  "presence": "offline",
  "success": true
}
```

#### <a id="Users.info"></a>info

```js
this.rocketChatClient.users.info(userId, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/users/info)](https://rocket.chat/docs/developer-guides/rest-api/users/info)

```json
{
  "user": {
    "_id": "nSYqWzZ4GsKTX4dyK",
    "type": "user",
    "status": "offline",
    "active": true,
    "name": "Example User",
    "utcOffset": 0,
    "username": "example"
  },
  "success": true
}
```

#### <a id="Users.list"></a>list

```js
this.rocketChatClient.users.list(offset, count, function (err, body) {});
this.rocketChatClient.users.list(function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/users/list)](https://rocket.chat/docs/developer-guides/rest-api/users/list)

```json
{
  "user": [{
    "_id": "nSYqWzZ4GsKTX4dyK",
    "type": "user",
    "status": "offline",
    "active": true,
    "name": "Example User",
    "utcOffset": 0,
    "username": "example"
  }],
  "success": true
}
```
#### <a id="Users.setAvatar"></a>setAvatar

```js
this.rocketChatClient.users.setAvatar(userId, avatarUrl, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/users/setavatar)](https://rocket.chat/docs/developer-guides/rest-api/users/setavatar)

```json
{
    "success": true
}
```

#### <a id="Users.update"></a>update

```js
this.rocketChatClient.users.update(userId, updateData, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/users/update)](https://rocket.chat/docs/developer-guides/rest-api/users/update)


```json
{
   "user":{
      "_id": "BsNr28znDkG8aeo7W",
      "createdAt": "2016-09-13T14:57:56.037Z",
      "services": {
         "password": {
            "bcrypt": "$2a$10$5I5nUzqNEs8jKhi7BFS55uFYRf5TE4ErSUH8HymMNAbpMAvsOcl2C"
         }
      },
      "username": "uniqueusername",
      "emails": [
         {
            "address": "newemail@user.tld",
            "verified": false
         }
      ],
      "type": "user",
      "status": "offline",
      "active": true,
      "roles": [
         "user"
      ],
      "_updatedAt": "2016-09-13T14:57:56.175Z",
      "name": "new name",
      "customFields": {
         "twitter": "userstwitter"
      }
   },
   "success": true
}
```

### <a id="Channels"></a>Channels

#### <a id="Channels.create"></a>create

Creates a new public channel.

```js
this.rocketChatClient.channels.create(roomName, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/channels/create)](https://rocket.chat/docs/developer-guides/rest-api/channels/create)

```json
{
   "channel": {
      "_id": "ByehQjC44FwMeiLbX",
      "name": "channelname",
      "t": "c",
      "usernames": [
         "example"
      ],
      "msgs": 0,
      "u": {
         "_id": "aobEdbYhXfu5hkeqG",
         "username": "example"
      },
      "ts": "2016-05-30T13:42:25.304Z"
   },
   "success": true
}
```

#### <a id="Channels.leave"></a>leave

Causes the callee to be removed from the channel.

```js
this.rocketChatClient.channels.leave(roomId, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/channels/leave)](https://rocket.chat/docs/developer-guides/rest-api/channels/leave)

```json
{
  "channel": {
    "_id": "ByehQjC44FwMeiLbX",
    "name": "invite-me",
    "t": "c",
    "usernames": [
      "testing2"
    ],
    "msgs": 0,
    "u": {
      "_id": "aobEdbYhXfu5hkeqG",
      "username": "testing1"
    },
    "ts": "2016-12-09T15:08:58.042Z",
    "ro": false,
    "sysMes": true,
    "_updatedAt": "2016-12-09T15:22:40.656Z"
  },
  "success": true
}
```

#### <a id="Channels.list"></a>list

Lists all of the channels on the server, this method supports the Offset and Count Query Parameters.

```js
// get the first items
this.rocketChatClient.channels.list({}, function (err, body) {});
// get by offset and count
// first 5 items
this.rocketChatClient.channels.list({0, 5}, function (err, body) {});
// third page
this.rocketChatClient.channels.list({10, 5}, function (err, body) {});
// find an item using mongo query syntax
this.rocketChatClient.channels.list({ query : { "name": { "$regex": "thisreallydoesnotexist" } } }, function (err, body) {});
// sort using mongo sort syntax
this.rocketChatClient.channels.list({ sort : { "_updatedAt": 1 } }, function (err, body) {});
// fielding using mongo field syntax
this.rocketChatClient.channels.list({ fields : { "name": 1 } }, function (err, body) {});

```

[Result (https://rocket.chat/docs/developer-guides/rest-api/channels/list)](https://rocket.chat/docs/developer-guides/rest-api/channels/list)

```json
{
    "channels": [
        {
            "_id": "ByehQjC44FwMeiLbX",
            "name": "test-test",
            "t": "c",
            "usernames": [
                "testing1"
            ],
            "msgs": 0,
            "u": {
                "_id": "aobEdbYhXfu5hkeqG",
                "username": "testing1"
            },
            "ts": "2016-12-09T15:08:58.042Z",
            "ro": false,
            "sysMes": true,
            "_updatedAt": "2016-12-09T15:22:40.656Z"
        },
        {
            "_id": "t7qapfhZjANMRAi5w",
            "name": "testing",
            "t": "c",
            "usernames": [
                "testing2"
            ],
            "msgs": 0,
            "u": {
                "_id": "y65tAmHs93aDChMWu",
                "username": "testing2"
            },
            "ts": "2016-12-01T15:08:58.042Z",
            "ro": false,
            "sysMes": true,
            "_updatedAt": "2016-12-09T15:22:40.656Z"
        }
    ],
    "success": true
}
```

#### <a id="Channels.setTopic"></a>setTopic

Sets the topic for the channel.

```js
this.rocketChatClient.channels.setTopic(roomId, topic, function (err, body) {});
```

[Result (https://rocket.chat/docs/developer-guides/rest-api/channels/settopic)](https://rocket.chat/docs/developer-guides/rest-api/channels/settopic)

```json
{
  "topic": "Testing out everything.",
  "success": true
}
```

#### <a id="Chat"></a>Chat

#### <a id="Chat.postMessage"></a>postMessage

Post a chat message

```js
this.rocketChatClient.chat.postMessage({ roomId : roomId, text : message }, callback);
```

The passed object is equivalent to the [payload](https://rocket.chat/docs/developer-guides/rest-api/chat/postmessage#payload) from the documentation.

[Result (https://rocket.chat/docs/developer-guides/rest-api/chat/postmessage)](https://rocket.chat/docs/developer-guides/rest-api/chat/postmessage)

```json
{
  "ts": 1481748965123,
  "channel": "general",
  "message": {
    "alias": "",
    "msg": "This is a test!",
    "parseUrls": true,
    "groupable": false,
    "ts": "2016-12-14T20:56:05.117Z",
    "u": {
      "_id": "y65tAmHs93aDChMWu",
      "username": "graywolf336"
    },
    "rid": "GENERAL",
    "_updatedAt": "2016-12-14T20:56:05.119Z",
    "_id": "jC9chsFddTvsbFQG7"
  },
  "success": true
}
```

#### <a id="Realtime"></a>Realtime

**IMPORTANT!** These implementations are based on an unreleased version of the API. Use this at the risk that it may stop working anytime.

The realtime API is composed of two elements: Method Calls and Subscriptions.

Methods allow you to invoke methods (i.e. send message) while subscriptions allow you to subscribe to methods. Not all methods of the realtime api are implemented, so combining those two apis - classic and realtime - should give you all the tools you need to create an interactive application.

#### <a id="RealtimeAPI"></a>Realtime API

  - [Login](#Realtime.login)
  - [Logout](#Realtime.logout)
  - Send Message
  - [Leaving Rooms](#Realtime.leaveRoom)


#### <a id="Subscriptions"></a>Subscriptions

##### <a id="Subscriptions.stream-notify-user"></a>stream-notify-user

###### <a id="Subscriptions.stream-notify-user.notification"></a>notification

Subscribe to notification. A notification seems to be a mention in a channel. The result is only a part of the full message, to get attachments one will have to query for the message afterwards.

```js
this.rocketChatClient.notify.user.onNotification(userId, callback);
```

Result:

```json
{
    "msg":"changed",
    "collection":"stream-notify-user",
    "id":"id",
    "fields":{
        "eventName":"${userId}/message",
        "args":[
            {
                "title":"@username-sender",
                "text":"message text",
                "payload":{
                    "_id":"id of the payload. might be use to ensure delivered only once?",
                    "rid":"some id, probably userId + smth unique?",
                    "sender":{
                        "_id":"userid of the sender",
                        "username":"username of sender"
                    },
                    "type":"d"
                }
            }
        ]
    }
}
```


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

