let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);
let playership; let GEnemy;
let starVelocity;
let stars; let star;
let rocks; let rock;
let bullet; let bullets;
let explosionAnim;
let spacebar;


function init() {
    starVelocity = 100;

}

function preload() {
    this.load.image("player", "./assets/images/ship.png");
    this.load.image("groundEnnemy","./assets/images/groundennemy.png");
    this.load.image("star", "./assets/images/star2.png");
    this.load.spritesheet("explosion", "./assets/images/explosion.png", {frameWidth: 128, frameHeight : 128});
    this.load.audio("exploSound", "./assets/audio/explosion.wav" );
    this.load.image("rock", "./assets/images/ennemy.png");
    this.load.image("bullet", "./assets/images/bullets.png")
}

function create() {

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    playership = this.physics.add.image(100,100, "player");
    GEnemy = this.add.image(400, 310, "groundEnnemy");
    
    let timerStarShoot = this.time.addEvent({
        delay : 1000, 
        callback : shootStar, 
        callbackScope : this, 
        repeat : 20
    });

    let timerRockShoot = this.time.addEvent({
        delay : 2000, 
        callback: shootRock, 
        callbackScope:this, 
        repeat: 5
    })
    
    stars = this.physics.add.group({
        defaultKey: 'star',
        maxSize: 20
    });

    rocks = this.physics.add.group({
        angularDrag: 5,
        angularVelocity: 60,
        defaultKey: "rock", 
        maxSize: 5
    })
    
    bullets = this.physics.add.group({
        defaultKey: "bullet", 
        maxSize: 100
    })
    
    explosionAnimation = this.anims.create({
        key: "explode", 
        frames: this.anims.generateFrameNumbers("explosion"), 
        frameRate : 20,
        repeat: 0,
        hideOnComplete: true
    })
    
    this.physics.add.collider(playership, stars, OnCollision, null, this);
    this.physics.add.collider(playership, rocks, OnCollision, null, this);
    this.physics.add.collider(bullets, rocks, OnCollisionBullet, null, this);
    
    exploSound = this.sound.add("exploSound");
}

function update() {
    let cursors = this.input.keyboard.createCursorKeys();
    if (cursors.down.isDown) playership.setVelocityY(100);
    if (cursors.up.isDown) playership.setVelocityY(-100);
    if (cursors.right.isDown) playership.setVelocity(100,0);
    if (cursors.left.isDown) playership.setVelocityX(-100,0);

    if (Phaser.Input.Keyboard.JustDown(spacebar) && playership.body.enable == true) shootBullet();
    
}

function shootStar () {
    star =  stars.get();
    if (star) {
        star.setPosition(GEnemy.x,GEnemy.y);
        let norme = Math.sqrt((playership.x - GEnemy.x)*(playership.x - GEnemy.x) + (playership.y - GEnemy.y)*(playership.y - GEnemy.y)); //on divise par la distance pour normaliser l'envoi du bullet mais ensuite on doit encore multiplier pour avoir la vitesse qu'on veut.
        star.setVelocity((playership.x - GEnemy.x)*starVelocity/norme, (playership.y - GEnemy.y)*starVelocity/norme);
    }
}

function shootRock () {
    rock = rocks.get()
    if (rock) {
        rock.setPosition(800, Phaser.Math.Between(20, 300));
        rock.setVelocityX(-100);
        // rock.setVelocity(Phaser.Math.Between(-10, -150), Phaser.Math.Between(-50, 50))
    }
}

function OnCollision (_player, _collider) {
    _player.body.enable = false;
    _player.setVisible(false);
    _collider.destroy();
    explosionAnim = this.add.sprite(_player.x, _player.y, "explosion")
    explosionAnim.play("explode");
    exploSound.play();
}

function OnCollisionBullet(_bullet, _rock) {
    _bullet.destroy(); 
    _rock.setVisible(false);
    _rock.body.enable = false;
    
    explosionAnim = this.add.sprite(_rock.x, _rock.y, "explosion");
    explosionAnim.play("explode");
    exploSound.play();

}

function shootBullet() {
    bullet = bullets.get(); 
    if(bullet) {
        bullet.setPosition(playership.x, playership.y);
        bullet.setVelocityX(200);
    }
}

