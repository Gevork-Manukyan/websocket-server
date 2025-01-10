import express from 'express'; // Import Express
import http from 'http'; // Import Node.js HTTP module
import { Server } from 'socket.io'; // Import types from Socket.IO
import { PORT } from './utils/constants';
import { CurrentGames } from './utils/types';
import { createPlayer, getPlayer } from './utils/utilities';
import { ConGame } from './CONGame/ConGame';

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

    socket.on('join-game', (gameId: ConGame['id']) => {
        let gameRoom = currentGames[gameId]
        // Create game if doesn't exist
        if (!gameRoom) {
            gameRoom = new ConGame(gameId)
            gameRoom.addPlayer(createPlayer(socket.id, true)) // Make first player to join the host
        } else {
            gameRoom.addPlayer(createPlayer(socket.id))
        }
        
        socket.join(gameId); // Creates room if doesn't exist
        console.log(`Player joined game: ${gameId}`);
    })

    socket.on("toggle-ready-status", (gameId: ConGame['id']) => {
        const currPlayer = getPlayer(currentGames, gameId, socket.id);
        if (!currPlayer) {
            throw new Error(`Player with socket ID ${socket.id} not found in game ${gameId}`);
        }
        currPlayer.toggleReady();
    })

    socket.on("start-game", (gameId: ConGame['id']) => {
        // Only host can start game
        if (!getPlayer(currentGames, gameId, socket.id)?.isGameHost) return;

        // All players must be ready
        if (!currentGames[gameId].players.every(player => player.isReady)) return;

        // TODO: Start the game
    })

    socket.on("leave-game", (gameId: ConGame['id']) => {
        const currPlayerId = socket.id;
        currentGames[gameId].removePlayer(currPlayerId);

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