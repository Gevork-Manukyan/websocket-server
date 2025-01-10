import express from 'express'; // Import Express
import http from 'http'; // Import Node.js HTTP module
import { Server } from 'socket.io'; // Import types from Socket.IO
import { PORT } from './utils/constants';
import { CurrentGames, Game } from './utils/types';
import { createGame, createPlayer, getPlayer } from './utils/utilities';

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

    socket.on('join-game', (gameId: Game['id']) => {
        // Create game if doesn't exist
        if (!currentGames[gameId]) currentGames[gameId] = createGame(gameId)
        
        // Add new player to the game
        currentGames[gameId].players.push(createPlayer(socket.id))
        socket.join(gameId); // Creates room if doesn't exist
        console.log(`Player joined game: ${gameId}`);
    })

    socket.on("toggle-ready-status", (gameId: Game['id']) => {
        const currPlayer = getPlayer(currentGames, gameId, socket.id)
        if (!currPlayer) {
            throw new Error(`Player with socket ID ${socket.id} not found in game ${gameId}`);
        }
        currPlayer.readyStatus = !currPlayer.readyStatus
    })

    socket.on("start-game", (gameId: Game['id']) => {

    })

    socket.on("leave-game", (gameId: Game['id']) => {
        // filter out the player leaving
        const currPlayerId = socket.id;
        const gameRoom = currentGames[gameId];
        const newPlayerList = gameRoom.players.filter(player => player.id !== currPlayerId);
        currentGames[gameId] = { ...gameRoom, players: newPlayerList }

        socket.leave(gameId);
        console.log(`Player ${currPlayerId} left game ${gameId}`)
    })

    socket.on('disconnect', () => {
        console.log(`Player disconnected from gameplay namespace`);
    })
})


// Start the HTTP server
server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
});