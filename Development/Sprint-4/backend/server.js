const databaseConnect = require('./config/databaseConnect');
const dotEnv = require('dotenv');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const initializeChatSocket = require('./sockets/chatSocket'); 

dotEnv.config({ path: './config/config.env' });


// Connect to the database
databaseConnect();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Initialize the socket logic from chatSocket.js
initializeChatSocket(io); 

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on PORT: ${process.env.SERVER_PORT}`);
});
