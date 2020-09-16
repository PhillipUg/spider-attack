import Phaser from 'phaser';
import config from '../../Config/config';
import Button from '../../Objects/Button';
import 'regenerator-runtime';


function updatePanel(panel, content) {
  const sizer = panel.getElement('panel');
  const { scene } = panel;

  sizer.clear(true);
  const lines = content.split('\n');
  for (let li = 0, lcnt = lines.length; li < lcnt; li += 1) {
    const words = lines[li].split(' ');
    for (let wi = 0, wcnt = words.length; wi < wcnt; wi += 1) {
      sizer.add(
        scene.add.text(0, 0, words[wi], {
          fontSize: 28,
        })
          .setInteractive()
          .on('pointerdown', function playThis() {
            this.scene.print.text = this.text;
            this.setTint(Phaser.Math.Between(0, 0xffffff));
          }),
      );
    }
    if (li < (lcnt - 1)) {
      sizer.addNewLine();
    }
  }

  panel.layout();
  return panel;
}

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  preload() {
    this.load.image('gameoverBg', 'assets/content/stars.jpg');
  }

  async create() {
    this.add.image(380, 300, 'gameoverBg');
    this.COLOR_PRIMARY = 0x4e342e;
    this.COLOR_LIGHT = 0x7b5e57;
    this.COLOR_DARK = 0x260e04;

    this.text = this.add.text(config.width / 2 - 150, 20, 'GAME OVER!', {
      fill: '#fff',
      font: '800 50px monospace',
      stroke: '#fff',
      strokeThickness: 2,
    });

    this.print = this.add.text(0, 0, '');

    const scrollablePanel = this.rexUI.add.scrollablePanel({
      x: config.width / 2,
      y: config.height / 2,
      width: 350,
      height: 420,

      scrollMode: 0,

      background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, this.COLOR_PRIMARY),

      panel: {
        child: this.rexUI.add.fixWidthSizer({
          space: {
            left: 3,
            right: 3,
            top: 3,
            bottom: 3,
            item: 8,
            line: 8,
          },
        }),

        mask: {
          padding: 1,
        },
      },

      slider: {
        track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, this.COLOR_DARK),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, this.COLOR_LIGHT),
      },

      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,

        panel: 10,
      },
    })
      .layout();
    updatePanel(scrollablePanel, 'LEADERBOARD \n \n \n Loading.');
    this.url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/Yt590PvqHb8MUGHeBZLn/scores/';
    this.data = {
      user: localStorage.getItem('name'),
      score: localStorage.getItem('score'),
    };
    await fetch(this.url, {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(this.data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    updatePanel(scrollablePanel, 'LEADERBOARD \n \n \n Loading..');
    let result = await fetch(this.url, {
      mode: 'cors',
    });
    updatePanel(scrollablePanel, 'LEADERBOARD \n \n \n Loading...');
    const data = await result.json();
    result = data.result;
    result = result.sort((a, b) => +b.score - +a.score);
    const answer = {};
    result.forEach((element) => {
      if (!answer[element.user]) {
        answer[element.user] = element.score;
      } else if (+element.score > +answer[element.user]) {
        answer[element.user] = element.score;
      }
    });


    let output = 'LEADERBOARD \n \n Scroll the board to see more scores \n \n';
    for (const el in answer) {
      output += `${el} ${answer[el]} \n`;
    }

    updatePanel(scrollablePanel, output);

    this.reloadButton = new Button(this, config.width / 2, config.height / 2 + 250, 'blueButton1', 'blueButton2', 'Reload', 'Game');
  }
}
