let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let http = require('http').Server(app);

let session = require('express-session');
let sessionParser = session({secret: '!@#$%^&*()', resave: true, saveUninitialized: true});

app.use(express.static( __dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(sessionParser);

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
});

app.post('/messages', (req, res) => {
    let message = new Message(req.body);
    message.save((err) =>{
        if(err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
});

require('./socket/socket')(http, sessionParser);

let server = http.listen(3001, () => {
    console.log('server is running on port', server.address().port);
});
