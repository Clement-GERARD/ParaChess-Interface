import api from './routes/api.js';
import path from 'path';
import home from './routes/home.js';
import games from './routes/games.js';
import parachess from './routes/parachess.js'
import disconnect4 from './routes/disconnect4.js'
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { recChess, processAudioBuffer, detectMenuCommand, validateVoiceEnvironment } from './voice-recognition.js';
import parachessNamespace from './namespaces/parachess.js';
import disconnect4Namespace from './namespaces/disconnect4.js';

const app = express();
app.set('trust proxy', true);

try {
    validateVoiceEnvironment();
} catch (error) {
    console.error(`[Startup] Validation de l'environnement impossible : ${error.message}`);
    process.exitCode = 1;
}

app.use('/public', express.static(path.join(process.cwd(), 'interface')));

const server = http.createServer(app);
const io = new Server(server);
const port = Number(process.env.PORT || 5000);

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
        const cleaned = processAudioBuffer(recChess, buffer);
        if (!cleaned) {
            return;
        }

        const menuCommand = detectMenuCommand(cleaned);
        if (menuCommand) {
            socket.emit('voice-command', menuCommand);
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

server.on('error', error => {
    if (error && error.code === 'EADDRINUSE') {
        console.error(`[Startup] Le port ${port} est déjà utilisé. Fermez l'instance précédente ou changez la variable PORT.`);
    } else {
        console.error(`[Startup] Impossible de démarrer le serveur : ${error.message || error}`);
    }
    process.exitCode = 1;
});

server.listen(port, () => {
    console.log('[✱] Démarrage du serveur sur le port', port);
});