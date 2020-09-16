import Phaser from 'phaser';
import Userdetails from '../../modules/scoreBoard';

class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData('isDead', false);
  }

  explode(score, scoreText) {
    if (!this.getData('isDead')) {
      this.setTexture('sprExplosion');
      this.play('sprExplosion');
      this.scene.sfx.explosions[Phaser.Math.Between(
        0, this.scene.sfx.explosions.length - 1,
      )].play();

      this.on('animationcomplete', function playIt() {
        this.destroy();
        score.increaseScore();
        scoreText.setText(score.getScore());
      }, this);
      this.setData('isDead', true);
    }
  }
}


class Spider extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'sprEnemy2');
  }
}


export default class GamePlayScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.bullets1 = '';
  }


  preload() {
    this.load.image('background', '../assets/content/bg.jpg');
    this.load.image('sprEnemy2', '../assets/content/sprEnemy2.png');
    this.load.spritesheet('sprExplosion', '../assets/content/sprExplosion.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('player', '../assets/content/ship.png');
    this.load.image('bullet1', '../assets/content/bullet11.png');
    this.load.audio('sndExplode0', '../assets/content/sndExplode0.wav');
    this.load.audio('sndExplode1', '../assets/content/sndExplode1.wav');
    this.load.audio('sndLaser', '../assets/content/sndLaser.wav');
  }

  create() {
    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    this.add.image(380, 300, 'background');
    this.ship = this.add.sprite(width / 2,
      height / 2, 'player').setDepth(1).setScale(0.2);
    this.anims.create({
      key: 'sprExplosion',
      frames: this.anims.generateFrameNumbers('sprExplosion'),
      frameRate: 20,
      repeat: 0,
    });

    this.sfx = {
      explosions: [
        this.sound.add('sndExplode0'),
        this.sound.add('sndExplode1'),
      ],
      laser: this.sound.add('sndLaser'),
    };


    this.isClicked = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastFired = 0;

    this.input.on('pointerdown', (point) => {
      this.isClicked = true;
      this.mouseX = point.x;
      this.mouseY = point.y;
    });
    this.input.on('pointermove', (point) => {
      this.mouseX = point.x;
      this.mouseY = point.y;
    });
    this.input.on('pointerup', () => {
      this.isClicked = false;
    });

    const Bullet = new Phaser.Class({

      Extends: Phaser.GameObjects.Image,

      initialize:

        function Bullet(scene) {
          Phaser.GameObjects.Image.call(this, scene, width / 2,
            height / 2, 'bullet1');

          this.incX = 0;
          this.incY = 0;
          this.lifespan = 0;
          this.scene = scene;
          this.scene.add.existing(this);
          this.scene.physics.world.enableBody(this, 0);

          this.speed = Phaser.Math.GetSpeed(600, 1);
        },

      fire(x, y) {
        this.setActive(true);
        this.setVisible(true);

        this.setPosition(width / 2,
          height / 2);

        const angle = Phaser.Math.Angle.Between(x, y, width / 2,
          height / 2);

        this.setRotation(angle);

        this.incX = Math.cos(angle);
        this.incY = Math.sin(angle);

        this.lifespan = 1000;
      },

      update(time, delta) {
        this.lifespan -= delta;
        this.x -= this.incX * (this.speed * delta);
        this.y -= this.incY * (this.speed * delta);

        if (this.lifespan <= 0) {
          this.setActive(false);
          this.setVisible(false);
        }
      },

    });

    this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 50,
      runChildUpdate: true,
    });

    this.enemies = this.add.group();
    const assetText = this.make.text({
      x: 40,
      y: 20,
      text: '',
      style: {
        fill: '#fff',
        font: '800 50px monospace',
        stroke: '#fff',
        strokeThickness: 2,
      },
    });


    this.time.addEvent({
      delay: 1000,
      callback() {
        const enemy = new Spider(
          this,
          Phaser.Math.Between(10, 700),
          Phaser.Math.Between(10, 600),
        );

        if (enemy != null) {
          enemy.setScale(2.5);
          this.enemies.add(enemy);

        }
      },
      callbackScope: this,
      loop: true,
    });

    const score = new Userdetails();

    this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
      if (enemy) {
        enemy.explode(score, assetText);
        bullet.destroy();
      }
    }, null, this);

    this.time.addEvent({
      delay: 1500,
      callback() {
        if (this.enemies.getChildren().length > 5) {
          this.ship.setTexture('sprExplosion');
          this.ship.play('sprExplosion');
          this.sfx.explosions[Phaser.Math.Between(0, this.sfx.explosions.length - 1)].play();
          this.ship.on('animationcomplete', function playThat() {
            this.ship.destroy();
            this.scene.start('GameOver');
          }, this);
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  update(time) {
    this.ship.setRotation(Phaser.Math.Angle.Between(
      this.mouseX, this.mouseY, this.ship.x, this.ship.y,
    ) - Math.PI / 2);

    if (this.isClicked && time > this.lastFired) {
      const bullet = this.bullets.get();
      bullet.setScale(0.6);
      if (bullet) {
        bullet.fire(this.mouseX, this.mouseY);
        this.sfx.laser.play();
        this.lastFired = time + 50;
      }
    }
  }
}
