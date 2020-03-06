/**
 * Created by vulong on 06/03/2020.
 */

let {event} = require('../../common/constrant');

module.exports = function (http, sessionParser) {

    let sharedSession = require("express-socket.io-session");
    let socket = require('socket.io')(http);

    socket.use(sharedSession(sessionParser));

    socket.on('connection', (client) =>{
        console.log('a user is connected: ', client.id);

        client.on(event.JOIN_ROOM, function (data) {
            console.info('JOIN', data.roomId);
            client.roomId = data.roomId;
            client.join(data.roomId);
            socket.emit("roomJoined", 'hello every body');
            let roomIds = client.rooms;

            console.info('ID ROOMS: ', roomIds)
        });

        client.on('messages', function(data) {
            console.info('Message: ', data)
            client.emit('broad', data);
            client.broadcast.emit('broad',data);
        });

        client.on('GET_DATA_ORDER', function(data) {
            console.log('BEGIN GET DATA: ', data);
            // client.emit('CRAWL_DATA', 'Hello from server => crawl data');
            socket.to('ROOM_AMZ_CRAWL_ORDER').emit('CRAWL_DATA', 'Hello from server => crawl data');
        });

        client.on('CRAWL_DATA_RESULT', function(data) {
            console.log('GET ORDER SUCCESS: ', data);
            //store to DB
        });

    });

};
