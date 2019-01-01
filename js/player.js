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

    if(cursors.right.isDown){monkey.body.velocity.x = 350;};
    if(cursors.left.isDown){monkey.body.velocity.x = -350;};
    if(cursors.up.isDown){fireBullet()};
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