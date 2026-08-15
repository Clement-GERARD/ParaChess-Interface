// source pour règles : https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/connect-four

window.connection = connection;
let socket = null;

function connection() {
    const search = new URLSearchParams(window.location.search);
    if (!search.has('g')) return;

    socket = io('/disconnect4', {
        query: {
            id: search.get('g')
        }
    });

    socket?.on('side', (status, side) => displayAttemptResult(status, side));

    socket?.on('boardStates', states => {
        positions = states;
        positionsIndex = states.length - 1;
        createBoardGrid();
        createButtonGrid();
    });

    socket?.on('legalColumns', columns => {
        legalColumns = columns;
    });

    socket?.on('state', state => {
        let announcement = [];
        displaySideColor(state.opportunity)
        if (state.gameOver) {
            if (state.redWon) {
                showState("Les rouges ont gagné par " + state.reason + " .");
                announcement.push("Alignement de 4 pions ! Les rouges gagnent.");
            } else if (state.blueWon) {
                showState("Les bleus ont gagné par " + state.reason + ".");
                announcement.push("Alignement de 4 pions ! Les bleus gagnent.");
            } else {
                showState("Égalité par " + state.reason);
                announcement.push("Match nul par " + state.reason + "!");
            }
        }
        if (announcement.length > 0) {
            console.log(announcement.join(" ")); // ! TEMP
            // TODO : announce(announcement.join(" "));
        }
    });

    socket?.emit('may-play');
}

function sendMove(column) {
    socket?.emit('move', column);
}

function resetGame() {
    socket?.emit('resetState');
}

function resign() {
    document.getElementById("confirmation-popup").classList.add("visible");
    setTimeout(() => document.querySelector('#confirmation-popup .popup-option').focus(), 100);
}

function displayAttemptResult(status, side) {
    if (status !== "ALLOWED") {
        document.getElementById('refused-popup-text').innerText = side;
        document.getElementById('refused-popup').classList.add('visible');
        setTimeout(() => document.querySelector('#refused-popup .popup-option').focus(), 100);
        return;
    }
    if (side !== '*')
        document.getElementById('undo-button').classList.add('hidden');
}

function hideAll() {
    document.getElementById('state-popup').classList.remove('visible');
    document.getElementById('refused-popup').classList.remove('visible');
    document.getElementById('confirmation-popup').classList.remove('visible');
}

function watch() {
    const search = new URLSearchParams(window.location.search);
    window.open('/watch/?g=' + search.get('g'), '_self');
}

function undo() {
    socket?.emit('undo');
}

function resign() {
    document.getElementById("confirmation-popup").classList.add("visible");
    setTimeout(() => document.querySelector('#confirmation-popup .popup-option').focus(), 100);
}

let vocalMode = true;
startRec();

function toggleVocalMode() {
    const image = document.getElementById('toggle-vocal-button-image');
    if (vocalMode) {
        vocalMode = false;
        document.getElementById("toggle-vocal-button").classList.remove("vocal-active");
        image.src = "/public/assets/mic-off.svg";
        image.alt = "🔇";
    } else {
        vocalMode = true;
        image.src = "/public/assets/mic-on.svg";
        document.getElementById("toggle-vocal-button").classList.add("vocal-active");
        image.alt = "🎙️";   
        startRec();
    }

}

async function startRec() {
    vocalMode = true;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext({ sampleRate: 16000 });
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioCtx.destination);
        processor.onaudioprocess = (e) => {
            if (!vocalMode) {
                processor.onaudioprocess = (e) => {};
                return;
            }
            const input = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) {
                const s = Math.max(-1, Math.min(1, input[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }
            socket?.emit("audio", pcm16.buffer);
        };
    } catch (e) {
        vocalMode = false;
        document.getElementById("toggle-vocal-button").classList.add("hidden");
    }
}

function validateResign(validation = false) {
    document.getElementById("confirmation-popup").classList.remove("visible");
    if (validation) socket?.emit("resign");
}

window.addEventListener('DOMContentLoaded', () => connection());