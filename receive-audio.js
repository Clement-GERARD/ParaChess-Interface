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
    "un": ["un", "hein", "une"],
    "deux": ["deux", "de"],
    "trois": ["trois"],
    "quatre": ["quatre"],
    "cinq": ["cinq"],
    "six": ["six", "si", "scie"],
    "sept": ["sept", "cet", "cette", "set"],
    "huit": ["huit", "oui"]
};

const puissance4Homophones = {
    "colonne" : ["colonnes", "colonne", 'cologne']
};

const vocMenu = ["menu", "retour", "quitter", "revenir", "accueil", "principal", "crédits", "qui", "sommes", "nous","règle"];
const vocPuissance4 = ["colonne"];
const pieces = ["tour", "cavalier", "fou", "dame", "pion", "roi"];
const ordre = ["abandon", "réinitialiser", "non", "annuler"];
const ignore = ["échec", "mat", "petit roque", "grand roque", "échec et mat", "roque", "petit", "grand", "pat"];

const reverseMap = {};
Object.entries(alphabetHomophones).forEach(([letter, syns]) => syns.forEach(s => reverseMap[s] = letter));
Object.entries(chiffresHomophones).forEach(([digit, syns]) => syns.forEach(s => reverseMap[s] = digit));
Object.entries(puissance4Homophones).forEach(([word, syns]) => syns.forEach(s => reverseMap[s] = word));

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

const chiffresPuissance4 = ["un", "deux", "trois", "quatre", "cinq", "six", "sept"];
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

export function startListening(callback) {
    server.on('error', err => {
        console.log(`[X] Erreur lors de l'écoute :\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        const audioPayload = msg.slice(12);
        if (rec.acceptWaveform(audioPayload)) {
            const rawText = rec.result().text;
            const cleanedText = transform(rawText);
            // console.log(`[🎙️ Brut]    : "${rawText}"`);
            // console.log(`[⚡ Nettoyé] : "${cleanedText}"`);
            // console.log('------------------------------------');
            callback(cleanedText, rinfo.address);
        }
    });

    server.on('listening', () => {
        const address = server.address();
        console.log(`[✱] Écoute du flux RTP sur ${address.address}:${address.port}`);
    });

    server.bind(PORT, HOST);
};

const motVersChiffre = {
    "un": "1", "deux": "2", "trois": "3", "quatre": "4",
    "cinq": "5", "six": "6", "sept": "7", "huit": "8"
};

export function transform(text, grammar) {
    return text
        .split(" ")
        .map(w => reverseMap[w] || w)
        .map(w => motVersChiffre[w] || w)
        .filter(w => grammar.includes(w) || /^[1-7]$/.test(w))
        .join(" ");
}

// startListening((text, address) => {
//     console.log(`[🎯 Résultat final] : "${text}" (depuis ${address})`);
// });