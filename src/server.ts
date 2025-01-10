import { Server, Socket } from 'socket.io'; // Import types from Socket.IO
import http from 'http'; // Import Node.js HTTP module

// Create an HTTP server
const server = http.createServer();

// Initialize the WebSocket server with CORS settings
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (for development)
        methods: ['GET', 'POST'], // Allowed HTTP methods
    },
});

// Define the structure of the data sent in 'move' events
interface MoveData {
    x: number;
    y: number;
    [key: string]: any; // Allow additional properties
}

// Handle new connections
io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Listen for 'move' events from the client
    socket.on('move', (data: MoveData) => {
        const newData = {
            ...data,
            userId: socket.id, // Attach the user ID
        };
        console.log('Move received:', newData);

        // Broadcast the event to all other clients
        socket.broadcast.emit('update', newData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the HTTP server
const PORT = 3002; // Port for the WebSocket server
server.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
});
