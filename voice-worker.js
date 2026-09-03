import { parentPort } from 'worker_threads';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const vosk = require('@echogarden/vosk');

const MODEL_PATH = 'model-fr';
const SAMPLE_RATE = 16000;

vosk.setLogLevel(-1);
const model = new vosk.Model(MODEL_PATH);

import { grammarChess, grammarPuissance4, transform, detectMenuCommand } from './voice-recognition.js';

const recognizers = new Map();

function getRecognizer(socketId, mode) {
  if (!recognizers.has(socketId)) {
    recognizers.set(socketId, {});
  }
  const entry = recognizers.get(socketId);
  if (!entry[mode]) {
    const grammar = mode === 'puissance4' ? grammarPuissance4 : grammarChess;
    entry[mode] = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE, grammar });
  }
  return entry[mode];
}

parentPort.on('message', (msg) => {
  if (msg.type === 'audio') {
    const { socketId, mode, buffer } = msg;
    const rec = getRecognizer(socketId, mode || 'chess');
    const uint8 = new Uint8Array(buffer);
    if (rec.acceptWaveform(uint8)) {
      const result = rec.result();
      if (result?.text) {
        const cleaned = transform(result.text);
        const menuCommand = detectMenuCommand(cleaned.toLowerCase());
        if (menuCommand) {
          parentPort.postMessage({ type: 'voice-command', socketId, command: menuCommand });
        }
      }
    }
    return;
  }

  if (msg.type === 'disconnect') {
    // libere la memoire du/des reconnaisseurs de ce socket
    recognizers.delete(msg.socketId);
  }
});

// Signale au thread principal que le modele est charge et pret
parentPort.postMessage({ type: 'ready' });
