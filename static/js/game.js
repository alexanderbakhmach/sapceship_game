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
	constructor(scene, x, y) {
        super(scene, x, y, 'green-bullet')

        this.speed = 800
        this.animationFrames = scene.anims.generateFrameNumbers('green-bullet')

        this.animation = scene.anims.create({
            key: 'greenBulletAnimation',
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

class WeaponGun extends Phaser.GameObjects.Sprite {
	constructor(scene, weapon, x, y, name) {
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
	constructor(scene, owner) {
		this.owner = owner
		this.scene = scene
		this.firedBullets = this.scene.physics.add.group()

		this.leftGun = new WeaponGun(this.scene, 
			this, 
			this.owner.x - this.owner.displayWidth / 2, 
			this.owner.y - this.owner.displayHeight / 2, 
			'green-bullet')

		this.rightGun = new WeaponGun(this.scene, 
			this, 
			this.owner.x + this.owner.displayWidth / 2, 
			this.owner.y - this.owner.displayHeight / 2, 
			'green-bullet')
	}

	update() {
		this.leftGun.x = this.owner.x - this.owner.displayWidth / 2
		this.leftGun.y = this.owner.y 

		this.rightGun.x = this.owner.x + this.owner.displayWidth / 2
		this.rightGun.y = this.owner.y 

		for (let i = 0; i < this.firedBullets.getChildren().length; i++) {
        	this.firedBullets.getChildren()[i].update()
        }
		
	}

	shoot() {
		let bulletRight = new Bullet(this.scene, this.rightGun.x, this.rightGun.y)
		let bulletLeft = new Bullet(this.scene, this.leftGun.x, this.leftGun.y)
    	this.firedBullets.add(bulletLeft)
    	this.firedBullets.add(bulletRight)
	}
}

class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
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

    	this.weapon = new Weapon(scene, this)
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
}

class InfoScene extends Phaser.Scene {
	constructor() {
        super("infoScene")
        console.log('Info scene created')
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

		this.player = new Player(this, 40, 40)
	}

	update() {
		this.player.update()
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
        this.greenBulletImageTexture = this.load.spritesheet('green-bullet', '/static/img/green_bullet.png', {
            frameWidth: 36,
            frameHeight: 36
        })
        this.playerImageTexture = this.load.spritesheet('player', '/static/img/player.png', {
            frameWidth: 66,
            frameHeight: 66
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

