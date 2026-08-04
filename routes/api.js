import express, { Router } from "express"
import path from 'path';
import { games } from '../namespaces/game.js';
import { Chess } from '../games/parachess/chess.js';
import { deflate } from "zlib";

const MAX_HOURS = 2;
const router = Router();

export default function() {

    router.get('/games', (req, res) => {
        res.send(["parachess", "disconnect4"]);
    });

    router.get('/:game/games', (req, res) => {
        const gameName  = req.params.game;
        const jsonList = [];
        switch (gameName) {
            case "parachess":
                const toDelete = [];
                Object.keys(games).forEach(id => {
                    if (Date.now() - games[id].lastMoveTime > MAX_HOURS * 3600000) // 2h / move
                        toDelete.push(id);
                });
                toDelete.forEach(id => delete games[id]);
                Object.keys(games).forEach(game => {
                    jsonList.push({
                        name: game,
                        playable: games[game].isPlayable()
                    });
                });
                break;
            case "disconnect4":
                break;
            default:
                break;
        }
        res.send(jsonList);
    });

    router.get('/:game/create-game', (req, res) => {

        const gameName = req.params.game;
        let validName = null;
        switch (gameName) {
            case "parachess":
                let i = 1;
                while (Object.keys(games).includes('ParaChess-' + i)) {
                    i++;
                }
                validName = 'ParaChess-' + i;
                break;
            case "disconnect4":
                validName = "DisConnect4-0";
            default:
                break;
        }
        res.send({name: validName});
    });

    return router;
}