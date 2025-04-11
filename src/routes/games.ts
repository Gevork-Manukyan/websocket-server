import express from 'express';
import { ConGameModel } from '../models/ConGame/db-model';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { isStarted } = req.query;
        
        const query: any = {};
        
        if (isStarted !== undefined) {
            query.isStarted = isStarted === 'true';
        }
    
        const games = await ConGameModel.find(query);
        console.log("games", games);
        const cleanedGames = games.map((game) => {
            return {
                _id: game.id,
                gameName: game.gameName,
                isPrivate: game.isPrivate,
                numPlayersTotal: game.numPlayersTotal,
                numCurrentPlayers: game.players.length,
            }
        });
        res.json(cleanedGames);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

export default router; 