let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);


app.use(express.static( __dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// let dbUrl = 'mongodb://username:password@ds257981.mlab.com:57981/simple-chat'

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
});

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    let message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})


let {event} = require('../common/constrant');

io.on('connection', (socket) =>{
    console.log('a user is connected: ', socket.id);

    socket.on('join', function(data) {
        console.log(data);
        socket.emit('messages', 'Hello from server');
    });

    socket.on(event.JOIN_ROOM, function (data) {
        console.info('JOIN', data.roomId);
        socket.roomId = data.roomId;
        socket.join(data.roomId);
        io.emit("roomJoined", 'hello every body');
        let roomIds = socket.rooms;

        console.info('ID ROOMS: ', roomIds)
    });

    socket.on('messages', function(data) {
        console.info('Message: ', data)
        socket.emit('broad', data);
        socket.broadcast.emit('broad',data);
    });

    socket.on('GET_DATA_ORDER', function(data) {
        console.log('BEGIN GET DATA: ', data);
        // socket.emit('CRAWL_DATA', 'Hello from server => crawl data');
        io.to('ROOM_AMZ_CRAWL_ORDER').emit('CRAWL_DATA', 'Hello from server => crawl data');
    });

    socket.on('CRAWL_DATA_RESULT', function(data) {
        console.log('GET ORDER SUCCESS: ', data);
        //store to DB
    });

});





// mongoose.connect(dbUrl ,{useMongosocket : true} ,(err) => {
//     console.log('mongodb connected',err);
// })

let server = http.listen(3001, () => {
    console.log('server is running on port', server.address().port);
});
