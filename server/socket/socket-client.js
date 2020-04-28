/**
 * Created by vulong on 05/03/2020.
 */
let schedule = require('node-schedule');
let socketAddress = 'https://amz-tooly.herokuapp.com/';
let {socket_definer, event} =  require('../../common/constrant');
let clientSocket = require('socket.io-client')(socketAddress);

let data = {
    userId : 'amz_controller',
    message: 'GET_ORDER_UN_SHIP'
};

clientSocket.on('broad', function(data) {
    console.info('server reply broad: ', data)
});

clientSocket.emit(event.JOIN_ROOM, {roomId : socket_definer.ROOM_ID, userId: data.userId});


clientSocket.on(event.JOINED_SUCCESS, function (data) {
    console.info('You join success: ', data);
});



let job = schedule.scheduleJob('0 56 10 * * *', function(){
    console.log('Emit get oder!');
    clientSocket.emit('GET_DATA_ORDER', data);
});

// clientSocket.on('CRAWL_DATA', function(data) {
//     console.info(data);
//
//     // done
//
//     clientSocket.emit('CRAWL_DATA_RESULT', 'Crwal data  Genk  success!');
//
// });