import api from './routes/api.js';
import path from 'path';
import home from './routes/home.js';
import games from './routes/games.js';
import parachess from './routes/parachess.js'
import disconnect4 from './routes/disconnect4.js'
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { recChess, transform, grammarChess, detectMenuCommand } from './voice-recognition.js';
import parachessNamespace from './namespaces/parachess.js';
import disconnect4Namespace from './namespaces/disconnect4.js';

const app = express();
app.set('trust proxy', true);
app.use('/public', express.static(path.join(process.cwd(), 'interface')));

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

const parachessNSP = parachessNamespace(io);
const disconnect4NSP = disconnect4Namespace(io);

app.use((req, res, next) => {
    const date = new Date();
    console.log("[" + date.getDate() +  "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] connexion : " + req.socket.remoteAddress + ", url : " + req.url);
    next();
});

io.on('connection', socket => {
    socket.on('alive', status => {
        socket.emit('alive_conn', 1)
    });

    socket.on('audio', buffer => {
        const audioBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
        const uint8 = new Uint8Array(audioBuffer);
        if (recChess.acceptWaveform(uint8)) {
            const result = recChess.result();
            if (result?.text) {
                const cleaned = transform(result.text, grammarChess);
                const menuCommand = detectMenuCommand(cleaned.toLowerCase());
                if (menuCommand) {
                    socket.emit('voice-command', menuCommand);
                }
            }
        }
    });
});

app.use('/api', api());
app.use('/parachess', parachess());
app.use('/disconnect4', disconnect4());
app.use('/games', games());
app.use('/about-us', (req, res) => {res.sendFile(path.join(process.cwd(), '/interface/about-us/about-us.html'));});
app.use('/legal-notice', (req, res) => {res.sendFile(path.join(process.cwd(), '/interface/legal-notice/legal-notice.html'));});
app.use('/credits', (req, res) => {res.sendFile(path.join(process.cwd(), '/interface/credits/credits.html'));});
app.use('/rules', (req, res) => {res.sendFile(path.join(process.cwd(), '/interface/rules/rules.html'));});
app.use('/help', (req, res) => {res.sendFile(path.join(process.cwd(), '/interface/help/help.html'));});
app.get('/lifecompanion', (req, res) => res.sendFile(path.join(process.cwd(), '/interface/testlifecompanion/index.html')));
app.use(home());

server.listen(port, () => {
    console.log('[✱] Démarrage du serveur sur le port', port);
});