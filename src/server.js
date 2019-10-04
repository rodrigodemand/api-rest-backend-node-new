const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack-whbwa.mongodb.net/semana09?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//quando restartar o servidor vai perder, portanto deve-se utilizar um banco muito rápido (redis)
const connectedUsers = {};

//verifica os usuarios conectados
io.on('connection', socket => {

    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
});

app.use((req, resp, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//GET, POST, PUT, DELETE

//req.query = Acessar query params (para filtros)
//req.params = Acessar route params (para edição e delete)
//req.body = Acessar corpo da requisição (para criação e edição)

//app.use(cors({ origin: 'http://localhost:3333' })); //acesso limitado
app.use(cors()); // acesso de qualquer lugar
app.use(express.json()); //utilizar formato json
app.use('/files', express.static(path.resolve(__dirname, '..','uploads')));
app.use(routes);

server.listen(3333);