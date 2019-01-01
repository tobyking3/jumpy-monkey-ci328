(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let game;
let platformY = 75;
let enemySound;
let hasSpikes = false;

preload = (inputGame) => {
    game = inputGame;

    game.load.audio('bananaCollection', 'assets/sounds/collectbanana.wav');
    game.load.audio('rocketCollection', 'assets/sounds/collectrocket.wav');
    game.load.audio('hunterlaugh', 'assets/sounds/hunterlaugh.wav');
    game.load.audio('throwbanana', 'assets/sounds/throwbanana.wav');
    //Platforms
    game.load.image('grass', 'assets/platforms/grass.png');
    game.load.image('plank', 'assets/platforms/plank.png');
    game.load.image('vine',  'assets/platforms/vine.png');
    game.load.image('rock',  'assets/platforms/rock.png');
    game.load.image('branch','assets/platforms/branch.png');
    //Collectibles
    game.load.image('banana', 'assets/collectibles/banana.png');
    game.load.image('rocket', 'assets/collectibles/rocket.png');
    game.load.image('trampoline', 'assets/collectibles/trampoline.png');
    //Enemies
    game.load.image('enemy1', 'assets/enemies/enemy1.png');
    game.load.image('enemy2', 'assets/enemies/enemy2.png');
    game.load.image('enemy3', 'assets/enemies/enemy3.png');
    game.load.image('spikesleft', 'assets/enemies/spikesleft.png');
    game.load.image('spikesright', 'assets/enemies/spikesright.png');
    game.load.image('trap', 'assets/enemies/trap.png');
}

restartEntities = () => platformY = 75;

createGroups = () => {
    platforms           = game.add.physicsGroup();
    collapsingPlatforms = game.add.physicsGroup();
    bananas             = game.add.physicsGroup();
    rockets             = game.add.physicsGroup();
    enemies             = game.add.physicsGroup();
    spikes              = game.add.physicsGroup();
    trampolines         = game.add.physicsGroup();
    traps               = game.add.physicsGroup();

    platforms.setAll('body.collideWorldBounds', true);
    collapsingPlatforms.setAll('body.collideWorldBounds', true);
    bananas.setAll('body.collideWorldBounds', true);
    rockets.setAll('body.collideWorldBounds', true);
    trampolines.setAll('body.collideWorldBounds', true);
    enemies.setAll('body.collideWorldBounds', true);
}

createSounds = () => enemySound = game.add.audio('hunterlaugh');

createPlatforms = () => {
    for( let i = 0; i < 8; i++ ) {
        let initialY = 75 * (1 + i);
        let initialX;
        if(i === 7){
            //the lowest initial platform is created in the center
            initialX = 180;
        }else{
            //the following platforms are randomly positioned
            initialX = game.rnd.between(0, game.width - 60);
        }
        createPlatform('grass',null,initialY, initialX);
    }
}

createPlatform = (type, platformVelocity, yPos, xPos) => {
    platform = platforms.getFirstDead(true, xPos, yPos, type);
    platform.scale.setTo(0.2,0.2);
    platform.body.allowGravity = false;
    platform.body.immovable = true;
    platform.body.bounce.set(1);
    platform.body.collideWorldBounds = true;
    platform.body.checkCollision.left = false;
    platform.body.checkCollision.right = false;

    if (platformVelocity){
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        platform.body.velocity.x = platformVelocity * plusOrMinus; // https://stackoverflow.com/questions/8611830/javascript-random-positive-or-negative-number
    }
}

createCollapsingPlatform = (yPos) => {
    collapsingPlatform = collapsingPlatforms.create(game.rnd.between(0, game.width - 60), yPos - game.rnd.between(20, 60), 'branch');
    collapsingPlatform.body.allowGravity = false;
    collapsingPlatform.body.immovable = false;
    collapsingPlatform.body.bounce.set(1);
    collapsingPlatform.body.checkWorldBounds = true;
    collapsingPlatform.body.outOfBoundsKill = true;
    collapsingPlatform.scale.setTo(0.2,0.2);
}

createBanana = (yPos, xPos) => {
    let banana = bananas.create(xPos + game.rnd.between(0, 40), yPos - 20, 'banana');
}

createRocket = (yPos, xPos) => {
    let rocket = rockets.create(xPos + game.rnd.between(0, 40), yPos - 50, 'rocket');
}

createTrampoline = (yPos, xPos) => {
    let trampoline = trampolines.create(xPos + game.rnd.between(0, 40), yPos - 50, 'trampoline');
}

createTrap = (yPos, xPos) => {
    let trap = traps.create(xPos + game.rnd.between(0, 40), yPos - 50, 'trap');
}

createEnemy = (yPos, xPos, hasSheild) => {
    let enemyNumber = game.rnd.between(1, 3);
    if(!hasSheild) enemySound.play();
    enemy = enemies.create(xPos + game.rnd.between(0, 40), yPos - 100, 'enemy' + enemyNumber);
    enemy.scale.setTo(0.2,0.2);
    enemy.body.checkWorldBounds = true;
    enemy.body.outOfBoundsKill = true;
}

factory = (cameraYMin, score, hasSheild) => {
    platforms.forEachAlive(function(platform) {
        if(platform.y - cameraYMin > 600){
            platform.destroy();
            let y = platformY -= 75;
            let x = game.rnd.between(0, game.width - 60);
            let random = game.rnd.between(0, 500);

            if(score < 5000){
                createPlatform('grass', null, y, x);
            }
            else if(score >= 5000 && score < 15000){
                if(game.rnd.between(0, 2) !== 0){
                    createPlatform('grass', null, y, x);
                } else {
                    createPlatform('plank', 70, y, x);
                }
            }
            else if(score >= 15000 && score < 25000){
                createPlatform('plank', 70, y, x);
            }
            else if(score >= 25000 && score < 35000){
                if(game.rnd.between(0, 2) !== 0){
                    createPlatform('plank', 70, y, x);
                } else {
                    createPlatform('rock', 120, y, x);
                }
            }
            else if(score >= 35000 && score < 45000){
                if(game.rnd.between(0, 4) !== 0){
                    createPlatform('rock', 120, y, x);
                } else {
                    createPlatform('grass', null, y, x);
                }
            }
            else if(score >= 45000 && score < 55000){
                createPlatform('rock', 120, y, x);
            }
            else if(score >= 55000 && score < 65000){
                if(game.rnd.between(0, 2) !== 0){
                    createPlatform('rock', 120, y, x);
                } else {
                    createPlatform('vine', 150, y, x);
                }
            }
            else if(score >= 65000 && score < 75000){
                if(game.rnd.between(0, 4) !== 0){
                    createPlatform('vine', 150, y, x);
                } else {
                    createPlatform('grass', null, y, x);
                }
            }
            else if(score >= 75000 && score < 85000){
                createPlatform('vine', 150, y, x);
            }
            else if(score >= 85000){
                var randomTen = game.rnd.between(0, 10);
                if(randomTen < 9){
                    createPlatform('vine', 150, y, x);
                } else if (randomTen === 9) {
                    createPlatform('rock', 120, y, x);
                } else if (randomTen === 10) {
                    createPlatform('plank', 70, y, x);
                }
            }


            if(random % 2 === 0) createBanana(y, x);
            if(random % 251 === 0) createRocket(y, x);
            if(random % 91 === 0) createTrampoline(y, x);
            if(random % 33 === 0 && score > 10000) createEnemy(y, x, hasSheild);
            if(random % 53 === 0 && score > 20000) createTrap(y, x);
            if(game.rnd.between(0, 2) === 2 && score < 65000) createCollapsingPlatform(y);
            if (score >= 75000 && hasSpikes === false){
                hasSpikes = true;
                addSpikes();
            }
        }
    });
}

function addSpikes () {
    let leftSpike = spikes.create(0, 0, 'spikesleft');
    let rightSpike = spikes.create(388, 0, 'spikesright');
    spikes.setAll('fixedToCamera', true);
}

module.exports = {
    preload: preload,
    createPlatforms: createPlatforms,
    createPlatform: createPlatform,
    createGroups: createGroups,
    factory: factory,
    restartEntities: restartEntities,
    createSounds: createSounds,
};
},{}],2:[function(require,module,exports){
let Player = require("./player.js");
let Setup = require("./setup.js");
let Entities = require("./entities.js");

let score = 0;
let cameraYMin = 0;
let gameState = 'play';

const highScore = localStorage.getItem('highscore');
if(highScore  === null) localStorage.setItem('highscore', 0);

let game = new Phaser.Game(400, 600, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update 
});

function preload(){
    Player.preload(game);
    Setup.preload(game);
    Entities.preload(game);
}
function create(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 0;

    cursors = game.input.keyboard.createCursorKeys();
    //SETUP
    Setup.createSoundtrack();
    Setup.createBackground();
    //ENTITIES
    Entities.createGroups();
    Entities.createPlatforms();
    Entities.createSounds();
    //PLAYER
    Player.createMonkey();
    Player.createBullets();
    Player.createSounds();

    Setup.createUI();
    Setup.createScore();

    startBtn = game.add.button(game.world.centerX - 37.5, 465, 'play', Setup.gameStart, this);
    startBtn.fixedToCamera = true;

    restartBtn = game.add.button(game.world.centerX - 37.5, 465, 'restart', restartGame, this);
    restartBtn.fixedToCamera = true;
    restartBtn.visible = false;
    restartBtn.alpha = 0;
}
function update(){
    if(Player.isAlive()){
        Player.handleInput(cursors);
        handleCamera();
        updateScore();
        Entities.factory(cameraYMin, score, Player.hasSheild());
        //COLLISION DETECTION
        game.physics.arcade.collide(bananas, platforms);
        game.physics.arcade.collide(rockets, platforms);
        game.physics.arcade.collide(trampolines, platforms);
        game.physics.arcade.collide(traps, platforms);
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(monkey, platforms, Player.monkeyJump);
        game.physics.arcade.collide(monkey, collapsingPlatforms, Player.monkeyJump);
        game.physics.arcade.collide(monkey, trampolines, Player.monkeyBounce);
        game.physics.arcade.collide(bullets, enemies, Player.shootEnemy);
        //OVERLAP COLLECT
        game.physics.arcade.overlap(monkey, bananas, Player.collectBanana);
        game.physics.arcade.overlap(monkey, rockets, Player.collectRocket);

        if(!Player.hasSheild()){
            game.physics.arcade.collide(monkey, enemies, Player.collideEnemy);
            game.physics.arcade.collide(monkey, spikes, Player.monkeyDie);
            game.physics.arcade.collide(monkey, traps, Player.hitTrap);
        };
    };

    if(!Player.isAlive())endGame();
}

endGame = () => {
    gameState = 'gameover';
    Setup.gameOver(score, localStorage['highscore']);
    monkey.destroy();
    collapsingPlatforms.callAll('destroy');
    platforms.callAll('destroy');
    bananas.callAll('destroy');
    enemies.callAll('destroy');
    rockets.callAll('destroy');
    trampolines.callAll('destroy');
    traps.callAll('destroy');
}

restartGame = () => {
    Setup.hideItem(restartBtn);
    score = 0;
    cameraYMin = 0;
    Player.createMonkey();
    Entities.restartEntities();
    Entities.createPlatforms();
    Setup.gameRestart();
    Player.respawn();
    gameState = 'play';
}
handleCamera = () => {
    monkey.yChange = Math.max( monkey.yChange, Math.abs( monkey.y - monkey.yOrig ) );
    game.world.setBounds(0, -monkey.yChange, game.width, game.height + monkey.yChange);
    cameraYMin = Math.min( cameraYMin, monkey.y - game.height + 250 );
    game.camera.y = cameraYMin;
}
updateScore = () => {
    scoreText.text = 'Score: ' + score;
    score = Math.round(-game.camera.y);
}
},{"./entities.js":1,"./player.js":3,"./setup.js":4}],3:[function(require,module,exports){
let game;
let bulletTime = 0;
let monkeySheild = false;
let isMonkeyAlive = true;
let fallSoundPlayed = false;

let fallSound;
let jumpSound;
let bounceSound;
let ouchSound
let throwBanana;
let bananaSound;
let rocketSound;
let killSound;

preload = (inputGame) => {
    game = inputGame;
    game.load.audio('jump', ['assets/sounds/jump.mp3', 'assets/sounds/jump.ogg']);
    game.load.audio('bounce', 'assets/sounds/boing.wav');
    game.load.audio('ouch', 'assets/sounds/ouch.wav');
    game.load.audio('fall', 'assets/sounds/falling.wav');
    game.load.audio('kill', 'assets/sounds/kill.wav');
    game.load.atlas('monkey', 'assets/sprites/monkey.png', 'assets/sprites/monkey.json');

};

isAlive = () => isMonkeyAlive;

respawn = () => isMonkeyAlive = true;

hasSheild = () => monkeySheild;

createMonkey = () => {
    fallSoundPlayed = false;

    monkey = game.add.sprite(175, game.height - 200, 'monkey');
    game.physics.arcade.enable(monkey);
    monkey.scale.setTo(0.4);
    monkey.anchor.setTo(0);
    monkey.animations.add('rocket',[20,21,22,23,24,25,26,27,28,29],59,true);
    monkey.animations.add('fall',[0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,10,10,10,10],59,false);
    monkey.body.checkCollision.up = false;
    monkey.body.checkCollision.left = false;
    monkey.body.checkCollision.right = false;
    monkey.yOrig = monkey.y;
    monkey.yChange = 0;
};

createSounds = () => {
    fallSound   = game.sound.add('fall');
    jumpSound   = game.sound.add('jump', 0.2);
    bounceSound = game.sound.add('bounce');
    ouchSound   = game.sound.add('ouch');
    throwBanana = game.sound.add('throwbanana');
    bananaSound = game.sound.add('bananaCollection');
    rocketSound = game.sound.add('rocketCollection', 0.8);
    killSound   = game.sound.add('kill');
}

createBullets = () => {
    bullets = game.add.physicsGroup();
    bullets.createMultiple(30, 'banana');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
};

handleInput = (cursors) => {
    monkey.body.velocity.x = 0;
    game.world.wrap( monkey, 10, false );

    if((cursors.right.isDown && !cursors.left.isDown) || (game.input.pointer1.isDown && game.input.pointer1.x > game.world.centerX)){
        monkey.body.velocity.x = 350;
    };
    if((cursors.left.isDown && !cursors.right.isDown) || (game.input.pointer1.isDown && game.input.pointer1.x < game.world.centerX)){
        monkey.body.velocity.x = -350;
    };

    if(cursors.up.isDown || game.input.pointer2.isDown){fireBullet()};
    monkey.yChange = Math.max( monkey.yChange, Math.abs( monkey.y - monkey.yOrig ) );

    if(monkey.y - game.camera.y > game.height && !fallSoundPlayed){
        fallSoundPlayed = true;
        isMonkeyAlive = false;
        fallSound.play();
    };
};

monkeyJump = (monkey, platforms) => {
    if(monkey.body.touching.down && monkey.body.velocity.y >= 0){
        jumpSound.play();
        monkey.animations.play('fall');
        monkey.body.velocity.y = -600;
        monkeySheild = false;
    }
}

monkeyBounce = (monkey, platforms) => {
    if(monkey.body.touching.down && monkey.body.velocity.y >= 0){
        bounceSound.play();
        monkey.animations.play('fall');
        monkey.body.velocity.y = -1000;
        monkeySheild = false;
    }
}

collideEnemy = (monkey, enemy) => {
    var monkeyTop = monkey.y + 10;
    var monkeyBottom = monkey.y + monkey.height;
    var enemyTop = enemy.y + 2;
    var enemyBottom = enemy.y + enemy.height;

    var monkeyLeft = monkey.x + 25;
    var monkeyRight = monkeyLeft + monkey.width;
    var enemyRight = enemy.x + enemy.width;
    var enemyLeft = enemy.x;

    if(monkeyBottom < enemyTop){
        killSound.play();
        enemy.kill();
        monkey.body.velocity.y = -700;
    } else if (monkeyLeft < enemyRight && monkeyRight > enemyLeft && monkeyTop < enemyBottom){
        monkeyDie();
    }
}

hitTrap = (monkey, trap) => {
    var monkeyBottom = monkey.y + monkey.height;
    var trapTop = trap.y + 2;
    if(monkeyBottom < trapTop){
        monkeyDie();
    }
}

monkeyDie = () => {
    ouchSound.play();
    isMonkeyAlive = false;
}

fireBullet = () => {
    if(game.time.now > bulletTime){
        bullet = bullets.getFirstExists(false);
        if(bullet){
            throwBanana.play();
            bullet.reset(monkey.x + (monkey.width / 2),monkey.y);
            bullet.body.velocity.y = -900;
            bullet.body.velocity.x = 0;
            if(cursors.right.isDown){bullet.body.velocity.x = 400;}
            if(cursors.left.isDown){bullet.body.velocity.x = -400;}
            bullet.angle += 35;
            bulletTime = game.time.now + 200;
        }
    }
}

collectBanana = (monkey, banana) => {
    bananaSound.play();
    banana.kill();
}

collectRocket = (monkey, rocket) => {
    if(!monkeySheild){
        rocketSound.play();
        rocket.kill();
        monkey.body.velocity.y = -3000
        monkey.animations.play('rocket');
        monkeySheild = true;
    }
}

shootEnemy = (bullets, enemy) => {
    killSound.play();
    enemy.kill();
}

module.exports = {
    preload: preload,
    createMonkey: createMonkey,
    handleInput: handleInput,
    createBullets: createBullets,
    monkeyJump: monkeyJump,
    monkeyBounce: monkeyBounce,
    collectBanana: collectBanana,
    collectRocket: collectRocket,
    shootEnemy: shootEnemy,
    hasSheild: hasSheild,
    collideEnemy: collideEnemy,
    isAlive: isAlive,
    respawn: respawn,
    createSounds: createSounds,
    monkeyDie: monkeyDie,
    hitTrap: hitTrap,
};
},{}],4:[function(require,module,exports){
let game;
let gameState = 'play';

preload = (inputGame) => {
    game = inputGame;
    game.load.audio('bongos', 'assets/sounds/bongos.wav');
    game.load.image('jungle', 'assets/scenery/background.png');
    game.load.image('jungleDark', 'assets/scenery/backgroundDark.png');
    game.load.image('table', 'assets/scenery/table.png');
    game.load.image('leaderboard', 'assets/scenery/leaderboard.png');
    game.load.image('music_on', 'assets/scenery/music_on.png');
    game.load.image('music_off', 'assets/scenery/music_off.png');
    game.load.image('restart', 'assets/scenery/restart.png');
    game.load.image('play', 'assets/scenery/play.png');
    game.load.image('startScreen', 'assets/scenery/startScreen.png');

}

gameStart = () => {
    game.physics.arcade.gravity.y = 1000;
    hideItem(startScreen);
    hideItem(startBtn);
    hideItem(instructionsText);
    showItem(scoreText, true);
}

gameOver = (finalScore, highScore) => {
    if(gameState === 'play'){
        gameState = 'gameover';
        gameOverMessage = 'Try again!';

        if(localStorage['highscore'] < finalScore){
            localStorage['highscore'] = finalScore;
            gameOverMessage = 'NEW HIGH SCORE!';
            highScoreText.text = finalScore;
        } else {
            highScoreText.text = highScore;
        }

        finalScoreText.text = finalScore;
        completionText.text = gameOverMessage;
        restartBtn.visible = true;

        showItem(background, true);
        showItem(gameOverText, true);
        showItem(leaderboard, true);
        showItem(labelHighScoreText, true);
        showItem(labelFinalScoreText, true);
        showItem(finalScoreText, true);
        showItem(restartBtn, true);
        showItem(highScoreText, true);
        showItem(completionText, true);
        hideItem(scoreText, true);
    }
}

gameRestart = () => {
    if(gameState === 'gameover'){
        gameState = 'play';
        restartBtn.visible = false;
        hideItem(background);
        hideItem(gameOverText);
        hideItem(leaderboard);
        hideItem(labelHighScoreText);
        hideItem(labelFinalScoreText);
        hideItem(finalScoreText);
        hideItem(restartBtn);
        hideItem(highScoreText);
        hideItem(completionText);
        showItem(scoreText, true);
    }
}

createSoundtrack = () => {
    var bongos = game.add.audio('bongos',1,true);
    bongos.play();
}

soundMute = () => {
    if (!game.sound.mute) {
        game.sound.mute = true;
        showItem(soundOn);
        hideItem(soundOff);
    } else {
        game.sound.mute = false;
        showItem(soundOff);
        hideItem(soundOn);
    }
}

createUI = () => {

    let gameStartUI = game.add.group();
    let gameOverUI = game.add.group();

    // GAME START

    startScreen = game.add.sprite(0, 0, 'startScreen');
    startScreen.fixedToCamera = true;
    gameStartUI.add(startScreen);

    instructionsText = game.add.text(0,0,'', { fontSize: '12px', fill: '#ffffff', boundsAlignH: "center", boundsAlignV: "middle"}, gameStartUI);
    instructionsText.text = 'Use the arrow keys to move and shoot.';
    instructionsText.fixedToCamera = true;
    instructionsText.setTextBounds(0, 180, 400, 100);

    // GAME OVER

    background = game.add.tileSprite(0, 0, game.width, game.height, 'jungleDark');
    gameOverUI.add(background);

    leaderboard = game.add.sprite(0, 0, 'leaderboard');
    gameOverUI.add(leaderboard);

    gameOverText = game.add.text(65,85,'', { fontSize: '40px', fill: '#ffffff' }, gameOverUI);
    gameOverText.text = 'GAME OVER'

    completionText = game.add.text(65,150,'', { fontSize: '30px', fill: '#ffffff' }, gameOverUI);

    labelHighScoreText = game.add.text(65,350,'', { fontSize: '16px', fill: '#ffffff' }, gameOverUI);
    labelHighScoreText.text = 'High Score:'

    highScoreText = game.add.text(0,0,'', { fontSize: '30px', fill: '#ffffff', boundsAlignH: "center", boundsAlignV: "middle" }, gameOverUI);
    highScoreText.setTextBounds(0, 350, 400, 100);
    highScoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    labelFinalScoreText = game.add.text(65,220,'', { fontSize: '16px', fill: '#000000' }, gameOverUI);
    labelFinalScoreText.text = 'Score:'

    finalScoreText = game.add.text(0,0,'', { fontSize: '30px', fill: '#000000', boundsAlignH: "center", boundsAlignV: "middle"}, gameOverUI);
    finalScoreText.setTextBounds(0, 225, 400, 100);

    gameOverUI.setAll('fixedToCamera', true);
    gameOverUI.setAll('alpha', false);

    // MUTE

    soundOn = game.add.button(game.width - 60, 16, 'music_on', soundMute, this);
    soundOff = game.add.button(game.width - 60, 16, 'music_off', soundMute, this);
    soundOn.fixedToCamera = true;
    soundOff.fixedToCamera = true;
    soundOn.visible = false;
}

createBackground = () => {
    background = game.add.tileSprite(0, 0, game.width, game.height, 'jungle');
    background.fixedToCamera = true;
}
createScore = () => {
    scoreText = game.add.text(16,16,'', { fontSize: '32px', fill: '#ffffff' });
    scoreText.fixedToCamera = true;
    scoreText.alpha = false;
}

showItem = (item, fade = false) => {
    item.visible = true;
    if(fade){
        game.add.tween(item).to({ alpha: 1 }, 200, "Linear", true);
    }
}

hideItem = (item, fade = false) => {
    item.visible = false;
    if(fade){
        game.add.tween(item).to({ alpha: 0 }, 200, "Linear", true);
    }
}

module.exports = {
    preload: preload,
    createSoundtrack: createSoundtrack,
    createBackground: createBackground,
    createScore: createScore,
    gameStart: gameStart,
    gameOver: gameOver,
    gameRestart: gameRestart,
    createUI: createUI,
    hideItem: hideItem,
    showItem: showItem,
};
},{}]},{},[2]);
