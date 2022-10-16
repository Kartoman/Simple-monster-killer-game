const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 15;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STORNG_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


const enteredValue = prompt('Maxmum life for you and the monster.', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100;
}

let currentMonsterHelth = chosenMaxLife;
let currentPlayerHelth = chosenMaxLife;
let hasBounsLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(e, value, monsterHealth, PlayerHealth) {
    let logEntry = {
        event: e,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: PlayerHealth
    };
    switch (e) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
    } //one option

    // if (e === LOG_EVENT_PLAYER_ATTACK) {
    //     logEntry.target = 'MONSTER';
    // } else if (e === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry.target = 'MONSTER';
    // } else if (e === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry.target = 'PLAYER';
    // } // second option
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHelth = chosenMaxLife;
    currentPlayerHelth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHelth = currentPlayerHelth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHelth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHelth,
        currentPlayerHelth
    );

    if (currentPlayerHelth <= 0 && hasBounsLife) {
        hasBounsLife = false;
        removeBonusLife();
        currentPlayerHelth = initialPlayerHelth;
        setPlayerHealth(initialPlayerHelth);
        alert('Bouns life saved you!');
    }

    if (currentMonsterHelth <= 0 && currentPlayerHelth > 0) {
        alert('You won!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHelth,
            currentPlayerHelth
        );
    } else if (currentPlayerHelth <= 0 && currentMonsterHelth > 0) {
        alert('You lost!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHelth,
            currentPlayerHelth
        );
    } else if (currentPlayerHelth <= 0 && currentMonsterHelth <= 0) {
        alert('You have a draw!')
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHelth,
            currentPlayerHelth
        );
    }

    if (currentMonsterHelth <= 0 || currentPlayerHelth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent =
        mode === MODE_ATTACK ?
        LOG_EVENT_PLAYER_ATTACK :
        LOG_EVENT_PLAYER_STRONG_ATTACK; // one option
    // if (mode === MODE_ATTACK) {
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // } else if (mode === MODE_STRONG_ATTACK) {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // } // second option
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHelth -= damage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHelth,
        currentPlayerHelth
    );
    endRound();
}


function attackHandler() {
    attackMonster('ATTACK');
}

function strongAttacHandler() {
    attackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHelth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal to more than your max health.")
        healValue = chosenMaxLife - currentPlayerHelth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHelth += HEAL_VALUE;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHelth,
        currentPlayerHelth
    );
    endRound();
}

function printLogHandler() {
    for (const logEntry of battleLog) {
        console.log(logEntry);
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttacHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler)