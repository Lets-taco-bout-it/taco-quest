import Phaser from "phaser";
import { switchState, toggleMute } from "../utils";

var centerX = 800 / 2,
  centerY = 600 / 2,
  background,
  welcomeText,
  startBtn,
  music,
  sound = true;

export default class extends Phaser.State {
  constructor() {
    super();
  }

  preload() {
    game.load.image("gameOver", "src/assets/game-over-outtro.png", 350, 450);
    game.load.spritesheet("start", "src/assets/playButtonSheet.png", 209, 96);
    // game.load.audio("themeSong", "src/assets/sounds/themesong.wav");
    // game.load.audio("gameSong", "src/assets/sounds/gameSong.wav");
    game.load.audio("gameOverSong", "src/assets/sounds/gameOver.wav");
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1400, 560);

    background = game.add.tileSprite(0, 0, 350, 450, "gameOver");
    // background.anchor.setTo(0.5, 0.5);
    background.scale.setTo(2.3, 2.3);

    // MUSIC AUTO PLAY ON GAME LOAD
    music = game.add.audio("gameOverSong");
    music.loop = true;
    music.play();

    game.add.text(centerX, 0, `${game.state.current}`);
    var style = {
      font: "bold 50px Roboto Mono",
      fill: "#ffffff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    welcomeText = background.game.add.text(0, 0, "PLAY AGAIN?", style);
    welcomeText.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);
    welcomeText.setTextBounds(0, 150, 800, 100);

    //PLAY BUTTON
    let actionOnClick = () => {
      switchState();
      music.destroy();
    };

    startBtn = game.add.button(
      centerX - 105,
      centerY,
      "start",
      actionOnClick,
      this,
      2,
      0,
      1,
      0
    );
  }

  update() {
    if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
      console.log("switch", game.state);
      music.destroy();
      switchState();
    }
  }
}
