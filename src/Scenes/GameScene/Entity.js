import Phaser from 'phaser';

export default class Entity extends Phaser.GameObjects.Sprite {
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

      this.on('animationcomplete', () => {
        this.destroy();
        score.increaseScore();
        scoreText.setText(score.getScore());
      }, this);
      this.setData('isDead', true);
    }
  }
}