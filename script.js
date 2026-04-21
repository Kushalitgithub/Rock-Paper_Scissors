/* ── STATE ── */
let userScore = 0;
let compScore = 0;
let round = 1;
let isPlaying = false;

const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

const beats = {
    rock:     { loses: 'scissors', msg: 'Rock crushes Scissors!' },
    paper:    { loses: 'rock',     msg: 'Paper covers Rock!' },
    scissors: { loses: 'paper',    msg: 'Scissors cuts Paper!' }
};

/* ── ELEMENTS ── */
const playerIcon   = document.getElementById('playerIcon');
const cpuIcon      = document.getElementById('cpuIcon');
const resultMsg    = document.getElementById('resultMsg');
const userScoreEl  = document.getElementById('userScore');
const compScoreEl  = document.getElementById('compScore');
const roundEl      = document.getElementById('roundCounter');
const overlay      = document.getElementById('overlay');
const overlayIcon  = document.getElementById('overlayIcon');
const overlayRes   = document.getElementById('overlayResult');
const overlayDet   = document.getElementById('overlayDetail');
const overlayScore = document.getElementById('overlayScore');

/* ── GENERATE CPU CHOICE ── */
function getCpuChoice() {
    const options = ['rock', 'paper', 'scissors'];
    return options[Math.floor(Math.random() * 3)];
}

/* ── MAIN PLAY FUNCTION ── */
function play(userChoice) {
    if (isPlaying) return;
    isPlaying = true;

    const cpuChoice = getCpuChoice();

    /* highlight selected button */
    document.querySelectorAll('.choice-btn').forEach(b => {
        b.classList.add('disabled');
        if (b.id === userChoice + 'Btn') b.classList.add('selected');
    });

    /* reset arena */
    playerIcon.textContent = '⏳';
    cpuIcon.textContent = '⏳';
    playerIcon.className = 'arena-icon';
    cpuIcon.className = 'arena-icon';
    resultMsg.className = 'result-msg';
    resultMsg.textContent = '';

    /* animate reveal with slight delay */
    setTimeout(() => {
        playerIcon.textContent = emojis[userChoice];
        playerIcon.classList.add('reveal');

        setTimeout(() => {
            cpuIcon.textContent = emojis[cpuChoice];
            cpuIcon.classList.add('reveal');

            setTimeout(() => {
                resolveRound(userChoice, cpuChoice);
            }, 300);
        }, 300);
    }, 400);
}

/* ── RESOLVE OUTCOME ── */
function resolveRound(userChoice, cpuChoice) {
    let outcome, msgText, detail;

    if (userChoice === cpuChoice) {
        outcome = 'draw';
        msgText = "It's a Draw!";
        detail  = `Both chose ${emojis[userChoice]} ${userChoice}`;
        playerIcon.classList.add('draw-icon');
        cpuIcon.classList.add('draw-icon');
    } else if (beats[userChoice].loses === cpuChoice) {
        outcome = 'win';
        msgText = 'You Win! 🎉';
        detail  = beats[userChoice].msg;
        userScore++;
        playerIcon.classList.add('winner');
        cpuIcon.classList.add('loser');
        bumpScore(userScoreEl);
        userScoreEl.textContent = userScore;
    } else {
        outcome = 'lose';
        msgText = 'You Lose!';
        detail  = beats[cpuChoice].msg;
        compScore++;
        cpuIcon.classList.add('winner');
        playerIcon.classList.add('loser');
        bumpScore(compScoreEl);
        compScoreEl.textContent = compScore;
    }

    /* show inline result */
    resultMsg.textContent = msgText;
    resultMsg.className   = `result-msg ${outcome} show`;

    /* show overlay after short delay */
    setTimeout(() => showOverlay(outcome, detail, userChoice, cpuChoice), 900);
}

/* ── SCORE BUMP ANIMATION ── */
function bumpScore(el) {
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
}

/* ── OVERLAY ── */
function showOverlay(outcome, detail, userChoice, cpuChoice) {
    const icons   = { win: '🎉', lose: '😤', draw: '🤝' };
    const titles  = { win: 'You Win!', lose: 'You Lose!', draw: "It's a Draw!" };

    overlayIcon.textContent  = icons[outcome];
    overlayRes.textContent   = titles[outcome];
    overlayRes.className     = `overlay-result ${outcome}`;
    overlayDet.textContent   = `${emojis[userChoice]} vs ${emojis[cpuChoice]} — ${detail}`;
    overlayScore.innerHTML   = `
        <div class="overlay-score-item">
            <span class="label">You</span>
            <span class="num">${userScore}</span>
        </div>
        <div style="width:1px;background:var(--border);"></div>
        <div class="overlay-score-item">
            <span class="label">Round</span>
            <span class="num">${round}</span>
        </div>
        <div style="width:1px;background:var(--border);"></div>
        <div class="overlay-score-item">
            <span class="label">CPU</span>
            <span class="num">${compScore}</span>
        </div>
    `;

    overlay.classList.add('show');
    round++;
    roundEl.textContent = `Round ${round}`;
}

/* ── CLOSE OVERLAY ── */
function closeOverlay() {
    overlay.classList.remove('show');

    /* re-enable buttons */
    document.querySelectorAll('.choice-btn').forEach(b => {
        b.classList.remove('disabled', 'selected');
    });

    /* reset arena to waiting state */
    playerIcon.textContent = '?';
    cpuIcon.textContent    = '?';
    playerIcon.className   = 'arena-icon';
    cpuIcon.className      = 'arena-icon';
    resultMsg.className    = 'result-msg';
    resultMsg.textContent  = '';

    isPlaying = false;
}

/* ── RESET GAME ── */
function resetGame() {
    userScore = 0;
    compScore = 0;
    round     = 1;
    isPlaying = false;

    userScoreEl.textContent = '0';
    compScoreEl.textContent = '0';
    roundEl.textContent     = 'Round 1';

    playerIcon.textContent = '?';
    cpuIcon.textContent    = '?';
    playerIcon.className   = 'arena-icon';
    cpuIcon.className      = 'arena-icon';
    resultMsg.className    = 'result-msg';
    resultMsg.textContent  = '';

    overlay.classList.remove('show');
    document.querySelectorAll('.choice-btn').forEach(b => {
        b.classList.remove('disabled', 'selected');
    });
}

/* ── CLOSE OVERLAY ON BACKDROP CLICK ── */
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
});

/* ── KEYBOARD SUPPORT ── */
document.addEventListener('keydown', (e) => {
    if (isPlaying && !overlay.classList.contains('show')) return;
    if (e.key === 'r' || e.key === 'R') play('rock');
    if (e.key === 'p' || e.key === 'P') play('paper');
    if (e.key === 's' || e.key === 'S') play('scissors');
    if (e.key === 'Enter' && overlay.classList.contains('show')) closeOverlay();
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeOverlay();
});
