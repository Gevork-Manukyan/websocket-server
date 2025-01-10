import express from 'express'; // Import Express
import http from 'http'; // Import Node.js HTTP module
import { Server } from 'socket.io'; // Import types from Socket.IO
import { PORT } from './utils/constants';
import { CurrentGames, gameId, Player } from './utils/types';

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



const currentGames: CurrentGames = {}

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay")
gameNamespace.on('connection', (socket) => {
    console.log('A player connected to the gameplay namespace');

    socket.on('join-game', (gameId: gameId) => {
        socket.join(gameId); // Creates room if doesn't exist
        console.log(`Player joined game room: ${gameId}`);
    })

    socket.on("leave-room", (gameId: gameId, playerId: Player["id"]) => {
        const newPlayerList = currentGames[gameId].players.filter(player => player.id !== playerId);
        currentGames[gameId] = { ...currentGames[gameId], players: newPlayerList }
        socket.leave(gameId);
    })

    socket.on('disconnect', () => {
        console.log(`Player disconnected from gameplay namespace`);
    })
})


// Start the HTTP server
server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
});
