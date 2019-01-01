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