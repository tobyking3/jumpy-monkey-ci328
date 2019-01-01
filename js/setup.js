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