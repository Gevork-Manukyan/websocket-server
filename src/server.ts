import express from 'express'; // Import Express
import http from 'http'; // Import Node.js HTTP module
import { Server, Socket } from 'socket.io'; // Import types from Socket.IO
import { PORT } from './utils/constants';

const app = express()
const server = http.createServer(); // Create an HTTP server

// Middleware to parse JSON requests
app.use(express.json());
// Allows for CORS
// const cors = require('cors');
// app.use(cors())

// Initialize the WebSocket server with CORS settings
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (for development)
        methods: ['GET', 'POST'], // Allowed HTTP methods
    },
});

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay")

gameNamespace.on('connection', (socket) => {
    console.log('A player connected to the gameplay namespace');

    // Join Game Room
    socket.on('join-game', (gameId) => {
        socket.join(gameId); // Creates room if doesn't exist
        console.log(`Player joined game room: ${gameId}`);
    })
})


// Start the HTTP server
server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
});
