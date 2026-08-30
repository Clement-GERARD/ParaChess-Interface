import dgram from 'dgram';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const vosk = require('vosk');

const server = dgram.createSocket('udp4');

const PORT = 5001;
const HOST = '127.0.0.1';
const MODEL_PATH = "model-fr";
const SAMPLE_RATE = 16000;

if(!fs.existsSync(MODEL_PATH)) {
    console.error(`Erreur : Le dossier '${MODEL_PATH}' est introuvable.`);
    process.exit(1);
}

const alphabetHomophones = {
    "a": ["a", "à", "ah", "ha"],
    "b": ["b", "baie"],
    "c": ["c", "c'est", "ces", "ses", "s'est", "sais", "sait"],
    "d": ["d", "des", "dès"],
    "e": ["e", "eu", "eux"],
    "f": ["f"],
    "g": ["g", "j'ai", "jet"],
    "h": ["h", "hache"]
};

const chiffresHomophones = {
    "1": ["un", "hein", "une"],
    "2": ["deux", "de"],
    "3": ["trois"],
    "4": ["quatre"],
    "5": ["cinq"],
    "6": ["six", "si", "scie"],
    "7": ["sept", "cet", "cette", "set"],
    "8": ["huit", "oui"]
};

const puissance4Homophones = {
    "colonne" : ["colonnes", "colonne", 'cologne']
};

const vocMenu = ["menu", "retour", "quitter", "revenir", "accueil",
    "crédits", "qui", "sommes", "nous", "règle", "règles", "aide", "mentions", "légales",
    "échecs", "puissance", "coordonnées", "caméra",
    "activer", "désactiver", "créer", "automatiquement", "partie"];
const vocPuissance4 = ["colonne"];
const pieces = ["tour", "cavalier", "fou", "dame", "pion", "roi"];
const ordre = ["abandonner", "recommencer", "rejouer", "non", "annuler"];
const ignore = ["échec", "mat", "petit roque", "grand roque", "échec et mat", "roque", "petit", "grand", "pat"];

const normalizeSpeechToken = (token = '') => token
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\'’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const aliasMap = new Map();
const registerAlias = (alias, value) => {
    const key = normalizeSpeechToken(alias);
    if (!key) return;
    aliasMap.set(key, value);
};

Object.entries(alphabetHomophones).forEach(([letter, syns]) => syns.forEach(s => registerAlias(s, letter)));
Object.entries(chiffresHomophones).forEach(([digit, syns]) => syns.forEach(s => registerAlias(s, digit)));
Object.entries(puissance4Homophones).forEach(([word, syns]) => syns.forEach(s => registerAlias(s, word)));

const grammarChess = [...pieces, ...ordre, ...ignore, ...vocMenu];

Object.values(alphabetHomophones).forEach(letterSyns => {
    Object.values(chiffresHomophones).forEach(digitSyns => {
        letterSyns.forEach(ls => {
            digitSyns.forEach(ds => {
                grammarChess.push(`${ls} ${ds}`);
            });
        });
    });
});

Object.values(alphabetHomophones).forEach(syns => grammarChess.push(...syns));
Object.values(chiffresHomophones).forEach(syns => grammarChess.push(...syns));

const grammarPuissance4 = [...ordre, ...vocMenu, ...vocPuissance4];
const chiffresPuissance4 = ["1", "2", "3", "4", "5", "6", "7"];

puissance4Homophones["colonne"].forEach(colSyn => {
    chiffresPuissance4.forEach(chiffreKey => {
        chiffresHomophones[chiffreKey].forEach(digitSyn => {
            grammarPuissance4.push(`${colSyn} ${digitSyn}`);
        });
    });
});

Object.values(chiffresHomophones).forEach(syns => grammarPuissance4.push(...syns));
Object.values(puissance4Homophones).forEach(syns => grammarPuissance4.push(...syns));

export { grammarChess, grammarPuissance4 };

console.log("[✱] Chargement du modèle Vosk");

vosk.setLogLevel(-1)
const model = new vosk.Model(MODEL_PATH);
export const recChess = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE, grammar: grammarChess });
export const recPuissance4 = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE, grammar: grammarPuissance4 });

console.log("[✱] Modèle Vosk chargé");

export function normalizeSpeech(text) {
    if (typeof text !== 'string') return '';
    const normalized = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\'’]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

    if (!normalized) return '';
    return normalized
        .split(/\s+/)
        .map(token => aliasMap.get(token) ?? token)
        .filter(Boolean)
        .join(' ');
}

export function processAudioBuffer(recognizer, buffer) {
    if (!recognizer || typeof recognizer.acceptWaveform !== 'function') {
        return null;
    }

    let waveform;
    if (buffer instanceof Uint8Array) {
        waveform = buffer;
    } else if (ArrayBuffer.isView(buffer)) {
        waveform = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else if (Buffer.isBuffer(buffer)) {
        waveform = new Uint8Array(buffer);
    } else {
        waveform = new Uint8Array(Buffer.from(buffer));
    }

    if (!recognizer.acceptWaveform(waveform)) {
        return null;
    }

    const result = recognizer.result();
    if (!result?.text) {
        return null;
    }

    return normalizeSpeech(result.text);
}

export function startListening(callback, recognizer = recChess) {
    server.on('error', err => {
        console.log(`[X] Erreur lors de l'écoute :\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        const audioPayload = msg.slice(12);
        const cleanedText = processAudioBuffer(recognizer, audioPayload);
        if (cleanedText === null) {
            return;
        }

        callback(cleanedText, rinfo.address);
    });

    server.on('listening', () => {
        const address = server.address();
        console.log(`[✱] Écoute du flux RTP sur ${address.address}:${address.port}`);
    });

    server.bind(PORT, HOST);
};

export function transform(text) {
    return normalizeSpeech(text);
}

export function detectMenuCommand(text) {
    const words = normalizeSpeech(text).split(/\s+/).filter(Boolean);

    if (words.includes('credits')) return 'credits';
    if (words.includes('mentions') || words.includes('legales')) return 'legal';
    if (words.includes('qui')) return 'about';
    if (words.includes('echec') || words.includes('echecs')) return 'parachess';
    if (words.includes('puissance')) return 'disconnect4';
    if (words.includes('camera')) {
        if (words.includes('desactiver')) return 'visage-off';
        if (words.includes('activer')) return 'visage-on';
    }
    if (words.includes('coordonnees')) {
        if (words.includes('desactiver')) return 'coordonnees-off';
        if (words.includes('activer')) return 'coordonnees-on';
    }
    if (words.includes('creer') && (words.includes('automatiquement') || words.includes('partie'))) return 'creer-partie';
    if (words.includes('aide')) return 'aide';
    if (words.includes('regle') || words.includes('regles')) return 'regles';
    if (words.includes('quitter')) return 'quitter';
    if (words.includes('accueil')) return 'accueil';
    if (words.includes('revenir')) return 'revenir';
    if (words.includes('retour') || words.includes('menu')) return 'retour';

    return null;
}

// startListening((text, address) => {
//     console.log(`[🎯 Résultat final] : "${text}" (depuis ${address})`);
// });