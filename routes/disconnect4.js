import express, { Router } from "express"
import path from 'path';
import { games } from '../namespaces/game.js';

const router = Router();

export default function() {
    router.get('/play', (_, res) => res.sendFile(path.join(process.cwd(), '/interface/disconnect4/play/connect.html')));
    router.use('/play', express.static(path.join(process.cwd(), '/interface/disconnect4/play/')));
    router.get('/watch', (_, res) => res.sendFile(path.join(process.cwd(), '/interface/disconnect4/watch/connect.html')));
    router.use('/watch', express.static(path.join(process.cwd(), '/interface/disconnect4/watch/')));


    return router;
}