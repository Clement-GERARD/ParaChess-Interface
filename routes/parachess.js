import express, { Router } from "express"
import path from 'path';

const router = Router();

export default function() {
    router.get('/play', (_, res) => res.sendFile(path.join(process.cwd(), '/interface/parachess/play/play.html')));
    router.use('/play', express.static(path.join(process.cwd(), '/interface/parachess/play')));
    router.get('/watch', (req, res) => res.sendFile(path.join(process.cwd(), '/interface/parachess/watch/watch.html')));
    router.use('/watch', express.static(path.join(process.cwd(), '/interface/parachess/watch')));
    return router;
}