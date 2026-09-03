/**
 * Téléchargement, installation et validation du binaire Stockfish local.
 */

import { createWriteStream } from 'fs';
import { chmod, mkdir, readdir, rename, rm, stat, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const installDirectory = path.join(projectRoot, '.stockfish');
const binaryName = process.platform === 'win32' ? 'stockfish.exe' : 'stockfish';
const binaryPath = path.join(installDirectory, binaryName);
const releaseApiUrl = 'https://api.github.com/repos/official-stockfish/Stockfish/releases/latest';

/** Détermine le motif de binaire adapté à la plateforme. @returns {RegExp} Motif de recherche. */
function platformPattern() {
    if (process.platform === 'win32') return /windows.*(x86-64|x64).*avx2.*\.zip$/i;
    if (process.platform === 'darwin') return /macos.*(x86-64|arm64).*\.tar$/i;
    return /ubuntu.*x86-64.*avx2.*\.tar$/i;
}

/** Télécharge une archive vers un fichier local. @param {string} url URL distante. @param {string} destination Chemin local. @returns {Promise<void>} Promesse de fin d'écriture. */
async function download(url, destination) {
    const response = await fetch(url, { headers: { 'User-Agent': 'ParaChess-install-stockfish' } });
    if (!response.ok || !response.body) {
        throw new Error(`Telechargement impossible (${response.status} ${response.statusText})`);
    }
    await pipeline(response.body, createWriteStream(destination));
}

/** Recherche récursivement un binaire Stockfish. @param {string} directory Répertoire de départ. @returns {Promise<string|null>} Chemin trouvé ou null. */
async function findBinary(directory) {
    const names = await readdir(directory, { withFileTypes: true });
    for (const entry of names) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            const result = await findBinary(entryPath);
            if (result) return result;
        } else if (/stockfish.*(\.exe)?$/i.test(entry.name)) {
            return entryPath;
        }
    }
    return null;
}

/** Installe Stockfish si nécessaire. @returns {Promise<void>} Promesse de fin d'installation. @throws {Error} En cas d'échec de téléchargement ou d'installation. */
async function install() {
    if (process.env.STOCKFISH === 'NO') {
        console.log('[Stockfish] Installation ignoree (STOCKFISH=NO)');
        return;
    }

    try {
        await stat(binaryPath);
        console.log(`[Stockfish] Deja installe dans ${binaryPath}`);
        return;
    } catch {}

    if (!['win32', 'darwin', 'linux'].includes(process.platform)) {
        throw new Error(`Plateforme non prise en charge: ${process.platform}`);
    }

    const releaseResponse = await fetch(releaseApiUrl, {
        headers: { 'User-Agent': 'ParaChess-install-stockfish' }
    });
    if (!releaseResponse.ok) {
        throw new Error(`Recuperation de la release impossible (${releaseResponse.status})`);
    }
    const release = await releaseResponse.json();
    const asset = release.assets.find(item => platformPattern().test(item.name));
    if (!asset) throw new Error(`Aucun binaire Stockfish compatible avec ${os.platform()} trouve`);

    const archivePath = path.join(projectRoot, `.stockfish-${asset.name}`);
    const temporaryDirectory = path.join(projectRoot, '.stockfish-tmp');
    await mkdir(temporaryDirectory, { recursive: true });
    console.log(`[Stockfish] Telechargement de ${asset.name}`);
    await download(asset.browser_download_url, archivePath);

    if (asset.name.endsWith('.zip')) {
        await promisify(execFile)('powershell.exe', [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            '& { Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force }',
            archivePath,
            temporaryDirectory
        ]);
    } else {
        await promisify(execFile)('tar', ['-xf', archivePath, '-C', temporaryDirectory]);
    }

    const extractedBinary = await findBinary(temporaryDirectory);
    if (!extractedBinary) throw new Error('Le binaire Stockfish est absent de l archive telechargee');
    await mkdir(installDirectory, { recursive: true });
    await rename(extractedBinary, binaryPath);
    if (process.platform !== 'win32') await chmod(binaryPath, 0o755);
    await rm(temporaryDirectory, { recursive: true, force: true });
    await rm(archivePath, { force: true });
    await writeFile(path.join(installDirectory, 'manifest.json'), JSON.stringify({ binary: binaryName }));
    console.log(`[Stockfish] Installation terminee dans ${binaryPath}`);
}

install().catch(error => {
    console.error(`[Stockfish] ${error.message}`);
    process.exitCode = 1;
});
