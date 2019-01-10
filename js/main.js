const Player = require("./player.js");
const Setup = require("./setup.js");
const Entities = require("./entities.js");

let score = 0;
let cameraYMin = 0;
let gameState = 'play';

const highScore = localStorage.getItem('highscore');
if(highScore  === null) localStorage.setItem('highscore', 0);

let game = new Phaser.Game(400, 600, Phaser.AUTO, 'JumpMonkeyGame', {
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
    //scale manager resizes the canvas to fill the viewport
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

    //BUTTONS
    startBtn = game.add.button(game.world.centerX - 37.5, 465, 'play', Setup.gameStart, this);
    startBtn.fixedToCamera = true;

    restartBtn = game.add.button(game.world.centerX - 37.5, 465, 'restart', restartGame, this);
    restartBtn.fixedToCamera = true;
    restartBtn.visible = false;
    restartBtn.alpha = 0;
}
function update(){

    handleCamera();

    if(Player.isAlive()){
        Player.handleInput(cursors);

        handleScore();

        Entities.factory(cameraYMin, score, Player.hasShield());
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
        //Only check for collision when the monkey does not have the shield which is set when collecting the rocket
        if(!Player.hasShield()){
            game.physics.arcade.collide(monkey, enemies, Player.collideEnemy);
            game.physics.arcade.collide(monkey, spikes, Player.monkeyDie);
            game.physics.arcade.collide(monkey, traps, Player.collideTrap);
        };
    };

    if(!Player.isAlive())endGame();
}

handleCamera = () => {
    /**************************************************
    * Title: Phaser Jump Game
    * Author: Rugile, J
    * Date: 2018
    * Code version: unknown
    * Availability: https://codepen.io/jackrugile/pen/fqHtn
    ***************************************************/

    // y offset and the height of the world are adjusted to match the highest point the monkey has reached
    monkey.yChange = Math.max( monkey.yChange, Math.abs( monkey.y - monkey.yOrig ) );
    game.world.setBounds(0, -monkey.yChange, game.width, game.height + monkey.yChange);
    // custom follow camera that won't move down
    cameraYMin = Math.min( cameraYMin, monkey.y - game.height + 250 );
    game.camera.y = cameraYMin;
}

handleScore = () => {
    scoreText.text = 'Score: ' + score;
    score = Math.round(-game.camera.y);
}

endGame = () => {
    gameState = 'gameover';
    Setup.gameOver(score, localStorage['highscore']);
    monkey.destroy();
    collapsingPlatforms.callAll('kill');
    platforms.callAll('destroy');
    bananas.callAll('kill');
    enemies.callAll('destroy');
    rockets.callAll('kill');
    trampolines.callAll('kill');
    traps.callAll('kill');
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