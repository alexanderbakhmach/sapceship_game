class BackgroundScene extends Phaser.Scene {
    constructor() {
        super("backgroundScene")
    }

    init(data){
        this.score = data.score;
    }

    preload() {
        this.backgrundImageTexture = this.load.image('background', '/static/img/background.png')
        this.greenMobImageTexture = this.load.spritesheet('green-mob', 
            '/static/img/green_spaceship.png', {
            frameWidth: 66,
            frameHeight: 66
        })
        this.grayMobImageTexture = this.load.spritesheet('gray-mob', 
            '/static/img/gray_spaceship.png', {
            frameWidth: 66,
            frameHeight: 66
        })
        this.blueMobImageTexture = this.load.spritesheet('blue-mob', 
            '/static/img/blue_spaceship.png', {
            frameWidth: 66,
            frameHeight: 66
        })
        this.explosionImageTexture = this.load.spritesheet('explosion', 
            '/static/img/explosion.png', {
            frameWidth: 66,
            frameHeight: 66
        })
        this.greenBulletImageTexture = this.load.spritesheet('green-bullet', 
            '/static/img/green_bullet.png', {
            frameWidth: 36,
            frameHeight: 36
        })
        this.playerImageTexture = this.load.spritesheet('player', 
            '/static/img/player.png', {
            frameWidth: 66,
            frameHeight: 66
        })

        this.backgroundAudio = this.load.audio('background_audio', '/static/sound/background.mp3')
        this.menuAudio = this.load.audio('menu_audio', '/static/sound/menu.mp3')
        this.explosionAudio = this.load.audio('explosion_audio', '/static/sound/explosion.mp3')
        this.greenBulletAudio = this.load.audio('green_bullet_audio', '/static/sound/green_bullet.mp3')
    }

    createStartGameButton() {
        this.startGameButton = this.add.text(config.scale.width / 2, 
            config.scale.height / 2 - 150, 'Start the game', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px' 
        });
        this.startGameButton.setOrigin(0.5);
        this.startGameButton.setInteractive();
        this.startGameButton.on('pointerdown', this.startGame, this);
        this.startGameButton.on('pointerover', this.boldText);
        this.startGameButton.on('pointerout', this.unboldText);
    }

    boldText() {
        this.setColor('#eb9f34')   
    }

    unboldText() {
        this.setColor('white')
    }

    createAndPlaySound() {
        this.backgroundSound = this.sound.add('menu_audio', {loop: true})
        this.backgroundSound.play()
    }

    createAndDrowImage() {
        this.backgroundImage = this.add.tileSprite(0, 0, config.scale.width, config.scale.height, 
            'background')
        this.backgroundImage.setOrigin(0, 0)
    }

    startGame() {
        this.backgroundSound.stop()
        this.scene.start('gameScene')
      
    }

    displayScore() {
        if (this.score != null && this.score != 'undefined') {
            this.scoreText = this.add.text(config.scale.width -100, 100, this.score + ' - SCORE', {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '16px' 
            });
            this.scoreText.setOrigin(1, 0);
        }
    }

    create() {
        this.createAndDrowImage()
        this.createAndPlaySound()
        this.createStartGameButton()
        this.displayScore()
    }
}


class GameScene extends Phaser.Scene {
    constructor() {
        super("gameScene")
    }

    preload() {
    }

    boldText() {
        this.setColor('#eb9f34')   
    }

    unboldText() {
        this.setColor('white')
    }

    createExitGameButton() {
        this.exitGameButton = this.add.text(config.scale.width -100, 
            100, 'Exit', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px' 
        });
        this.exitGameButton.setOrigin(1, 0);
        this.exitGameButton.setInteractive();
        this.exitGameButton.on('pointerdown', this.exitGame, this);
        this.exitGameButton.on('pointerover', this.boldText);
        this.exitGameButton.on('pointerout', this.unboldText);
    }

    createAndAddMob(textureName, speed = 10) {
        let x = Phaser.Math.Between(100, config.scale.width - 100)
        let y = 100
        let animationName = textureName + '-' + 'animation' 
        let mobSprite = this.physics.add.sprite(x, y, textureName)
        
        mobSprite.angle = 180
        
        let mobAnimation = this.anims.create({
            key: animationName,
            frames: this.anims.generateFrameNumbers(textureName),
            frameRate: 20,
            repeat: -1
        })
        
        mobSprite.play(animationName)
        mobSprite.setInteractive()

        let mob = {
            speed: speed,
            body: mobSprite,
            mobAnimation: mobAnimation,
            update: function() {
                if (this.body.y > config.scale.height) {
                    this.body.y = 0
                    let randomX = Phaser.Math.Between(100, config.scale.width - 100)
                    this.body.x = randomX
                }
                this.body.y += this.speed
            },
            reset: function() {
                this.body.y = 0
                let randomX = Phaser.Math.Between(100, config.scale.width - 100)
                this.body.x = randomX
            }
        }

        return mob
    }


    exitGame() {
        this.backgroundSound.stop()
        this.scene.start('backgroundScene', {score: this.score})
    }

    createAndPlaySound() {
        this.backgroundSound = this.sound.add('background_audio')
        this.backgroundSound.play()
    }

    createAndDrowImage() {
        this.backgroundImage = this.add.tileSprite(0, 0, config.scale.width, config.scale.height, 
            'background')
        this.backgroundImage.setOrigin(0, 0)
    }

    createMobs() {
        this.mobBodies = this.physics.add.group()

        let greenMob = this.createAndAddMob('green-mob', 4)
        let grayMob = this.createAndAddMob('gray-mob', 6)
        let blueMob = this.createAndAddMob('blue-mob', 9)

        this.mobBodies.add(greenMob.body)
        this.mobBodies.add(grayMob.body)
        this.mobBodies.add(blueMob.body)

        this.mobs = [greenMob, grayMob, blueMob]

        return this.mobs

    }

    createPlayer(textureName = 'player', speed = 200,){
        let x = config.scale.width / 2 - 8
        let y = config.scale.height / 2 + 300
        let animationName = textureName + '-' + 'animation' 
        let playerSprite = this.physics.add.sprite(x, y, textureName)
        let playerAnimation = this.anims.create({
            key: animationName,
            frames: this.anims.generateFrameNumbers(textureName),
            frameRate: 20,
            repeat: -1
        })
        let defaultBulletSound = this.sound.add('green_bullet_audio')
        let defaultBulletAnimation = this.anims.create({
            key: 'green-bullet-animation',
            frames: this.anims.generateFrameNumbers('green-bullet'),
            frameRate: 5,
            repeat: -1
        })
        let scene = this

        playerSprite.play(animationName)
        playerSprite.setCollideWorldBounds(true)

        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        let cursorKeys = this.input.keyboard.createCursorKeys()

        let player = {
            bulletBodies: this.physics.add.group(),
            spaceKey: spaceKey,
            cursorKeys: cursorKeys,
            bulletType: {
                sound: defaultBulletSound,
                animation: defaultBulletAnimation,
                speed: 200,
                create: function() {
                    let bulletSprite = scene.physics.add.sprite(player.body.x, player.body.y, 'green-bullet')
                    bulletSprite.play(this.animation)
                    return bulletSprite
                },
                update: function(bullet) {
                    bullet.setVelocityY(-this.speed)
                },
                kill: function(bullet, mob) {
                    let textureName = 'explosion'
                    let animationName = textureName + '-' + 'animation' 
                    let explosionSprite = this.physics.add.sprite(mob.x, mob.y, textureName)
                    let explosionAnimation = this.anims.create({
                        key: animationName,
                        frames: this.anims.generateFrameNumbers(textureName),
                        frameRate: 20,
                        repeat: 0
                    })
                    scene.explosionSound.play()
                    explosionSprite.play(explosionAnimation)
                    scene.score += 15
                    mob.y = 0
                    let randomX = Phaser.Math.Between(100, config.scale.width - 100)
                    mob.x = randomX
                    bullet.destroy()
                    scene.time.addEvent({
                        delay: 600,
                        callback: function() {
                            explosionSprite.destroy()
                        },
                        callbackScope: this,
                        loop: false
                    })
                }
            },
            body: playerSprite,
            speed: speed,
            animation: playerAnimation,
            update: function() {
                if (this.cursorKeys.left.isDown) {
                    this.body.setVelocityX(-this.speed)
                } else if (this.cursorKeys.right.isDown) {
                    this.body.setVelocityX(this.speed)
                }

                if (this.cursorKeys.up.isDown) {
                    this.body.setVelocityY(-this.speed)
                } else if (this.cursorKeys.down.isDown) {
                    this.body.setVelocityY(this.speed)
                }

                if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                    if (this.body.active) {
                        this.shoot()
                    }
                }

                for (let i = 0; i < this.bulletBodies.getChildren().length; i++) {
                    this.bulletType.update(this.bulletBodies);
                }

            },
            destroy: function(player, mob) {
                player.x = x
                player.y = y

                this.mobs.forEach(mob => {
                    mob.reset()
                })

                scene.backgroundSound.stop()
                scene.scene.start('backgroundScene', {score: scene.score})
            },
            shoot: function() {
                scene.greenBulletSound.play()
                let bullet = this.bulletType.create()
                this.bulletBodies.add(bullet)
            }
        }

        this.player = player

        return this.player

    }

    overlapPlayerWithMobs() {
        this.physics.add.overlap(this.player.body, this.mobBodies, this.player.destroy, null, this)
        this.physics.add.overlap(this.player.bulletBodies, this.mobBodies, this.player.bulletType.kill, null, this)
    }

    createScoreText() {
         this.scoreText = this.add.text(30, 
            10, 'Score: 0', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px' 
        });
    }

    create() {
        this.explosionSound = this.sound.add('explosion_audio')
        this.greenBulletSound = this.sound.add('green_bullet_audio')
        this.score = 0
        this.createAndDrowImage()
        this.createAndPlaySound()
        this.createMobs()
        this.createExitGameButton()
        this.createPlayer()
        this.overlapPlayerWithMobs()
        this.createScoreText()
    }

    updateMobs() {
        this.mobs.forEach(mob => {
            mob.update()
        })
    }

    updateScoreText()
    {
        this.scoreText.setText('Score: ' + this.score)
    }

    update() {
        this.updateMobs()
        this.player.update()
        this.updateScoreText()
    }
}

let config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 900
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BackgroundScene, GameScene]
};


let game = new Phaser.Game(config);
