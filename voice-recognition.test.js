import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeSpeech,
  transform,
  detectMenuCommand,
  processAudioBuffer
} from './voice-recognition.js';

test('normalizeSpeech removes accents and keeps meaningful words', () => {
  assert.equal(normalizeSpeech("  C'EST à la 4 !  "), 'c a la 4');
});

test('transform maps homophones and filters invalid words', () => {
  assert.equal(transform("c'est quatre"), 'c 4');
  assert.equal(transform("colonnes 5"), 'colonne 5');
});

test('detectMenuCommand understands normalized navigation commands', () => {
  assert.equal(detectMenuCommand('retour au menu'), 'retour');
  assert.equal(detectMenuCommand('échec et mat'), 'parachess');
});

test('processAudioBuffer reads a waveform and returns normalized text', () => {
  const recognizer = {
    acceptWaveform: (buffer) => buffer instanceof Uint8Array && buffer.length > 0,
    result: () => ({ text: "C'EST QUATRE" })
  };

  assert.equal(processAudioBuffer(recognizer, Buffer.from([1, 2, 3])), 'c 4');
});
