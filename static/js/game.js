class GameInfoText extends Phaser.GameObjects.Text {
	constructor (scene, x, y, text, style) {
		if (!text) {
			text = `William Shakespeare (bapt. 26 April 1564 – \n
			23 April 1616)[a] was an English poet, \n 
			playwright, and actor, \n 
			widely regarded as the greatest writer in \n 
			the English language and the world's greatest dramatist. \n 
			He is often called England's national poet \n 
			and the "Bard of Avon" (or simply "the Bard").\n 
			His extant works, \n 
			including collaborations, \n 
			consist of some 39 plays, 154 sonnets, two long narrative \n 
			poems, and a few other verses, \n 
			some of uncertain authorship. \n 
			His plays have been translated \n 
			into every major living language and \n 
			are performed more often than those of any other playwright.`
		}

		if (!style) {
    		style = { 
    			fill: '#0f0', 
    			fontFamily: '"Press Start 2P"', 
    			fontSize: '15px'
    		}
    	}

    	super(scene, x, y, text, style)

    	this.lineSpacing = -20;
    	this.setOrigin(0.5);
	} 
}

class GameButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style) {
    	if (!style) {
    		style = { 
    			fill: '#0f0', 
    			fontFamily: '"Press Start 2P"', 
    			fontSize: '25px' 
    		}
    	}
        super(scene, x, y, text, style)
        this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState())
        .on('pointerout', () => this.enterButtonRestState())
        .on('pointerdown', () => this.enterButtonActiveState())
        .on('pointerup', () => {
        	this.enterButtonHoverState();
        	this.action()
        })
    }

    enterButtonHoverState() {
        this.setStyle({ fill: '#4fffa7'});
    }

    enterButtonRestState() {
        this.setStyle({ fill: '#0f0'});
    }

    enterButtonActiveState() {
        this.setStyle({ fill: '#0ff' });
    }

    action() {
    	console.log('Action')
    }
}

class GameStartButton extends GameButton {
	constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style)
     	this.setOrigin(0.5);
    }

	action() {
    	console.log('Starting the game')
    	this.scene.scene.start('gameScene');
    }
}

class GameExitButton extends GameButton {
	constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style)
     	this.setOrigin(0.5);
    }

    action() {
    	console.log('Exiting the game')
    	this.scene.scene.start('backgroundScene');
    }
}

class GameInfoButton extends GameButton {
	constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style)
     	this.setOrigin(0.5);
    }

 	action() {
    	console.log('Game info')
    	this.scene.scene.start('infoScene');
    }
}

class Bullet extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, name, speed, x, y) {
        super(scene, x, y, name)

        this.speed = speed
        this.animationFrames = scene.anims.generateFrameNumbers(name)

        this.animation = scene.anims.create({
            key: name + 'Animation',
            frames: this.animationFrames,
            frameRate: 20,
            repeat: -1
        })

        this.play(this.animation)

       	scene.add.existing(this)
    	scene.physics.add.existing(this)

    	this.setCollideWorldBounds(true)
    }

    update() {
    	this.setVelocityY(-this.speed)

    	if (this.y <= 0 ) {
    		this.destroy()
    	}
    }
}

class DidiBullet extends Bullet {
        constructor(scene, x, y) {
        super(scene, 'green-bullet', 800, x, y)
    }
}

class FireBullet extends Bullet {
        constructor(scene, x, y) {
        super(scene, 'fire-bullet', 800, x, y)
    }
}

class WeaponGun extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, name) {
        super(scene, x, y, name)

        this.animationFrames = scene.anims.generateFrameNumbers(name)

        this.animation = scene.anims.create({
            key: name + 'Animation',
            frames: this.animationFrames,
            frameRate: 20,
            repeat: -1
        })

        this.play(this.animation)

       	scene.add.existing(this)
    }
}

class Weapon {
	constructor(scene, owner, leftGun, rightGun) {
		this.owner = owner
		this.scene = scene
		this.firedBullets = this.scene.physics.add.group()

		this.leftGun = leftGun
		this.rightGun = rightGun

        leftGun.weapon = this
        rightGun.weapon = this
    }

	update() {
		this.leftGun.x = this.owner.x - this.owner.displayWidth / 2 - this.leftGun.displayWidth / 2
		this.leftGun.y = this.owner.y 

		this.rightGun.x = this.owner.x + this.owner.displayWidth / 2 + this.rightGun.displayWidth / 2
		this.rightGun.y = this.owner.y 

		for (let i = 0; i < this.firedBullets.getChildren().length; i++) {
        	this.firedBullets.getChildren()[i].update()
        }
		
	}

    destroy() {
        this.leftGun.destroy()
        this.rightGun.destroy()
    }
}

class DidiWeapon extends Weapon{
    constructor(scene, owner) {
        let leftGun = new WeaponGun(scene,  
            owner.x - owner.displayWidth / 2, 
            owner.y - owner.displayHeight / 2, 
            'didi-weapon-left')

        let rightGun = new WeaponGun(scene, 
            owner.x + owner.displayWidth / 2, 
            owner.y - owner.displayHeight / 2, 
            'didi-weapon-right')

        super(scene, owner, leftGun, rightGun)
    }

    shoot() {
        let bulletRight = new DidiBullet(this.scene, this.rightGun.x, this.rightGun.y)
        let bulletLeft = new DidiBullet(this.scene, this.leftGun.x, this.leftGun.y)
        let bulletRightDouble = new DidiBullet(this.scene, this.rightGun.x + 10, this.rightGun.y)
        let bulletLeftDouble = new DidiBullet(this.scene, this.leftGun.x - 10, this.leftGun.y)
        this.firedBullets.add(bulletLeft)
        this.firedBullets.add(bulletRight)
        this.firedBullets.add(bulletLeftDouble)
        this.firedBullets.add(bulletRightDouble)
    }
}

class FireWeapon extends Weapon{
    constructor(scene, owner) {
        let leftGun = new WeaponGun(scene,  
            owner.x - owner.displayWidth / 2, 
            owner.y - owner.displayHeight / 2, 
            'fire-weapon-left')

        let rightGun = new WeaponGun(scene, 
            owner.x + owner.displayWidth / 2, 
            owner.y - owner.displayHeight / 2, 
            'fire-weapon-right')

        super(scene, owner, leftGun, rightGun)
    }

    shoot() {
        let bulletRight = new FireBullet(this.scene, this.rightGun.x, this.rightGun.y)
        let bulletLeft = new FireBullet(this.scene, this.leftGun.x, this.leftGun.y)
        this.firedBullets.add(bulletLeft)
        this.firedBullets.add(bulletRight)
    }
}


class Booster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, x, y) {
        
        if (!x || !y) {
            x = Phaser.Math.Between(10, scene.width - 10)
            y = Phaser.Math.Between(10, scene.height - 10)
        }

        let upDown = Math.round(Math.random())
        let leftRight = Math.round(Math.random())

        super(scene, x, y, 'booster')

        this.speed = 500
        this.animationFrames = scene.anims.generateFrameNumbers('booster')

        if (upDown) {
            this.velocityY = this.speed
        } else {
            this.velocityY = -this.speed
        }

        if (leftRight) {
            this.velocityX = this.speed
        } else {
            this.velocityX = -this.speed
        }

        this.animation = scene.anims.create({
            key: 'boosterAnimation',
            frames: this.animationFrames,
            frameRate: 20,
            repeat: -1
        })

        this.play(this.animation)

        scene.add.existing(this)
        this.physics = scene.physics.add.existing(this)

        this.physics.setVelocity(this.velocityX, this.velocityY)
        this.physics.setCollideWorldBounds(true)
        this.physics.setBounce(1);

        this.boost = Math.round(Math.random())

        scene.physics.add.overlap(this, player, function(booster, player) {
            player.receiveBooster(booster.boost)
            booster.received()
        })
    }

    received() {
        console.log('Booster received')
        this.destroy()
    }
}

class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        if (!x || !y) {
            x = Phaser.Math.Between(10, scene.width - 10)
            y = 80
        }

        super(scene, x, y, 'joe-mob')

        this.health = Phaser.Math.Between(10, 20)
        this.speed = Phaser.Math.Between(70, 170)
        this.animationFrames = scene.anims.generateFrameNumbers('joe-mob')
        this.animation = scene.anims.create({
            key: 'joeMobAnimation',
            frames: this.animationFrames,
            frameRate: 20,
            repeat: -1
        })
        this.play(this.animation)

        scene.add.existing(this)
        this.physics = scene.physics.add.existing(this)
        this.physics.setVelocity(0, this.speed)
    }

    update() {
        if (this.y >= this.scene.height) {
            this.y = 80
            this.x = Phaser.Math.Between(10, this.scene.width - 10)
        }
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {

        if (!x || !y) {
            x = scene.width / 2
            y = scene.height - 80
        }

        super(scene, x, y, 'player')

        this.speed = 100
        this.animationFrames = scene.anims.generateFrameNumbers('player')
        this.cursorKeys = this.scene.cursorKeys

        this.animation = scene.anims.create({
            key: 'playerAnimation',
            frames: this.animationFrames,
            frameRate: 20,
            repeat: -1
        })

        this.play(this.animation)

       	scene.add.existing(this)
    	scene.physics.add.existing(this)

    	this.setCollideWorldBounds(true)

    	this.weapon = new DidiWeapon(scene, this)
    }

    moveUp() {
    	this.body.setVelocityY(-this.speed)
    }

    moveDown() {
    	this.body.setVelocityY(this.speed)
    }

    moveLeft() {
    	this.setVelocityX(-this.speed)
    }

    moveRight() {
    	this.setVelocityX(this.speed)
    }

    shoot() {
    	this.weapon.shoot()
    }

    update() {
   		if (this.cursorKeys.left.isDown) {
            this.moveLeft()
        } else if (this.cursorKeys.right.isDown) {
            this.moveRight()
        }

        if (this.cursorKeys.up.isDown) {
            this.moveUp()
        } else if (this.cursorKeys.down.isDown) {
            this.moveDown()
        }

        if (Phaser.Input.Keyboard.JustDown(this.scene.spaceKey)) {
            if (this.active) {
            	this.shoot()
            }
        }

        this.weapon.update()
    }

    receiveBooster(boost) {
        console.log('Player receive booster')
        this.weapon.destroy()
        
        if (boost) {
            this.weapon = new FireWeapon(this.scene, this)
        } else {
            this.weapon = new DidiWeapon(this.scene, this)
        }
    }
}

class InfoScene extends Phaser.Scene {
	constructor() {
        super("infoScene")
    }

    preload() {
    	this.canvas = this.sys.game.canvas;
		this.width = this.sys.game.canvas.width
		this.height = this.sys.game.canvas.height
    }

    create() {
		this.gameExitButton = new GameExitButton(this, this.width / 2, this.height - 50, 'Exit');
		this.gameInfoText = new GameInfoText(this, this.width / 2, this.height / 2);
		this.add.existing(this.gameExitButton);
		this.add.existing(this.gameInfoText);
	}
}

class GameScene extends Phaser.Scene {
	constructor() {
        super("gameScene")
        console.log('Game scene created')
    }

    preload() {
    	this.canvas = this.sys.game.canvas;
		this.width = this.sys.game.canvas.width
		this.height = this.sys.game.canvas.height
    }

    create() {
    	this.cursorKeys = this.input.keyboard.createCursorKeys()
    	this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		this.gameExitButton = new GameExitButton(this, this.width - 70, 50, 'Exit');
		this.add.existing(this.gameExitButton);

		this.player = new Player(this)
        this.mob = new Mob(this)
	}

	update() {
		this.player.update()
        this.mob.update()

        let random = Math.random()
        if (random > 0.1 && random < 0.2) {
            if (!this.booster || !this.booster.active) {
                this.booster = new Booster(this, this.player)
            }
        }
	}
}

class BackgroundScene extends Phaser.Scene {
	constructor() {
        super("backgroundScene")
        console.log('Background scene created')
    }

	preload() {
		this.canvas = this.sys.game.canvas;
		this.width = this.sys.game.canvas.width
		this.height = this.sys.game.canvas.height

		this.backgrundImageTexture = this.load.image('background', '/static/img/background.png')

        this.greenMobImageTexture = this.load.spritesheet('green-mob', '/static/img/green_spaceship.png', {
            frameWidth: 66,
            frameHeight: 66
        })

        this.grayMobImageTexture = this.load.spritesheet('gray-mob', '/static/img/gray_spaceship.png', {
            frameWidth: 66,
            frameHeight: 66
        })

        this.blueMobImageTexture = this.load.spritesheet('blue-mob', '/static/img/blue_spaceship.png', {
            frameWidth: 66,
            frameHeight: 66
        })

        this.explosionImageTexture = this.load.spritesheet('explosion', '/static/img/explosion.png', {
            frameWidth: 66,
            frameHeight: 66
        })

        this.greenBulletImageTexture = this.load.spritesheet('green-bullet', '/static/img/didi_bullet.png', {
            frameWidth: 5,
            frameHeight: 12
        })

        this.greenBulletImageTexture = this.load.spritesheet('didi-weapon-left', '/static/img/didi_weapon_left.png', {
            frameWidth: 16,
            frameHeight: 50
        })

        this.greenBulletImageTexture = this.load.spritesheet('didi-weapon-right', '/static/img/didi_weapon_right.png', {
            frameWidth: 16,
            frameHeight: 50
        })

        this.greenBulletImageTexture = this.load.spritesheet('fire-bullet', '/static/img/fire_bullet.png', {
            frameWidth: 15,
            frameHeight: 15
        })

        this.greenBulletImageTexture = this.load.spritesheet('fire-weapon-left', '/static/img/fire_weapon_left.png', {
            frameWidth: 25,
            frameHeight: 35
        })

        this.greenBulletImageTexture = this.load.spritesheet('fire-weapon-right', '/static/img/fire_weapon_right.png', {
            frameWidth: 25,
            frameHeight: 35
        })

        this.playerImageTexture = this.load.spritesheet('player', '/static/img/player.png', {
            frameWidth: 80,
            frameHeight: 100
        })

        this.joeMobImageTexture = this.load.spritesheet('joe-mob', '/static/img/joe_mob.png', {
            frameWidth: 50,
            frameHeight: 70
        })

        this.boostermageTexture = this.load.spritesheet('booster', '/static/img/booster.png', {
            frameWidth: 30,
            frameHeight: 30
        })

        this.backgroundAudio = this.load.audio('background_audio', '/static/sound/background.mp3')

        this.menuAudio = this.load.audio('menu_audio', '/static/sound/menu.mp3')

        this.explosionAudio = this.load.audio('explosion_audio', '/static/sound/explosion.mp3')

        this.greenBulletAudio = this.load.audio('green_bullet_audio', '/static/sound/green_bullet.mp3')
	}

	create() {
		this.gameStartButton = new GameStartButton(this, this.width / 2, this.height / 2 - 50, 'Start the new game');
		this.gameInfoButton = new GameInfoButton(this, this.width / 2, this.height / 2 + 50, 'Game info');
		this.add.existing(this.gameStartButton);
		this.add.existing(this.gameInfoButton);
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
    scene: [BackgroundScene, InfoScene, GameScene]
};


let game = new Phaser.Game(config);

