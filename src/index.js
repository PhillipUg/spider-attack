import Phaser from 'phaser';
import config from './Config/config';
import GamePlayScene from './Scenes/GameScene/GamePlayScene';
import GameOverScene from './Scenes/GameScene/GameoverScene';
import PlayerDetails from './Scenes/PlayerDetails';
import TitleScene from './Scenes/TitleScene';
import CreditsScene from './Scenes/CreditsScene';
import Model from './Model';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };

    this.scene.add('PlayerDetails', PlayerDetails);
    this.scene.add('Title', TitleScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GamePlayScene);
    this.scene.add('GameOver', GameOverScene);
    this.scene.start('PlayerDetails');
  }
}

window.game = new Game();
