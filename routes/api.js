import express, { Router } from "express"
import path from 'path';
import { parachessGames } from '../namespaces/parachess.js';
import { disconnect4Games } from '../namespaces/disconnect4.js';
import { Chess } from '../games/parachess/chess.js';
import { deflate } from "zlib";

const CHESS_MAX_HOURS = 2;
const CONNECT4_MAX_HOURS = .25;
const router = Router();

export default function() {

    router.get('/games', (req, res) => {
        res.send(["parachess", "disconnect4"]);
    });

    router.get('/:game/games', (req, res) => {
        const gameName  = req.params.game;
        const jsonList = [];
        const toDelete = [];
        switch (gameName) {
            case "parachess":
                toDelete.splice(0, toDelete.length);
                Object.keys(parachessGames).forEach(id => {
                    if (Date.now() - parachessGames[id].lastMoveTime > CHESS_MAX_HOURS * 3600000) // 2h / move
                        toDelete.push(id);
                });
                toDelete.forEach(id => delete parachessGames[id]);
                Object.keys(parachessGames).forEach(game => {
                    jsonList.push({
                        name: game,
                        playable: parachessGames[game].isPlayable()
                    });
                });
                break;
            case "disconnect4":
                toDelete.splice(0, toDelete.length);
                Object.keys(disconnect4Games).forEach(id => {
                    if (Date.now() - disconnect4Games[id].lastMoveTime > CONNECT4_MAX_HOURS * 3600000) // 15min / move
                        toDelete.push(id);
                });
                toDelete.forEach(id => delete disconnect4Games[id]);
                Object.keys(disconnect4Games).forEach(game => {
                    jsonList.push({
                        name: game,
                        playable: disconnect4Games[game].isPlayable()
                    });
                });
                break;
            default:
                jsonList["error"] = "Unknown game !";
                break;
        }
        res.send(jsonList);
    });

    router.get('/:game/create-game', (req, res) => {

        const gameName = req.params.game;
        let validName = null;
        let i = 1;
        switch (gameName) {
            case "parachess":
                i = 1;
                while (Object.keys(parachessGames).includes('ParaChess-' + i)) {
                    i++;
                }
                validName = 'ParaChess-' + i;
                break;
            case "disconnect4":
                i = 1;
                while (Object.keys(disconnect4Games).includes('DisConnect4-' + i)) {
                    i++;
                }
                validName = 'DisConnect4-' + i;
                break;
            default:
                validName = "Error :  unknown game !";
                break;
        }
        res.send({name: validName});
    });

    return router;
}